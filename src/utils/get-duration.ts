export function getDuration(durationString: string) {
    if (!/^(\d+[a-z]+)+$/gi.test(durationString)) {
        throw Error(`Invalid duration: ${durationString}`)
    }

    const duration = {
        years: undefined as undefined | number,
        months: undefined as undefined | number,
        weeks: undefined as undefined | number,
        days: undefined as undefined | number,
        hours: undefined as undefined | number,
        minutes: undefined as undefined | number,
        seconds: undefined as undefined | number,
    }

    durationString.match(/\d+[a-z]+/gi)!.forEach((durationPart) => {
        const [, stringQuantity, unitShort] = /(\d+)([a-z]+)/gi.exec(durationPart)!
        const quantity = Number(stringQuantity)

        const unitLong = (
            {
                y: 'years',
                mo: 'months',
                w: 'weeks',
                d: 'days',
                h: 'hours',
                m: 'minutes',
                s: 'seconds',
            } as const
        )[unitShort!]

        if (Number.isNaN(quantity) || !unitLong) {
            throw Error(`Invalid duration part: ${durationPart}`)
        }

        if (duration[unitLong] !== undefined) {
            throw Error(`Duration with unit ${unitLong} was supplied multiple times`)
        }

        duration[unitLong] = quantity
    })

    return duration
}
