/*
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
import { MissingAnnotationEmptyState } from '@backstage/core-components';
import {
  PullRequestsListView,
  SkeletonPullRequestsListView,
} from '../PullRequestsListView';
import { useGithubSearchPullRequest } from '../useGithubSearchPullRequest';
import { useGithubLoggedIn, GithubNotAuthorized } from '../useGithubLoggedIn';
import {
  isGithubTeamSlugSet,
  GITHUB_PULL_REQUESTS_TEAM_ANNOTATION,
} from '../../utils/isGithubSlugSet';
import Alert from '@material-ui/lab/Alert';
import { Entity, isGroupEntity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { getHostname } from '../../utils/githubUtils';

export const getPullRequestsQueryForGroup = (entity: Entity) => {
  const githubTeamName = isGithubTeamSlugSet(entity);

  return `is:open is:pr team-review-requested:${githubTeamName} archived:false`;
};

const PullRequestsCard = () => {
  const { entity } = useEntity();
  const hostname = getHostname(entity);
  const query = getPullRequestsQueryForGroup(entity);
  const { loading, error, value } = useGithubSearchPullRequest(query, hostname);

  if (loading) return <SkeletonPullRequestsListView />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <PullRequestsListView data={value} emptyStateText="No requested reviews." />
  );
};

export const Content = () => {
  const { entity } = useEntity();
  const hostname = getHostname(entity);
  const isLoggedIn = useGithubLoggedIn(hostname);
  if (!isLoggedIn) {
    return <GithubNotAuthorized hostname={hostname} />;
  }
  const githubTeamName = isGithubTeamSlugSet(entity);
  if (!githubTeamName || githubTeamName === '') {
    return (
      <MissingAnnotationEmptyState
        annotation={GITHUB_PULL_REQUESTS_TEAM_ANNOTATION}
      />
    );
  }
  if (isGroupEntity(entity)) {
    return <PullRequestsCard />;
  }
  return (
    <Alert severity="error">This card can only be used on Group Entities</Alert>
  );
};
