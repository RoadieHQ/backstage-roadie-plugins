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
import { render } from '@testing-library/react';
import { entityStub, dependabotAlertsResponseMock } from '../../mocks/mocks';
import { graphql } from 'msw';
import {
  setupRequestMockHandlers,
  wrapInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import { DependabotAlertsWidget } from './DependabotAlertsWidget';
import { configApiRef, AnyApiRef } from '@backstage/core-plugin-api';
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
  getOptionalStringArray: (_: string) => ['all'],
};

const configForLowSeverity = {
  getOptionalConfigArray: (_: string) => [
    { getOptionalString: (_other: string) => undefined },
  ],
  getOptionalStringArray: (_: string) => ['low'],
};

const apis: [AnyApiRef, Partial<unknown>][] = [
  [configApiRef, config],
  [scmAuthApiRef, mockScmAuth],
];

const apisLowSeverity: [AnyApiRef, Partial<unknown>][] = [
  [configApiRef, configForLowSeverity],
  [scmAuthApiRef, mockScmAuth],
];

describe('Dependabot alerts overview', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  describe('GithubDependabotAlertsTable', () => {
    beforeEach(() => {
      entity = entityStub;
    });

    it('check if critical severity alerts are shown', async () => {
      worker.use(
        GRAPHQL_GITHUB_API.query('GetDependabotAlertsWidget', (_, res, ctx) => {
          res(ctx.data(dependabotAlertsResponseMock));
        }),
      );

      const rendered = render(
        wrapInTestApp(
          <TestApiProvider apis={apis}>
            <DependabotAlertsWidget />
          </TestApiProvider>,
        ),
      );
      expect(
        await rendered.findByTestId('severitiesContainer'),
      ).toBeInTheDocument();
      expect(
        (await rendered.findAllByText('Critical severity')).length,
      ).toBeGreaterThan(0);
      expect(
        (await rendered.findAllByText('High severity')).length,
      ).toBeGreaterThan(0);
      expect(
        (await rendered.findAllByText('Medium severity')).length,
      ).toBeGreaterThan(0);
      expect(
        (await rendered.findAllByText('Low severity')).length,
      ).toBeGreaterThan(0);
      expect(
        (await rendered.findAllByTestId('severityLevel')).length,
      ).toBeGreaterThanOrEqual(4);
    });

    it('check if only low severity is shown', async () => {
      worker.use(
        GRAPHQL_GITHUB_API.query('GetDependabotAlertsWidget', (_, res, ctx) => {
          res(ctx.data(dependabotAlertsResponseMock));
        }),
      );

      const rendered = render(
        wrapInTestApp(
          <TestApiProvider apis={apisLowSeverity}>
            <DependabotAlertsWidget />
          </TestApiProvider>,
        ),
      );
      expect((await rendered.findAllByText('0')).length).toBeGreaterThan(0);
      expect(
        (await rendered.findAllByTestId('severityLevel')).length,
      ).toBeLessThanOrEqual(1);
    });
  });
});
