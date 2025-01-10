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

import { useEffect, useState } from 'react';
import { useAsyncRetry } from 'react-use';
import { githubPullRequestsApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';
import { SearchPullRequestsResponseData } from '../types';
import { DateTime } from 'luxon';
import { useEntity } from '@backstage/plugin-catalog-react';
import { getHostname } from '../utils/githubUtils';

export type PullRequest = {
  id: number;
  number: number;
  url: string;
  title: string;
  updatedTime: string | null;
  createdTime: string | null;
  state: string;
  draft: boolean;
  merged: string | null;
  creatorNickname?: string | null;
  creatorProfileLink?: string | null;
  body: string;
};

export function usePullRequests({
  search,
  owner,
  repo,
  branch,
}: {
  search: string;
  owner: string;
  repo: string;
  branch?: string;
}) {
  const api = useApi(githubPullRequestsApiRef);
  const { entity } = useEntity();
  const hostname = getHostname(entity);
  const [total, setTotal] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const getElapsedTime = (start: string): string | null => {
    return DateTime.fromISO(start).toRelative();
  };

  const handleTotal = (total_count: number) => {
    setTotal(total_count > 1000 ? 1000 : total_count);
    setTotalResults(total_count);
  };

  const {
    loading,
    value: prData,
    retry,
    error,
  } = useAsyncRetry<PullRequest[]>(async () => {
    if (!repo) {
      return [];
    }
    return (
      api
        // GitHub API pagination count starts from 1
        .listPullRequests({
          search,
          owner,
          repo,
          pageSize,
          page: page + 1,
          branch,
          hostname,
        })
        .then(
          ({
            pullRequestsData: { total_count, items },
          }: {
            pullRequestsData: SearchPullRequestsResponseData;
          }) => {
            if (total_count >= 0) {
              handleTotal(total_count);
            }
            return items.map(
              ({
                id,
                html_url,
                title,
                number,
                created_at,
                updated_at,
                user,
                state: pr_state,
                draft,
                pull_request: { merged_at },
                body,
              }) => ({
                url: html_url,
                id,
                number,
                title,
                body: body!,
                state: pr_state,
                draft,
                merged: merged_at,
                creatorNickname: user?.login,
                creatorProfileLink: user?.html_url,
                createdTime: getElapsedTime(created_at),
                updatedTime: getElapsedTime(updated_at),
              }),
            );
          },
        )
    );
  }, [page, pageSize, repo, owner]);
  useEffect(() => {
    setPage(0);
    retry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);
  return [
    {
      page,
      pageSize,
      loading,
      prData,
      projectName: `${owner}/${repo}`,
      total,
      totalResults,
      error,
    },
    {
      prData,
      setPage,
      setPageSize,
      retry,
    },
  ] as const;
}
