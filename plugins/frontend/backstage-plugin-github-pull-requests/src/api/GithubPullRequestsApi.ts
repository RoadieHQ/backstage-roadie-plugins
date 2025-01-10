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

import { createApiRef } from '@backstage/core-plugin-api';
import {
  GithubFirstCommitDate,
  GithubRepositoryData,
  GithubSearchPullRequestsDataItem,
  SearchPullRequestsResponseData,
} from '../types';

export const githubPullRequestsApiRef = createApiRef<GithubPullRequestsApi>({
  id: 'plugin.githubpullrequests.service',
});

export type GithubPullRequestsApi = {
  listPullRequests: ({
    search,
    owner,
    repo,
    pageSize,
    page,
    branch,
    hostname,
  }: {
    search: string;
    owner: string;
    repo: string;
    pageSize?: number;
    page?: number;
    branch?: string;
    hostname?: string;
  }) => Promise<{
    pullRequestsData: SearchPullRequestsResponseData;
  }>;

  getRepositoryData: ({
    hostname,
    url,
  }: {
    hostname?: string;
    url: string;
  }) => Promise<GithubRepositoryData>;

  getCommitDetailsData({
    hostname,
    owner,
    repo,
    number,
  }: {
    hostname?: string;
    owner: string;
    repo: string;
    number: number;
  }): Promise<GithubFirstCommitDate>;

  searchPullRequest({
    query,
    hostname,
  }: {
    query: string;
    hostname?: string;
  }): Promise<GithubSearchPullRequestsDataItem[]>;
};
