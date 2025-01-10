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
import { render, screen } from '@testing-library/react';
import { AnyApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/core-app-api';
import { rest } from 'msw';
import {
  setupRequestMockHandlers,
  TestApiProvider,
  wrapInTestApp,
} from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import { entityMock, languagesResponseMock } from '../../../mocks/mocks';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import { LanguagesCard } from '..';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import {
  scmAuthApiRef,
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { defaultIntegrationsConfig } from '../../../mocks/scmIntegrationsApiMock';

const mockScmAuth = {
  getCredentials: async () => ({ token: 'test-token' }),
};

const apis: [AnyApiRef, Partial<unknown>][] = [
  [scmAuthApiRef, mockScmAuth],
  [
    scmIntegrationsApiRef,
    ScmIntegrationsApi.fromConfig(
      ConfigReader.fromConfigs([
        {
          context: 'unit-test',
          data: defaultIntegrationsConfig,
        },
      ]),
    ),
  ],
];

describe('LanguagesCard', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  beforeEach(() => {
    worker.use(
      rest.get(
        'https://api.github.com/repos/mcalus3/backstage/languages',
        (_, res, ctx) => res(ctx.json(languagesResponseMock)),
      ),
    );
  });

  it('should display a card with the data from the requests', async () => {
    render(
      wrapInTestApp(
        <TestApiProvider apis={apis}>
          <ThemeProvider theme={lightTheme}>
            <EntityProvider entity={entityMock}>
              <LanguagesCard />
            </EntityProvider>
          </ThemeProvider>
        </TestApiProvider>,
      ),
    );

    expect(await screen.findByText(/TypeScript/)).toBeInTheDocument();
    expect(await screen.findByText(/93.73/)).toBeInTheDocument();
  });
  it('should display a card with the data from state on second render when it gets 304 response', async () => {
    const { rerender } = render(
      wrapInTestApp(
        <TestApiProvider apis={apis}>
          <ThemeProvider theme={lightTheme}>
            <EntityProvider entity={entityMock}>
              <LanguagesCard />
            </EntityProvider>
          </ThemeProvider>
        </TestApiProvider>,
      ),
    );
    worker.use(
      rest.get(
        'https://api.github.com/repos/mcalus3/backstage/languages',
        (_, res, ctx) => res(ctx.status(304), ctx.json({})),
      ),
    );

    rerender(
      wrapInTestApp(
        <TestApiProvider apis={apis}>
          <ThemeProvider theme={lightTheme}>
            <EntityProvider entity={entityMock}>
              <LanguagesCard />
            </EntityProvider>
          </ThemeProvider>
        </TestApiProvider>,
      ),
    );

    expect(await screen.findByText(/TypeScript/)).toBeInTheDocument();
    expect(await screen.findByText(/93.73/)).toBeInTheDocument();
  });
});
