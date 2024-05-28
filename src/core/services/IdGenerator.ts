import { injectable } from "inversify";

export interface IIdGenerator {
    generateId(): string;
}

@injectable()
export class IdGenerator implements IIdGenerator {
    generateId(): string {
        return crypto.randomUUID();
    }
}
