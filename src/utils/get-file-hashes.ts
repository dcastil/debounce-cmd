import hasha from 'hasha'

export async function getFileHashes(filePaths: string[]) {
    return Object.fromEntries(
        await Promise.all(
            filePaths.map((filePath) =>
                hasha
                    .fromFile(filePath, { algorithm: 'md5' })
                    .then((hash) => [filePath, hash] as const)
            )
        )
    )
}
