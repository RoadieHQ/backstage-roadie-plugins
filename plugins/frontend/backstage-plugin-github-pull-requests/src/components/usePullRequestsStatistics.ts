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
import { githubPullRequestsApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';
import { PullRequestState, SearchPullRequestsResponseData } from '../types';
import { Duration } from 'luxon';
import { useEntity } from '@backstage/plugin-catalog-react';
import { getHostname } from '../utils/githubUtils';

export type PullRequestStats = {
  avgTimeUntilMerge: string;
  avgCodingTime: string;
  mergedToClosedRatio: string;
  avgChangedLinesCount: number;
  avgAdditions: number;
  avgDeletions: number;
  avgChangedFilesCount: number;
};

export type PullRequestStatsCount = {
  avgTimeUntilMerge: number;
  avgCodingTime: number;
  closedCount: number;
  mergedCount: number;
  changedLinesCount: number;
  additions: number;
  deletions: number;
  changedFilesCount: number;
};
export type PullRequestStatsData = {
  createdAt: string;
  firstCommitAt: string;
  closedAt: string | null;
  pullRequest: {
    mergedAt: string | null;
    additions: number;
    deletions: number;
    changedFiles: number;
  };
};
function calculateStatistics(pullRequestsData: PullRequestStatsData[]) {
  const result = pullRequestsData.reduce<PullRequestStatsCount>(
    (acc, curr) => {
      acc.avgTimeUntilMerge += curr.pullRequest.mergedAt
        ? new Date(curr.pullRequest.mergedAt).getTime() -
          new Date(curr.createdAt).getTime()
        : 0;
      acc.avgCodingTime +=
        new Date(curr.createdAt).getTime() -
        new Date(curr.firstCommitAt).getTime();
      acc.mergedCount += curr.pullRequest.mergedAt ? 1 : 0;
      acc.closedCount += curr.closedAt ? 1 : 0;
      acc.additions += curr.pullRequest.additions;
      acc.deletions += curr.pullRequest.deletions;
      acc.changedLinesCount +=
        curr.pullRequest.additions + curr.pullRequest.deletions;
      acc.changedFilesCount += curr.pullRequest.changedFiles;
      return acc;
    },
    {
      avgTimeUntilMerge: 0,
      avgCodingTime: 0,
      closedCount: 0,
      mergedCount: 0,
      changedLinesCount: 0,
      changedFilesCount: 0,
      additions: 0,
      deletions: 0,
    },
  );

  return {
    ...result,
    avgChangedLinesCount: Math.round(
      result.changedLinesCount / pullRequestsData.length,
    ),
    avgChangedFilesCount: Math.round(
      result.changedFilesCount / pullRequestsData.length,
    ),
    avgAdditions: Math.round(result.additions / pullRequestsData.length),
    avgDeletions: Math.round(result.deletions / pullRequestsData.length),
  };
}
export function usePullRequestsStatistics({
  owner,
  repo,
  branch,
  pageSize,
  state,
}: {
  owner: string;
  repo: string;
  branch?: string;
  pageSize: number;
  state: PullRequestState;
}) {
  const api = useApi(githubPullRequestsApiRef);
  const { entity } = useEntity();
  const hostname = getHostname(entity);
  const {
    loading,
    value: statsData,
    error,
  } = useAsync(async (): Promise<PullRequestStats> => {
    if (!repo) {
      return {
        avgTimeUntilMerge: 'Never',
        avgCodingTime: 'Never',
        mergedToClosedRatio: '0%',
        avgChangedLinesCount: 0,
        avgChangedFilesCount: 0,
        avgAdditions: 0,
        avgDeletions: 0,
      };
    }
    const {
      pullRequestsData,
    }: {
      pullRequestsData: SearchPullRequestsResponseData;
    } = await api.listPullRequests({
      search: `state:${state}`,
      hostname,
      owner,
      repo,
      pageSize,
      page: 1,
      branch,
    });

    const botUsernames = [
      'github-actions[bot]',
      'dependabot[bot]',
      'roadie-bot',
    ];
    const transformedData = await Promise.all(
      pullRequestsData.items
        .filter(obj => {
          const login = obj.user?.login;
          return login && !botUsernames.includes(login);
        })
        .map(async pr => {
          const repoData = await api.getRepositoryData({
            url: pr.pull_request.url,
            hostname,
          });
          const commitDate = await api.getCommitDetailsData({
            hostname,
            owner,
            repo,
            number: pr.number,
          });

          return {
            createdAt: pr.created_at,
            closedAt: pr.closed_at,
            firstCommitAt: commitDate.firstCommitDate.toString(),
            pullRequest: {
              mergedAt: pr.pull_request.merged_at,
              additions: repoData.additions,
              deletions: repoData.deletions,
              changedFiles: repoData.changedFiles,
            },
          };
        }),
    );

    const calcResult = calculateStatistics(transformedData);

    if (calcResult.closedCount === 0 || calcResult.mergedCount === 0)
      return {
        ...calcResult,
        avgTimeUntilMerge: 'Never',
        avgCodingTime: 'Never',
        mergedToClosedRatio: '0%',
      };
    const avgTimeUntilMergeDiff =
      calcResult.avgTimeUntilMerge / calcResult.mergedCount;

    const avgTimeUntilMerge = Duration.fromMillis(avgTimeUntilMergeDiff)
      .shiftTo('months', 'days', 'hour')
      .toHuman({ notation: 'compact' });

    const avgCodingTimeUntilPRRaised =
      calcResult.avgCodingTime / transformedData.length;

    const avgCodingTime = Duration.fromMillis(avgCodingTimeUntilPRRaised)
      .shiftTo('months', 'days', 'hour')
      .toHuman({ notation: 'compact' });
    return {
      ...calcResult,
      avgTimeUntilMerge,
      avgCodingTime,
      mergedToClosedRatio: `${Math.round(
        (calcResult.mergedCount / calcResult.closedCount) * 100,
      )}%`,
    };
  }, [pageSize, repo, owner]);

  return [
    {
      loading,
      statsData,
      projectName: `${owner}/${repo}`,
      error,
    },
  ] as const;
}
