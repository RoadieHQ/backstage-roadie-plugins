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
import { configApiRef, AnyApiRef } from '@backstage/core-plugin-api';
import { rest } from 'msw';
import {
  setupRequestMockHandlers,
  TestApiProvider,
} from '@backstage/test-utils';
// eslint-disable-next-line
import { MemoryRouter } from 'react-router-dom';
import { setupServer } from 'msw/node';
import { alertsResponseMock, entityMock } from '../../mocks/mocks';
import { SecurityInsightsWidget } from './SecurityInsightsWidget';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { ScmAuthApi, scmAuthApiRef } from '@backstage/integration-react';

const mockScmAuth = {
  getCredentials: async () => ({ token: 'test-token', headers: {} }),
} as ScmAuthApi;

const config = {
  getOptionalConfigArray: (_: string) => [
    { getOptionalString: (_other: string) => undefined },
  ],
};

const apis: [AnyApiRef, Partial<unknown>][] = [
  [configApiRef, config],
  [scmAuthApiRef, mockScmAuth],
];

describe('Security Insights Card', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  beforeEach(() => {
    worker.use(
      rest.get(
        'https://api.github.com/repos/mcalus3/backstage/code-scanning/alerts',
        (_, res, ctx) => res(ctx.json(alertsResponseMock)),
      ),
    );
  });

  it('should display an ovreview card with the data from the requests', async () => {
    const rendered = render(
      <MemoryRouter>
        <TestApiProvider apis={apis}>
          <EntityProvider entity={entityMock}>
            <SecurityInsightsWidget />
          </EntityProvider>
        </TestApiProvider>
      </MemoryRouter>,
    );
    expect(await rendered.findByText('8 Warning')).toBeInTheDocument();
  });
});
