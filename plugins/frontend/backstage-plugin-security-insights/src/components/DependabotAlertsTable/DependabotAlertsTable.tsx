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

import React, { FC, useMemo, useState } from 'react';
import { useAsync } from 'react-use';
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
// eslint-disable-next-line
import Alert from '@material-ui/lab/Alert';
import { DateTime } from 'luxon';
import { graphql } from '@octokit/graphql';
import { useApi } from '@backstage/core-plugin-api';
import { Link, Progress, Table, TableColumn } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useProjectName } from '../useProjectName';
import { useUrl } from '../useUrl';
import { useProjectEntity } from '../useProjectEntity';
import { scmAuthApiRef } from '@backstage/integration-react';

type State = 'OPEN' | 'FIXED' | 'DISMISSED';
type StateFilter = State | 'ALL';

type Node = {
  state: State;
  createdAt: string;
  vulnerableManifestPath: string;
  securityVulnerability: {
    package: {
      name: string;
    };
    severity: string;
    advisory: {
      description: string;
    };
    firstPatchedVersion: {
      identifier?: string;
    };
  };
};

type Repository = {
  vulnerabilityAlerts: {
    totalCount: number;
    nodes: Node[];
  };
};

type DetailsUrl = {
  hostname: string;
  owner: string;
  repo: string;
};

type DenseTableProps = {
  repository: Repository;
  detailsUrl: DetailsUrl;
};

const capitalize = (s: string) => {
  return s.charAt(0).toLocaleUpperCase() + s.slice(1);
};

const getDetailsUrl = (
  packageName: string,
  detailsUrl: DetailsUrl,
  state: State,
  vulnerableManifestPath: string,
) => {
  const url = new URL(
    `https://${detailsUrl.hostname}/${detailsUrl.owner}/${detailsUrl.repo}/security/dependabot`,
  );

  const queryParts = [
    `is:${state === 'OPEN' ? 'open' : 'closed'}`,
    `manifest:${vulnerableManifestPath}`,
    `package:${packageName}`,
  ];
  url.searchParams.set('q', queryParts.join(' '));

  return <Link to={url.toString()}>{packageName}</Link>;
};

const COLUMNS: TableColumn[] = [
  { title: 'Name', field: 'name' },
  { title: 'Created', field: 'createdAt' },
  { title: 'State', field: 'state' },
  { title: 'Severity', field: 'severity' },
  { title: 'Patched Version', field: 'patched_version' },
];

export const DenseTable: FC<DenseTableProps> = ({ repository, detailsUrl }) => {
  const { entity } = useEntity();
  const projectName = useProjectName(entity);
  const [stateFilter, setStateFilter] = useState<StateFilter>('OPEN');

  const filteredTableData = useMemo(() => {
    const issues = repository.vulnerabilityAlerts.nodes;
    if (stateFilter === 'ALL') {
      return issues;
    }
    return issues.filter(node => node.state === stateFilter);
  }, [stateFilter, repository]);

  const structuredData = filteredTableData.map(node => {
    return {
      createdAt: DateTime.fromISO(node.createdAt).toLocaleString(),
      state: capitalize(node.state),
      name: getDetailsUrl(
        node.securityVulnerability.package.name,
        detailsUrl,
        node.state,
        node.vulnerableManifestPath,
      ),
      severity: capitalize(node.securityVulnerability.severity.toLowerCase()),
      patched_version:
        node?.securityVulnerability?.firstPatchedVersion?.identifier || '',
    };
  });
  return (
    <Table
      title={
        <>
          <Box display="flex" alignItems="center">
            <GitHubIcon />
            <Box mr={1} />
            <Typography variant="h6">{projectName}</Typography>
          </Box>
          <Paper>
            <Box position="absolute" right={350} top={20}>
              <ButtonGroup
                color="primary"
                aria-label="text primary button group"
              >
                <Button
                  color={stateFilter === 'ALL' ? 'primary' : 'default'}
                  onClick={() => setStateFilter('ALL')}
                >
                  ALL
                </Button>
                <Button
                  color={stateFilter === 'OPEN' ? 'primary' : 'default'}
                  onClick={() => setStateFilter('OPEN')}
                >
                  OPEN
                </Button>
                <Button
                  color={stateFilter === 'FIXED' ? 'primary' : 'default'}
                  onClick={() => setStateFilter('FIXED')}
                >
                  FIXED
                </Button>
                <Button
                  color={stateFilter === 'DISMISSED' ? 'primary' : 'default'}
                  onClick={() => setStateFilter('DISMISSED')}
                >
                  DISMISSED
                </Button>
              </ButtonGroup>
            </Box>
          </Paper>
        </>
      }
      options={{ search: true, paging: true, padding: 'dense' }}
      columns={COLUMNS}
      data={structuredData}
    />
  );
};

export const DependabotAlertsTable: FC<{}> = () => {
  const { entity } = useEntity();
  const { hostname, baseUrl } = useUrl(entity);
  const { owner, repo } = useProjectEntity(entity);
  const scmAuth = useApi(scmAuthApiRef);

  const query = `
  query GetDependabotAlerts($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      vulnerabilityAlerts(first: 100) {
        totalCount
        nodes {
          state
          createdAt
          id
          vulnerableManifestPath
          securityVulnerability {
            vulnerableVersionRange
            package {
              name
            }
            firstPatchedVersion {
              identifier
            }
            severity
            advisory {
              description
            }
          }
        }
      }
    }
  }`;

  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const credentials = await scmAuth.getCredentials({
      additionalScope: {
        customScopes: { github: ['repo'] },
      },
      url: `https://${hostname}`,
      optional: true,
    });
    const gqlEndpoint = graphql.defaults({
      baseUrl,
      headers: {
        authorization: `token ${credentials.token}`,
      },
    });
    const { repository } = await gqlEndpoint<any>(query, {
      name: repo,
      owner: owner,
    });
    return repository;
  }, []);

  const detailsUrl = { hostname, owner, repo };

  if (loading) return <Progress />;
  if (error) {
    return (
      <Alert severity="error">
        <Grid container direction="row" spacing={3}>
          <Grid item xs={12}>
            <Typography>
              Failed to retrieve Dependabot alerts from GitHub. Security
              Insights plugin may require administrator access to display data
              correctly
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>Error message: {error.message}</Typography>
          </Grid>
        </Grid>
      </Alert>
    );
  }

  return value && value.vulnerabilityAlerts ? (
    <DenseTable repository={value} detailsUrl={detailsUrl} />
  ) : null;
};
