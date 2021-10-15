import { getCacheDirectoryPath } from './utils/get-cache-dir'

export function showCacheDirectory(cacheDirectory: string | undefined) {
    console.log(getCacheDirectoryPath(cacheDirectory))
}
