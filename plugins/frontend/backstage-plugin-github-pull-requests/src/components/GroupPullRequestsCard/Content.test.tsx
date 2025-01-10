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

import React from 'react';
import { AnyApiRef, ConfigApi, configApiRef } from '@backstage/core-plugin-api';
import {
  setupRequestMockHandlers,
  TestApiProvider,
  wrapInTestApp,
} from '@backstage/test-utils';
import { cleanup, render, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { handlers } from '../../mocks/handlers';
import {
  entityMock,
  groupEntityMock,
  groupEntityMockWithSlug,
} from '../../mocks/mocks';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { Content } from './Content';
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

describe('<GroupPullRequestCard>', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);
  afterEach(() => {
    cleanup();
  });
  beforeEach(() => {
    worker.use(...handlers);
  });
  it('should render sign in page', async () => {
    const api: [AnyApiRef, Partial<unknown>][] = [
      [
        scmAuthApiRef,
        {
          getCredentials: async () => ({ token: undefined, headers: {} }),
        },
      ],
    ];
    render(
      wrapInTestApp(
        <TestApiProvider apis={api}>
          <EntityProvider entity={entityMock}>
            <Content />
          </EntityProvider>
        </TestApiProvider>,
      ),
      {},
    );

    expect(
      await screen.findByText('You are not logged into github.', {
        exact: false,
      }),
    ).toBeInTheDocument();
  });
  it('should render Pull Requests card with no reviews as team-slug missing', async () => {
    render(
      wrapInTestApp(
        <TestApiProvider apis={apis}>
          <EntityProvider entity={groupEntityMock}>
            <Content />
          </EntityProvider>
        </TestApiProvider>,
      ),
      {},
    );

    expect(
      await screen.findByText(
        'annotation is missing. You need to add the annotation to your component if you want to enable this tool.',
        { exact: false },
      ),
    ).toBeInTheDocument();
  });
  it('should render Pull Requests card with 2 reviews with matching team-assigned', async () => {
    render(
      wrapInTestApp(
        <TestApiProvider apis={apis}>
          <EntityProvider entity={groupEntityMockWithSlug}>
            <Content />
          </EntityProvider>
        </TestApiProvider>,
      ),
      {},
    );

    expect(
      await screen.findByText("Test PR don't merge", {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Revert "Sc 7454 AWS S3 docs (#640)"', {
        exact: false,
      }),
    ).toBeInTheDocument();
  });
});
