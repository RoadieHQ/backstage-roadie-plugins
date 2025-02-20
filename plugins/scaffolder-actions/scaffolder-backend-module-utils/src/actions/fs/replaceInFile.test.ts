/*
 * Copyright 2021 Larder Software Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { PassThrough } from 'stream';
import mock from 'mock-fs';
import fs from 'fs-extra';
import { createReplaceInFileAction } from './replaceInFile';
import { getVoidLogger } from '@backstage/backend-common';

describe('roadiehq:utils:fs:replace', () => {
  afterEach(() => mock.restore());
  const mockContext = {
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
    checkpoint: jest.fn(),
    getInitiatorCredentials: jest.fn(),
    workspacePath: 'lol',
    task: {
      id: 'task-id',
      emitLog: jest.fn(),
      done: jest.fn(),
      fail: jest.fn(),
      getWorkspaceName: jest.fn(),
      getWorkspacePath: jest.fn(),
      getWorkspaceInfo: jest.fn(),
    },
  };
  const action = createReplaceInFileAction();

  it('should throw error when required parameter files is not provided', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {} as any,
      }),
    ).rejects.toThrow(/files must be an Array/);
  });

  it('should throw error when required parameter files is not arr', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          files: 'not - array',
        } as any,
      }),
    ).rejects.toThrow(/files must be an Array/);
  });

  it('should throw error when required parameter files.file does not have find', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          files: [{ file: 'a', replaceWith: '' }],
        } as any,
      }),
    ).rejects.toThrow(/each file must have a find and replaceWith property/);
    await expect(
      action.handler({
        ...mockContext,
        input: {
          files: [{ file: 'a', find: '' }],
        } as any,
      }),
    ).rejects.toThrow(/each file must have a find and replaceWith property/);
  });

  it('should write file to the workspacePath with the given content', async () => {
    mock({
      'fake-tmp-dir': {
        'fake-file.yaml': 'foo: bar',
      },
    });

    await action.handler({
      ...mockContext,
      workspacePath: 'fake-tmp-dir',
      input: {
        files: [
          {
            file: 'fake-file.yaml',
            find: 'bar',
            replaceWith: 'baz',
          },
        ],
      } as any,
    });
    expect(fs.existsSync('fake-tmp-dir/fake-file.yaml')).toBe(true);
    const file = fs.readFileSync('fake-tmp-dir/fake-file.yaml', 'utf-8');
    expect(file).toEqual('foo: baz');
  });

  it('should replace regular expressions and write file to the workspacePath with the given content', async () => {
    mock({
      'fake-tmp-dir': {
        'fake-file.yaml': 'foo: bar',
      },
    });

    await action.handler({
      ...mockContext,
      workspacePath: 'fake-tmp-dir',
      input: {
        files: [
          {
            file: 'fake-file.yaml',
            find: '(.*): (.*)',
            matchRegex: true,
            replaceWith: '$1: baz',
          },
        ],
      } as any,
    });
    expect(fs.existsSync('fake-tmp-dir/fake-file.yaml')).toBe(true);
    const file = fs.readFileSync('fake-tmp-dir/fake-file.yaml', 'utf-8');
    expect(file).toEqual('foo: baz');
  });

  it('should handle multiple files with wildcards', async () => {
    mock({
      'fake-tmp-dir': {
        'fake-file-1.yaml': 'foo1: bar',
        'fake-file-2.yaml': 'foo2: bar',
      },
    });

    await action.handler({
      ...mockContext,
      workspacePath: 'fake-tmp-dir',
      input: {
        files: [
          {
            file: 'fake-file*.yaml',
            find: 'bar',
            replaceWith: 'baz',
          },
        ],
      } as any,
    });

    expect(fs.existsSync('fake-tmp-dir/fake-file-1.yaml')).toBe(true);
    const file1 = fs.readFileSync('fake-tmp-dir/fake-file-1.yaml', 'utf-8');
    expect(file1).toEqual('foo1: baz');

    expect(fs.existsSync('fake-tmp-dir/fake-file-2.yaml')).toBe(true);
    const file2 = fs.readFileSync('fake-tmp-dir/fake-file-2.yaml', 'utf-8');
    expect(file2).toEqual('foo2: baz');
  });
});
