import { hashFile } from 'hasha'

export async function getFileHashes(filePaths: string[]) {
    return Object.fromEntries(
        await Promise.all(
            filePaths.map((filePath) =>
                hashFile(filePath, { algorithm: 'md5' }).then((hash) => [filePath, hash] as const),
            ),
        ),
    )
}
