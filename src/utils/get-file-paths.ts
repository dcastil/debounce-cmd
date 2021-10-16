import path from 'path'

export function getFilePaths(relativeFilePaths: string[]) {
    const cwd = process.cwd()

    return relativeFilePaths.map((file) => path.resolve(cwd, file)).sort()
}
