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
import { useProjectEntity } from '../../../hooks/useProjectEntity';
import { useEntity } from '@backstage/plugin-catalog-react';
import { MarkdownContent } from '../index';
import { InfoCard } from '@backstage/core-components';
import { makeStyles } from '@material-ui/core';
import { useEntityGithubScmIntegration } from '../../../hooks/useEntityGithubScmIntegration';

const useStyles = makeStyles(theme => ({
  infoCard: {
    marginBottom: theme.spacing(3),
    '& + .MuiAlert-root': {
      marginTop: theme.spacing(3),
    },
    '& .MuiCardContent-root': {
      padding: theme.spacing(2, 1, 2, 2),
    },
  },
  readMe: {
    overflowY: 'auto',
    paddingRight: theme.spacing(1),
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#F5F5F5',
      borderRadius: '5px',
    },
    '&::-webkit-scrollbar': {
      width: '5px',
      backgroundColor: '#F5F5F5',
      borderRadius: '5px',
    },
    '&::-webkit-scrollbar-thumb': {
      border: '1px solid #555555',
      backgroundColor: '#555',
      borderRadius: '4px',
    },
  },
}));

type ReadMeCardProps = {
  maxHeight?: number;
  title?: string;
};

const ReadMeCard = (props: ReadMeCardProps) => {
  const { entity } = useEntity();
  const { owner, repo, readmePath } = useProjectEntity(entity);
  const { hostname } = useEntityGithubScmIntegration(entity);
  const classes = useStyles();

  const linkPath = readmePath || 'README.md';

  return (
    <InfoCard
      title={props.title || 'Readme'}
      className={classes.infoCard}
      deepLink={{
        link: `https://${hostname}/${owner}/${repo}/blob/HEAD/${linkPath}`,
        title: 'Readme',
        onClick: e => {
          e.preventDefault();
          window.open(
            `https://${hostname}/${owner}/${repo}/blob/HEAD/${linkPath}`,
          );
        },
      }}
    >
      <div
        className={classes.readMe}
        style={{
          maxHeight: `${props.maxHeight}px`,
        }}
      >
        <MarkdownContent
          hostname={hostname}
          owner={owner}
          repo={repo}
          path={readmePath}
        />
      </div>
    </InfoCard>
  );
};

export default ReadMeCard;
