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

import { useAsync } from 'react-use';
import { Octokit } from '@octokit/rest';
import { useApi } from '@backstage/core-plugin-api';
import { useEntityGithubScmIntegration } from './useEntityGithubScmIntegration';
import { ContributorData, GithubRequestState } from '../components/types';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useStore } from '../components/store';
import { scmAuthApiRef } from '@backstage/integration-react';

export const useContributor = (
  username: string,
): { contributor?: ContributorData; error?: Error; loading: boolean } => {
  const auth = useApi(scmAuthApiRef);
  const { entity } = useEntity();
  const { hostname, baseUrl } = useEntityGithubScmIntegration(entity);

  const { state: contributorData, setState: setContributorData } = useStore(
    state => state.contributor,
  );

  const { value, loading, error } = useAsync(async (): Promise<
    GithubRequestState | undefined
  > => {
    let result;
    try {
      const { token } = await auth.getCredentials({
        url: `https://${hostname}/`,
        additionalScope: {
          customScopes: {
            github: ['repo'],
          },
        },
      });

      const octokit = new Octokit({ auth: token });

      const response = await octokit.request(`GET /users/${username}`, {
        headers: { 'if-none-match': contributorData[username].etag },
        baseUrl,
      });

      result = {
        data: response.data as ContributorData,
        etag: response.headers.etag ?? '',
      };
    } catch (e: any) {
      if (e.status === 304) {
        result = contributorData[username];
      }
    }
    return result;
  }, [username, baseUrl]);

  if (value) {
    setContributorData(username, value);
  }

  return {
    contributor: value ? (value.data as ContributorData) : undefined,
    loading,
    error,
  };
};
