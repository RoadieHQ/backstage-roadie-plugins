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
import { Entity } from '@backstage/catalog-model';
import { fireEvent, render } from '@testing-library/react';
import { dependabotAlertsResponseMock, entityStub } from '../../mocks/mocks';
import { graphql } from 'msw';
import {
  setupRequestMockHandlers,
  TestApiProvider,
  wrapInTestApp,
} from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import { DependabotAlertsTable } from './DependabotAlertsTable';
import { AnyApiRef, configApiRef } from '@backstage/core-plugin-api';
import { ScmAuthApi, scmAuthApiRef } from '@backstage/integration-react';

let entity: { entity: Entity };

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: () => {
    return entity;
  },
}));

jest.mock('@octokit/graphql', () => ({
  graphql: {
    defaults: () => {
      const gqlEndpoint = (_query: string, _params: object) => {
        return new Promise(resolve => {
          resolve(dependabotAlertsResponseMock);
        });
      };
      return gqlEndpoint;
    },
  },
}));

const GRAPHQL_GITHUB_API = graphql.link('https://api.github.com/graphql');

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

describe('Dependabot alerts overview', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('DependabotAlertsTable', () => {
    beforeEach(() => {
      entity = entityStub;
    });

    it('should show open alerts only when it first renders', async () => {
      worker.use(
        GRAPHQL_GITHUB_API.query('GetDependabotAlerts', (_, res, ctx) => {
          res(ctx.data(dependabotAlertsResponseMock));
        }),
      );

      const rendered = render(
        wrapInTestApp(
          <TestApiProvider apis={apis}>
            <DependabotAlertsTable />
          </TestApiProvider>,
        ),
      );
      expect(
        await rendered.findByText('serialize-javascript-open'),
      ).toBeVisible();
      expect(await rendered.queryByText('serialize-javascript-fixed')).toBe(
        null,
      );
      expect(await rendered.queryByText('serialize-javascript-dismissed')).toBe(
        null,
      );
    });

    it('should show all alerts when selecting the ALL filter', async () => {
      worker.use(
        GRAPHQL_GITHUB_API.query('GetDependabotAlerts', (_, res, ctx) => {
          res(ctx.data(dependabotAlertsResponseMock));
        }),
      );

      const rendered = render(
        wrapInTestApp(
          <TestApiProvider apis={apis}>
            <DependabotAlertsTable />
          </TestApiProvider>,
        ),
      );
      fireEvent.click(await rendered.findByRole('button', { name: 'ALL' }));

      expect(
        await rendered.findByText('serialize-javascript-open'),
      ).toBeVisible();
      expect(
        await rendered.findByText('serialize-javascript-fixed'),
      ).toBeVisible();
      expect(
        await rendered.findByText('serialize-javascript-dismissed'),
      ).toBeVisible();
    });

    it('should show open alerts only when filtering for them', async () => {
      worker.use(
        GRAPHQL_GITHUB_API.query('GetDependabotAlerts', (_, res, ctx) => {
          res(ctx.data(dependabotAlertsResponseMock));
        }),
      );

      const rendered = render(
        wrapInTestApp(
          <TestApiProvider apis={apis}>
            <DependabotAlertsTable />
          </TestApiProvider>,
        ),
      );
      fireEvent.click(await rendered.findByRole('button', { name: 'OPEN' }));

      expect(
        await rendered.findByText('serialize-javascript-open'),
      ).toBeVisible();
      expect(await rendered.queryByText('serialize-javascript-fixed')).toBe(
        null,
      );
      expect(await rendered.queryByText('serialize-javascript-dismissed')).toBe(
        null,
      );
    });

    it('should show fixed alerts only when filtering for them', async () => {
      worker.use(
        GRAPHQL_GITHUB_API.query('GetDependabotAlerts', (_, res, ctx) => {
          res(ctx.data(dependabotAlertsResponseMock));
        }),
      );

      const rendered = render(
        wrapInTestApp(
          <TestApiProvider apis={apis}>
            <DependabotAlertsTable />
          </TestApiProvider>,
        ),
      );
      fireEvent.click(await rendered.findByRole('button', { name: 'FIXED' }));

      expect(
        await rendered.findByText('serialize-javascript-fixed'),
      ).toBeVisible();
      expect(await rendered.queryByText('serialize-javascript-open')).toBe(
        null,
      );
      expect(await rendered.queryByText('serialize-javascript-dismissed')).toBe(
        null,
      );
    });

    it('should show dismissed alerts only when filtering for them', async () => {
      worker.use(
        GRAPHQL_GITHUB_API.query('GetDependabotAlerts', (_, res, ctx) => {
          res(ctx.data(dependabotAlertsResponseMock));
        }),
      );

      const rendered = render(
        wrapInTestApp(
          <TestApiProvider apis={apis}>
            <DependabotAlertsTable />
          </TestApiProvider>,
        ),
      );
      fireEvent.click(
        await rendered.findByRole('button', { name: 'DISMISSED' }),
      );

      expect(
        await rendered.findByText('serialize-javascript-dismissed'),
      ).toBeVisible();
      expect(await rendered.queryByText('serialize-javascript-open')).toBe(
        null,
      );
      expect(await rendered.queryByText('serialize-javascript-fixed')).toBe(
        null,
      );
    });
  });
});
