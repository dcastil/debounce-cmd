import del from 'del'

import { getCacheDirectoryPath } from './utils/get-cache-dir'

export function clearCacheDirectory(relativeCacheDirectory: string | undefined) {
    const deletedPaths = del.sync(getCacheDirectoryPath(relativeCacheDirectory))

    if (deletedPaths.length === 0) {
        console.log('No cache to clear')
    } else if (deletedPaths.length === 1) {
        console.log(`Deleted: ${deletedPaths[0]}`)
    } else {
        console.log('Deleted:\n', deletedPaths.join('\n'))
    }
}
