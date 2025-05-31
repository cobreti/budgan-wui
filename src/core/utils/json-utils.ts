const dateUUID = '7f5e8a12-09b3-4dfc-a726-89ed4731cb56'

export function JsonReplacer(this: any, key: string, value: any): any {
    if (this[key] instanceof Date) {
        return { type: dateUUID, value: this[key].toISOString() }
    }
    return value
}

export function JsonReviver(key: string, value: any): any {
    if (value === null || value === undefined) {
        return value
    }

    if (typeof value === 'object' && value['type'] === dateUUID) {
        return new Date(value.value)
    }

    return value
}
