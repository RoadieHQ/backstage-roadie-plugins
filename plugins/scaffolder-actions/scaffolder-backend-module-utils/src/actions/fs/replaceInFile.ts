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

import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import fg from 'fast-glob';
import fs from 'fs-extra';
import { InputError } from '@backstage/errors';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';

export function createReplaceInFileAction(): TemplateAction<{
  files: Array<{
    file: string;
    find: string;
    matchRegex: boolean;
    replaceWith: string;
  }>;
}> {
  return createTemplateAction<{
    files: Array<{
      file: string;
      find: string;
      matchRegex: boolean;
      replaceWith: string;
    }>;
  }>({
    id: 'roadiehq:utils:fs:replace',
    description: 'Replaces content of a file with given values.',
    supportsDryRun: true,
    schema: {
      input: {
        required: ['files'],
        type: 'object',
        properties: {
          files: {
            title: 'Files',
            description: 'A list of files and replacements to be done',
            type: 'array',
            items: {
              type: 'object',
              required: [],
              properties: {
                file: {
                  type: 'string',
                  title:
                    'The source location of the file to be used to run replace against (supports wildcards)',
                },
                find: {
                  type: 'string',
                  title: 'A string to be replaced',
                },
                matchRegex: {
                  type: 'bool',
                  title: 'Use regex to match the find string',
                },
                replaceWith: {
                  type: 'string',
                  title: 'Text to be used to replace the found lines with',
                },
              },
            },
          },
        },
      },
    },
    async handler(ctx) {
      if (!Array.isArray(ctx.input?.files)) {
        throw new InputError('files must be an Array');
      }

      for (const file of ctx.input.files) {
        if (!file.file) {
          throw new InputError('Path to file needs to be defined');
        }
        if (!file.find || !file.replaceWith) {
          throw new InputError(
            'each file must have a find and replaceWith property',
          );
        }

        const sourceFilepath = resolveSafeChildPath(
          ctx.workspacePath,
          file.file,
        );

        const resolvedSourcePaths = await fg(sourceFilepath, {
          cwd: ctx.workspacePath,
          absolute: true,
        });

        for (const filepath of resolvedSourcePaths) {
          const content: string = fs.readFileSync(filepath).toString();

          let find: string | RegExp = file.find;
          if (file.matchRegex) {
            find = new RegExp(file.find, 'g');
          }

          const replacedContent = content.replaceAll(find, file.replaceWith);

          fs.writeFileSync(filepath, replacedContent);
        }
      }
    },
  });
}
