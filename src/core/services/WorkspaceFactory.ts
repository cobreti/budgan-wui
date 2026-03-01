import type { Workspace } from '../modules/Workspace/Workspace'
export interface WorkspaceFactory {
    create(handle: FileSystemFileHandle): Workspace
}
