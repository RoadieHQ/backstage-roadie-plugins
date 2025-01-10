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
import { InsightsPage } from './InsightsPage';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import { TestApiProvider, wrapInTestApp } from '@backstage/test-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';

import { AnyApiRef } from '@backstage/core-plugin-api';

import { ConfigReader } from '@backstage/core-app-api';
import {
  scmAuthApiRef,
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { defaultIntegrationsConfig } from '../../mocks/scmIntegrationsApiMock';

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

describe('Insights Page', () => {
  it('should render', async () => {
    const renderResult = render(
      wrapInTestApp(
        <TestApiProvider apis={apis}>
          <ThemeProvider theme={lightTheme}>
            <EntityProvider
              entity={{
                apiVersion: '1',
                kind: 'a',
                metadata: {
                  name: 'Example Service',
                  annotations: {
                    'github.com/project-slug': 'octocat/Hello-World',
                    'backstage.io/managed-by-location':
                      'url:https://github.com/org/repo/blob/master/catalog-info.yaml',
                  },
                },
              }}
            >
              <InsightsPage />
            </EntityProvider>
          </ThemeProvider>
        </TestApiProvider>,
      ),
    );

    expect(
      await renderResult.findByText('GitHub Insights'),
    ).toBeInTheDocument();
  });
});
