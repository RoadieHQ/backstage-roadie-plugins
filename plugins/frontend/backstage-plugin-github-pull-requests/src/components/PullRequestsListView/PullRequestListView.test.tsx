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
import { cleanup, render, screen } from '@testing-library/react';
import { AnyApiRef, ConfigApi, configApiRef } from '@backstage/core-plugin-api';
import {
  setupRequestMockHandlers,
  TestApiProvider,
  wrapInTestApp,
} from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import { PullRequestsListView } from './PullRequestsListView';
import { handlers } from '../../mocks/handlers';
import { ScmAuthApi, scmAuthApiRef } from '@backstage/integration-react';
import { githubPullRequestsApiRef, GithubPullRequestsClient } from '../../api';
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
  afterEach(() => {
    cleanup();
  });
  beforeEach(() => {
    worker.use(...handlers);
  });
  it('should display the emptyStateText when no data is provided', async () => {
    render(
      <TestApiProvider apis={apis}>
        <PullRequestsListView data={[]} emptyStateText="foo bar empty" />
      </TestApiProvider>,
    );

    expect(await screen.findByText('foo bar empty')).toBeInTheDocument();
  });

  it('should display the given data', async () => {
    const testData = [
      {
        id: 1,
        state: 'open',
        draft: false,
        repositoryUrl:
          'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins',
        pullRequest: {
          htmlUrl: 'pull_request_url',
        },
        title: 'Test PR listed 1',
        number: 1,
        user: {
          login: 'TestUser',
          htmlUrl: 'user_html_url',
        },
        comments: 0,
        htmlUrl: 'repo_url',
      },
    ];
    render(
      wrapInTestApp(
        <TestApiProvider apis={apis}>
          <PullRequestsListView data={testData} emptyStateText="" />
        </TestApiProvider>,
      ),
    );

    expect(await screen.findByText('Test PR listed 1')).toBeInTheDocument();
    expect(
      await screen.findByText('RoadieHQ/roadie-backstage-plugins'),
    ).toBeInTheDocument();
    expect(await screen.findByText('#1 opened by')).toBeInTheDocument();
    expect(await screen.findByText('TestUser')).toBeInTheDocument();
  });
});
