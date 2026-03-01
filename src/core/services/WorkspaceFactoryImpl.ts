import { injectable } from 'inversify'
import type { WorkspaceFactory } from './WorkspaceFactory'
import type { Workspace } from '../modules/Workspace/Workspace'
import { WorkspaceImpl } from '../modules/Workspace/WorkspaceImpl'

@injectable()
export class WorkspaceFactoryImpl implements WorkspaceFactory {
    create(): Workspace {
        return new WorkspaceImpl()
    }
}
