import { add, isAfter } from 'date-fns'
import execSh from 'exec-sh'
import flatCache from 'flat-cache'
import { isEqual } from 'lodash'

import { createCache } from './utils/get-cache-dir'
import { getCacheKey } from './utils/get-cache-key'
import { getDuration } from './utils/get-duration'
import { getFileHashes } from './utils/get-file-hashes'
import { getFilePaths } from './utils/get-file-paths'

interface DebounceCommandProps {
    relativeCacheDirectory: string | undefined
    command: string
    debounceByTime: string | undefined
    debounceByFiles: string[]
    shouldCacheOnError: boolean | undefined
}

export async function debounceCommand({
    relativeCacheDirectory,
    command,
    debounceByTime,
    debounceByFiles,
    shouldCacheOnError,
}: DebounceCommandProps) {
    if (!debounceByTime && debounceByFiles.length === 0) {
        await execSh.promise(command)
        return
    }

    const cache = flatCache.load('commands-cache.json', createCache(relativeCacheDirectory))
    const filePaths = getFilePaths(debounceByFiles)
    const duration = debounceByTime ? getDuration(debounceByTime) : undefined

    const cacheKey = getCacheKey({ duration, filePaths, command })

    const cacheData: unknown = cache.getKey(cacheKey)

    const fileHashes = filePaths.length === 0 ? undefined : await getFileHashes(filePaths)
    const currentDate = new Date()

    const areFileHashesEqual = isEqual((cacheData as any)?.fileHashes, fileHashes)
    const isCurrentTimeInDebounce = (() => {
        if (!duration) {
            return true
        }

        const lastRun = (cacheData as any)?.lastRun

        if (!lastRun) {
            return false
        }

        return isAfter(add(new Date(lastRun), duration!), currentDate)
    })()

    if (areFileHashesEqual && isCurrentTimeInDebounce) {
        return
    }

    let execPromise = execSh.promise(command)

    if (shouldCacheOnError) {
        execPromise = execPromise.catch((error: unknown) => {
            cache.setKey(cacheKey, {
                lastRun: currentDate,
                fileHashes,
            })
            cache.save(true)

            throw error
        })
    }

    await execPromise

    cache.setKey(cacheKey, {
        lastRun: currentDate,
        fileHashes,
    })
    cache.save(true)
}
