import { getCacheDirectoryPath } from './utils/get-cache-dir'

export function showCacheDirectory(relativeCacheDirectory: string | undefined) {
    console.log(getCacheDirectoryPath(relativeCacheDirectory))
}
