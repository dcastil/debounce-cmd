import path from 'path'

import findCacheDir from 'find-cache-dir'

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
