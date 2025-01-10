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
import { AnyApiRef, errorApiRef } from '@backstage/core-plugin-api';
import { TestApiProvider } from '@backstage/test-utils';
import { render, screen } from '@testing-library/react';
import MarkdownContent from './MarkdownContent';
import {
  GetContentProps,
  GetContentResponse,
  GithubApi,
  githubApiRef,
} from '../../../apis';
import { scmAuthApiRef } from '@backstage/integration-react';

const mockScmAuth = {
  getCredentials: async () => ({ token: 'test-token' }),
};

const mockGithubApi: GithubApi = {
  async getContent(props: GetContentProps): Promise<GetContentResponse> {
    const { owner, repo, path, branch } = props;

    if (
      owner === 'test' &&
      path === '.backstage/home-page.md' &&
      repo === 'roadie-backstage-plugins' &&
      branch === undefined
    ) {
      return {
        content: '⭐',
        links: {},
        media: {},
      };
    }

    if (
      owner === 'test' &&
      path === '.backstage/file-with-relative-image.md' &&
      repo === 'roadie-backstage-plugins' &&
      branch === undefined
    ) {
      return {
        content: '[![Image](image.svg)](https://asdf.com)',
        links: {},
        media: {
          'image.svg': 'data:image/svg+xml;base64,adfwefwef',
        },
      };
    }

    throw new Error('not found');
  },
};

const apis: [AnyApiRef, Partial<unknown>][] = [
  [scmAuthApiRef, mockScmAuth],
  [githubApiRef, mockGithubApi],
  [errorApiRef, jest.fn()],
];

describe('<MarkdownContent>', () => {
  it('should render sign in page', async () => {
    const api: [AnyApiRef, Partial<unknown>][] = [
      [
        scmAuthApiRef,
        {
          getCredentials: async () => ({ token: undefined }),
        },
      ],
    ];
    render(
      <TestApiProvider apis={api}>
        <MarkdownContent
          owner="test"
          path=".backstage/home-page.md"
          repo="roadie-backstage-plugins"
        />
      </TestApiProvider>,
      {},
    );

    expect(
      await screen.findByText('You are not logged into github.', {
        exact: false,
      }),
    ).toBeInTheDocument();
  });
  it('should render markdown card', async () => {
    render(
      <TestApiProvider apis={apis}>
        <MarkdownContent
          owner="test"
          path=".backstage/home-page.md"
          repo="roadie-backstage-plugins"
        />
      </TestApiProvider>,
      {},
    );

    expect(await screen.findByText('⭐')).toBeVisible();
  });
});
