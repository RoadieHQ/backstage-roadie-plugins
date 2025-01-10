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
import { useApi } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import { GithubRepositoryData } from '../types';
import { githubPullRequestsApiRef } from '../api';

export const useGithubRepositoryData = (url: string) => {
  const githubPullRequestsApi = useApi(githubPullRequestsApiRef);

  let domain = '';
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      domain = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
    } else {
      throw new Error('Hostname is not valid for domain extraction');
    }
  } catch (err) {
    throw new Error('Invalid URL for extracting domain');
  }

  return useAsync(async (): Promise<GithubRepositoryData> => {
    return githubPullRequestsApi.getRepositoryData({
      url,
      hostname: domain,
    });
  }, [githubPullRequestsApi, domain]);
};
