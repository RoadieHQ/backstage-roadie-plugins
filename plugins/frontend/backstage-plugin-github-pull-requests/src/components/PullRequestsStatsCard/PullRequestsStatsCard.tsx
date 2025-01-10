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

import React, { useState } from 'react';
import {
  InfoCard,
  InfoCardVariants,
  MissingAnnotationEmptyState,
  StructuredMetadataTable,
} from '@backstage/core-components';
import {
  GITHUB_PULL_REQUESTS_ANNOTATION,
  isGithubSlugSet,
} from '../../utils/isGithubSlugSet';
import { usePullRequestsStatistics } from '../usePullRequestsStatistics';
import {
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  makeStyles,
  MenuItem,
  Select,
  Tooltip,
} from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { TooltipContent } from './components/TooltipContent';
import { GithubNotAuthorized, useGithubLoggedIn } from '../useGithubLoggedIn';

const useStyles = makeStyles(theme => ({
  infoCard: {
    marginBottom: theme.spacing(3),
    '& + .MuiAlert-root': {
      marginTop: theme.spacing(3),
    },
    '& .MuiCardContent-root': {
      padding: theme.spacing(2, 1, 2, 2),
    },
    '& td': {
      whiteSpace: 'normal',
    },
  },
}));

type Props = {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
  variant?: InfoCardVariants;
};

const StatsCard = (props: Props) => {
  const { entity } = useEntity();
  const classes = useStyles();
  const [pageSize, setPageSize] = useState<number>(20);
  const projectName = isGithubSlugSet(entity);
  const [owner, repo] = (projectName ?? '/').split('/');
  const [{ statsData, loading: loadingStatistics }] = usePullRequestsStatistics(
    {
      owner,
      repo,
      pageSize,
      state: 'closed',
    },
  );

  const metadata = {
    'average time of PR until merge': statsData?.avgTimeUntilMerge,
    'merged to closed ratio': statsData?.mergedToClosedRatio,
    'average size of PR': (
      <Tooltip
        title={
          <TooltipContent
            additions={statsData?.avgAdditions}
            deletions={statsData?.avgDeletions}
          />
        }
      >
        <div>{statsData?.avgChangedLinesCount} lines</div>
      </Tooltip>
    ),
    'average changed files of PR': `${statsData?.avgChangedFilesCount}`,
    'average coding time of PR': `${statsData?.avgCodingTime}`,
  };

  return (
    <InfoCard
      title="GitHub Pull Requests Statistics"
      className={classes.infoCard}
      variant={props.variant}
    >
      {loadingStatistics ? (
        <CircularProgress />
      ) : (
        <Box position="relative">
          <StructuredMetadataTable metadata={metadata} />
          <Box display="flex" justifyContent="flex-end">
            <FormControl>
              <Select
                value={pageSize}
                onChange={event => setPageSize(Number(event.target.value))}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
              <FormHelperText>Number of PRs</FormHelperText>
            </FormControl>
          </Box>
        </Box>
      )}
    </InfoCard>
  );
};

const PullRequestsStatsCard = (props: Props) => {
  const { entity } = useEntity();
  const projectName = isGithubSlugSet(entity);
  const isLoggedIn = useGithubLoggedIn();

  if (!projectName || projectName === '') {
    return (
      <MissingAnnotationEmptyState
        annotation={GITHUB_PULL_REQUESTS_ANNOTATION}
      />
    );
  }

  return isLoggedIn ? (
    <StatsCard {...props} />
  ) : (
    <InfoCard title="GitHub Pull Requests Statistics">
      <GithubNotAuthorized />
    </InfoCard>
  );
};

export default PullRequestsStatsCard;
