/*
 * Copyright 2025 Larder Software Limited
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

import React from 'react';
import { render } from '@testing-library/react';
import { configApiRef, AnyApiRef, ConfigApi } from '@backstage/core-plugin-api';
import { rest } from 'msw';
import {
  setupRequestMockHandlers,
  TestApiProvider,
} from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import { githubPullRequestsApiRef } from '../..';
import { GithubPullRequestsClient } from '../../api';
import { entityMock, openPullsRequestMock } from '../../mocks/mocks';
import { PullRequestsTable } from './PullRequestsTable';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { ScmAuthApi, scmAuthApiRef } from '@backstage/integration-react';
import { ConfigReader } from '@backstage/core-app-api';
import { defaultIntegrationsConfig } from '../../mocks/scmIntegrationsApiMock';

const mockScmAuth = {
  getCredentials: async () => ({ token: 'test-token', headers: {} }),
} as ScmAuthApi;

const config = {
  getOptionalConfigArray(_: string) {
    return [{ getOptionalString: (_s: string) => undefined }];
  },
} as ConfigApi;

const apis: [AnyApiRef, Partial<unknown>][] = [
  [configApiRef, config],
  [scmAuthApiRef, mockScmAuth],
  [
    githubPullRequestsApiRef,
    new GithubPullRequestsClient({
      configApi: ConfigReader.fromConfigs([
        {
          context: 'unit-test',
          data: defaultIntegrationsConfig,
        },
      ]),
      scmAuthApi: mockScmAuth,
    }),
  ],
];

describe('PullRequestsTable', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  beforeEach(() => {
    worker.use(
      rest.get('https://api.github.com/search/issues', (_, res, ctx) =>
        res(ctx.json(openPullsRequestMock)),
      ),
    );
  });

  it('should display a table with data from requests', async () => {
    const rendered = render(
      <TestApiProvider apis={apis}>
        <EntityProvider entity={entityMock}>
          <PullRequestsTable />
        </EntityProvider>
      </TestApiProvider>,
    );
    expect(
      await rendered.findByText('Remove old instructions'),
    ).toBeInTheDocument();
    expect(await rendered.findByText('martina-if')).toBeInTheDocument();
    expect(await rendered.findByText('iain-b')).toBeInTheDocument();
    expect(
      await rendered.findByText('Complete code migration to plugins repo'),
    ).toBeInTheDocument();
  });
});
