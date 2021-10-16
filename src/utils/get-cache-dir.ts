import path from 'path'

import findCacheDir from 'find-cache-dir'
import makeDir from 'make-dir'

import { name } from '../../package.json'

export function getCacheDirectoryPath(relativeCacheDirectoryPath: string | undefined) {
    if (relativeCacheDirectoryPath) {
        return path.resolve(process.cwd(), relativeCacheDirectoryPath)
    }

    const resolvedCacheDirectory = findCacheDir({ name })

    if (!resolvedCacheDirectory) {
        throw Error('Could not find cache directory. Please provide a cache directory manually.')
    }

    return resolvedCacheDirectory
}

export function createCache(relativeCacheDirectoryPath: string | undefined) {
    if (relativeCacheDirectoryPath) {
        const absoluteCacheDirectoryPath = makeDir.sync(relativeCacheDirectoryPath)

        return absoluteCacheDirectoryPath
    }

    const resolvedCachePath = findCacheDir({ name, create: true })

    if (!resolvedCachePath) {
        throw Error('Could not find cache directory. Please provide a cache directory manually.')
    }

    return resolvedCachePath
}
