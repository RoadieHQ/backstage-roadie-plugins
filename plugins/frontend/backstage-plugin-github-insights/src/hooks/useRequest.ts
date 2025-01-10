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

import { useAsync } from 'react-use';
import { Octokit } from '@octokit/rest';
import { Entity } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { useProjectEntity } from './useProjectEntity';
import { useEntityGithubScmIntegration } from './useEntityGithubScmIntegration';
import { useStore } from '../components/store';
import { scmAuthApiRef } from '@backstage/integration-react';

export const useRequest = (
  entity: Entity,
  requestName: string,
  perPage: number = 0,
  maxResults: number = 0,
) => {
  const auth = useApi(scmAuthApiRef);
  const { hostname, baseUrl } = useEntityGithubScmIntegration(entity);
  const { owner, repo } = useProjectEntity(entity);

  const { state: requestState, setState: setRequestState } = useStore(
    state => state.request,
  );

  const { value, loading, error } = useAsync(async (): Promise<any> => {
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

      const response = await octokit.request(
        `GET /repos/{owner}/{repo}/${requestName}`,
        {
          headers: { 'if-none-match': requestState[requestName].etag },
          baseUrl,
          owner,
          repo,
          ...(perPage && { per_page: perPage }),
        },
      );
      const data = response.data;

      result = {
        data: maxResults ? data.slice(0, maxResults) : data,
        etag: response.headers.etag ?? '',
      };
    } catch (e: any) {
      if (e.status === 304) {
        result = requestState[requestName];
      }
    }

    return result;
  }, [baseUrl, requestName]);

  if (value?.data) {
    setRequestState(requestName, value);
  }

  return {
    value: value ? value.data : undefined,
    loading,
    error,
  };
};
