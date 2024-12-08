import { add, isAfter } from 'date-fns'
import execSh from 'exec-sh'
import flatCache from 'flat-cache'
import { isEqual } from 'lodash'

import { createCache } from './utils/get-cache-dir'
import { getCacheKey } from './utils/get-cache-key'
import { getDuration } from './utils/get-duration'
import { getFileHashes } from './utils/get-file-hashes'
import { getFilePaths } from './utils/get-file-paths'

interface RunCommandProps {
    relativeCacheDirectory: string | undefined
    command: string
    cacheByTime: string | undefined
    cacheByFiles: string[]
    shouldCacheOnError: boolean | undefined
}

export async function runCommand({
    relativeCacheDirectory,
    command,
    cacheByTime: cacheByTime,
    cacheByFiles: cacheByFiles,
    shouldCacheOnError,
}: RunCommandProps) {
    if (!cacheByTime && cacheByFiles.length === 0) {
        console.log(`Executing command "${command}" due to no caching options provided`)
        await execSh.promise(command)
        return
    }

    const cache = flatCache.load('commands-cache.json', createCache(relativeCacheDirectory))
    const filePaths = getFilePaths(cacheByFiles)
    const duration = cacheByTime ? getDuration(cacheByTime) : undefined

    const cacheKey = getCacheKey({ duration, filePaths, command })

    const cacheData: unknown = cache.getKey(cacheKey)

    const fileHashes = filePaths.length === 0 ? undefined : await getFileHashes(filePaths)
    const currentDate = new Date()

    const areFileHashesEqual = isEqual((cacheData as any)?.fileHashes, fileHashes)
    const isWithinCacheTime = (() => {
        if (!duration) {
            return true
        }

        const lastRun = (cacheData as any)?.lastRun

        if (!lastRun) {
            return false
        }

        return isAfter(add(new Date(lastRun), duration), currentDate)
    })()

    if (areFileHashesEqual && isWithinCacheTime) {
        console.log(
            [
                `Skipping command "${command}" due to`,
                [fileHashes && 'unchanged files', duration && 'being within cache time']
                    .filter(Boolean)
                    .join(' and '),
            ].join(' ')
        )
        return
    }

    console.log(
        [
            `Executing command "${command}" due to`,
            [fileHashes && 'changed files', duration && 'cache time passing']
                .filter(Boolean)
                .join(' and '),
        ].join(' ')
    )
    let execPromise = execSh.promise(command)

    function setCache() {
        cache.setKey(cacheKey, {
            lastRun: currentDate,
            fileHashes,
        })
        cache.save(true)
        console.log(`Cache saved for command "${command}"`)
    }

    if (shouldCacheOnError) {
        execPromise = execPromise.catch((error: unknown) => {
            setCache()

            throw error
        })
    }

    await execPromise

    setCache()
}
