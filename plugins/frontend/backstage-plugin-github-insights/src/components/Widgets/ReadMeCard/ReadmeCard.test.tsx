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
import { render, screen } from '@testing-library/react';
import { AnyApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/core-app-api';
import { TestApiProvider, wrapInTestApp } from '@backstage/test-utils';
import { entityMock } from '../../../mocks/mocks';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import { ReadMeCard } from '..';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import {
  scmAuthApiRef,
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { defaultIntegrationsConfig } from '../../../mocks/scmIntegrationsApiMock';
import {
  GetContentProps,
  GetContentResponse,
  GithubApi,
  githubApiRef,
} from '../../../apis';

// MarkdownContent uses rect-markdown which throws a type error in the tests so we are mocking it checking the plain text in the components.
jest.mock('@backstage/core-components', () => ({
  ...jest.requireActual('@backstage/core-components'),
  MarkdownContent: ({ content }: { content: string }) => <span>{content}</span>,
}));

const mockGithubApi: GithubApi = {
  async getContent(props: GetContentProps): Promise<GetContentResponse> {
    const { owner, repo, branch } = props;

    if (owner === 'mcalus3' && repo === 'backstage' && branch === undefined) {
      return {
        content: '⭐',
        links: {},
        media: {},
      };
    }

    throw new Error(`${JSON.stringify(props)} NotFound`);
  },
};
const mockScmAuth = {
  getCredentials: async () => ({ token: 'test-token' }),
};

const apis: [AnyApiRef, Partial<unknown>][] = [
  [githubApiRef, mockGithubApi],
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

describe('ReadmeCard', () => {
  it('should display the title header', async () => {
    render(
      wrapInTestApp(
        <TestApiProvider apis={apis}>
          <ThemeProvider theme={lightTheme}>
            <EntityProvider entity={entityMock}>
              <ReadMeCard title="hello" />
            </EntityProvider>
          </ThemeProvider>
        </TestApiProvider>,
      ),
    );
    expect(await screen.findByText(/hello/)).toBeInTheDocument();
  });

  it('should render unicode correctly', async () => {
    render(
      wrapInTestApp(
        <TestApiProvider apis={apis}>
          <ThemeProvider theme={lightTheme}>
            <EntityProvider entity={entityMock}>
              <ReadMeCard />
            </EntityProvider>
          </ThemeProvider>
        </TestApiProvider>,
      ),
    );
    expect(await screen.findByText('⭐', { exact: false })).toBeInTheDocument();
  });
});
