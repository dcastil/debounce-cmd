interface GetCacheKeyProps {
    duration: Duration | undefined
    filePaths: string[]
    command: string
}

interface Duration {
    years: number | undefined
    months: number | undefined
    weeks: number | undefined
    days: number | undefined
    hours: number | undefined
    minutes: number | undefined
    seconds: number | undefined
}

export function getCacheKey({ duration, filePaths, command }: GetCacheKeyProps) {
    return [
        'cwd:' + process.cwd(),
        'cmd:' + command,
        duration && 'time:' + JSON.stringify(duration),
        filePaths.length !== 0 && 'files:' + filePaths.join(','),
    ]
        .filter(Boolean)
        .join(' ---')
}
