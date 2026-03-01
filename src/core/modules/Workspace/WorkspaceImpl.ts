import { injectable } from 'inversify'
import type { Workspace } from './Workspace'
@injectable()
export class WorkspaceImpl implements Workspace {
    public readonly filename: string
    constructor(
        public readonly handle: FileSystemFileHandle
    ) {
        this.filename = handle.name
    }
}
