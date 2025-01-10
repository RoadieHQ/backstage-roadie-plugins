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

import { GithubPullRequestsApi } from './GithubPullRequestsApi';
import { readGithubIntegrationConfigs } from '@backstage/integration';
import { Octokit } from '@octokit/rest';
import {
  SearchPullRequestsResponseData,
  GithubRepositoryData,
  GithubFirstCommitDate,
  GetSearchPullRequestsResponseType,
  GithubSearchPullRequestsDataItem,
} from '../types';
import { ConfigApi } from '@backstage/core-plugin-api';
import { ScmAuthApi } from '@backstage/integration-react';
import { DateTime } from 'luxon';

export class GithubPullRequestsClient implements GithubPullRequestsApi {
  private readonly configApi: ConfigApi;
  private readonly scmAuthApi: ScmAuthApi;

  constructor(options: { configApi: ConfigApi; scmAuthApi: ScmAuthApi }) {
    this.configApi = options.configApi;
    this.scmAuthApi = options.scmAuthApi;
  }

  private async getOctokit(hostname: string = 'github.com'): Promise<Octokit> {
    const { token } = await this.scmAuthApi.getCredentials({
      url: `https://${hostname}/`,
      additionalScope: {
        customScopes: {
          github: ['repo'],
        },
      },
    });
    const configs = readGithubIntegrationConfigs(
      this.configApi.getOptionalConfigArray('integrations.github') ?? [],
    );
    const githubIntegrationConfig = configs.find(v => v.host === hostname);
    const baseUrl = githubIntegrationConfig?.apiBaseUrl;
    return new Octokit({ auth: token, baseUrl });
  }

  async listPullRequests({
    search = '',
    owner,
    repo,
    pageSize = 5,
    page,
    hostname,
  }: {
    search: string;
    owner: string;
    repo: string;
    pageSize?: number;
    page?: number;
    hostname?: string;
  }): Promise<{
    pullRequestsData: SearchPullRequestsResponseData;
  }> {
    const octokit = await this.getOctokit(hostname);
    const pullRequestResponse = await octokit.search.issuesAndPullRequests({
      q: `${search} in:title type:pr repo:${owner}/${repo}`,
      per_page: pageSize,
      page,
    });
    return {
      pullRequestsData:
        pullRequestResponse.data as any as SearchPullRequestsResponseData,
    };
  }
  async getRepositoryData({
    hostname,
    url,
  }: {
    hostname?: string;
    url: string;
  }): Promise<GithubRepositoryData> {
    const octokit = await this.getOctokit(hostname);
    const response = await octokit.request({ url: url });

    return {
      htmlUrl: response.data.html_url,
      fullName: response.data.full_name,
      additions: response.data.additions,
      deletions: response.data.deletions,
      changedFiles: response.data.changed_files,
    };
  }

  async getCommitDetailsData({
    hostname,
    owner,
    repo,
    number,
  }: {
    hostname: string;
    owner: string;
    repo: string;
    number: number;
  }): Promise<GithubFirstCommitDate> {
    const octokit = await this.getOctokit(hostname);
    const { data: commits } = await octokit.pulls.listCommits({
      owner: owner,
      repo: repo,
      pull_number: number,
    });
    const firstCommit = commits[0];
    return {
      firstCommitDate: new Date(firstCommit.commit.author!.date!),
    };
  }

  async searchPullRequest({
    query,
    hostname,
  }: {
    query: string;
    hostname?: string;
  }): Promise<GithubSearchPullRequestsDataItem[]> {
    const octokit = await this.getOctokit(hostname);
    const pullRequestResponse: GetSearchPullRequestsResponseType =
      await octokit.search.issuesAndPullRequests({
        q: query,
        per_page: 100,
        page: 1,
      });
    return pullRequestResponse.data.items.map(pr => ({
      id: pr.id,
      state: pr.state,
      draft: pr.draft ?? false,
      merged: pr.pull_request?.merged_at ?? undefined,
      repositoryUrl: pr.repository_url,
      pullRequest: {
        htmlUrl: pr.pull_request?.html_url || undefined,
        created_at: DateTime.fromISO(pr.created_at).toRelative() || undefined,
      },
      title: pr.title,
      number: pr.number,
      user: {
        login: pr.user?.login,
        htmlUrl: pr.user?.html_url,
      },
      comments: pr.comments,
      htmlUrl: pr.html_url,
    }));
  }
}
