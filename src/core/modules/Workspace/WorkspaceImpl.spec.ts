import { describe, test, expect } from 'vitest'
import { WorkspaceImpl } from './WorkspaceImpl'

describe('WorkspaceImpl', () => {
    test('should throw error if handle is not a file', () => {
        // Arrange
        const directoryHandle = {
            kind: 'directory',
            name: 'my-folder'
        } as unknown as FileSystemFileHandle

        // Act & Assert
        expect(() => new WorkspaceImpl(directoryHandle)).toThrow('Workspace handle must be a file')
    })

    test('should create workspace if handle is a file', () => {
        // Arrange
        const fileHandle = {
            kind: 'file',
            name: 'test.bdg'
        } as unknown as FileSystemFileHandle

        // Act
        const workspace = new WorkspaceImpl(fileHandle)

        // Assert
        expect(workspace.filename).toBe('test.bdg')
        expect(workspace.handle).toBe(fileHandle)
    })
})
