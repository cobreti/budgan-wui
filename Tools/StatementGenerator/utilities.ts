import type { Parameters } from './parameters'

export function generateRandomDates(params: Parameters): Date[] {
    const dates: Date[] = []
    const startTime = params.startDate.getTime()
    const endTime = params.endDate.getTime()

    for (let i = 0; i < params.linesCount; i++) {
        const randomTime = startTime + Math.random() * (endTime - startTime)
        const tempDate = new Date(randomTime)
        tempDate.setHours(0, 0, 0, 0)
        dates.push(tempDate)
    }

    return dates
}
