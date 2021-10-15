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

export function createGetCachePath(relativeCacheDirectoryPath: string | undefined) {
    if (relativeCacheDirectoryPath) {
        const absoluteCacheDirectoryPath = makeDir.sync(relativeCacheDirectoryPath)

        return (...args: string[]) => path.join(absoluteCacheDirectoryPath, ...args)
    }

    const resolvedGetCachePath = findCacheDir({ name, create: true, thunk: true })

    if (!resolvedGetCachePath) {
        throw Error('Could not find cache directory. Please provide a cache directory manually.')
    }

    return resolvedGetCachePath
}
