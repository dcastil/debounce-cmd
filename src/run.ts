import execSh from 'exec-sh'
import flatCache from 'flat-cache'
import { isEqual } from 'lodash'
import { add, isAfter } from 'date-fns'

import { createCache } from './utils/get-cache-dir'
import { getFilePaths } from './utils/get-file-paths'
import { getDuration } from './utils/get-duration'
import { getCacheKey } from './utils/get-cache-key'
import { getFileHashes } from './utils/get-file-hashes'

interface DebounceCommandProps {
    relativeCacheDirectory: string | undefined
    command: string
    debounceByTime: string | undefined
    debounceByFiles: string[]
}

export async function debounceCommand({
    relativeCacheDirectory,
    debounceByTime,
    debounceByFiles,
    command,
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

    cache.setKey(cacheKey, {
        lastRun: currentDate,
        fileHashes,
    })
    cache.save(true)

    await execSh.promise(command)
}
