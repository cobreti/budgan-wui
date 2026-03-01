import type { Workspace } from '../modules/Workspace/Workspace'

export interface WorkspaceFactory {
    create(): Workspace
}
