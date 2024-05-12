export interface IIdGenerator {
    generateId(): string;
}

export class IdGenerator implements IIdGenerator {
    generateId(): string {
        return crypto.randomUUID();
    }
}
