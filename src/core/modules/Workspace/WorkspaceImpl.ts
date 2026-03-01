import { injectable } from 'inversify'
import type { Workspace } from './Workspace'
@injectable()
export class WorkspaceImpl implements Workspace {
    public readonly filename: string
    constructor(
        public readonly handle: FileSystemFileHandle
    ) {
        if (handle.kind !== 'file') {
            throw new Error('Workspace handle must be a file')
        }
        this.filename = handle.name
    }
}
