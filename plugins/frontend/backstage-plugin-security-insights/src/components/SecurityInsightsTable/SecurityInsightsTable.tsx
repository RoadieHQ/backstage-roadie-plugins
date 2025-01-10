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
import { Typography, Box, Grid } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import { useApi } from '@backstage/core-plugin-api';
import { Progress, Table, TableColumn } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import { Octokit } from '@octokit/rest';
import { useAsync } from 'react-use';
import { DateTime } from 'luxon';
import { useProjectName } from '../useProjectName';
import { useProjectEntity } from '../useProjectEntity';
import { UpdateSeverityStatusModal } from '../UpdateSeverityStatusModal';
import { StateFilterComponent } from './components/StateFilterComponent';
import { useUrl } from '../useUrl';
import { getSeverityBadge } from '../utils';
import { SecurityInsight, SecurityInsightFilterState } from '../../types';
import { useEntity } from '@backstage/plugin-catalog-react';
import { scmAuthApiRef } from '@backstage/integration-react';

const getElapsedTime = (start: string) => {
  return DateTime.fromISO(start).toRelative();
};

export const SecurityInsightsTable = () => {
  const [insightsStatusFilter, setInsightsStatusFilter] =
    useState<SecurityInsightFilterState>('open');
  const [filteredTableData, setFilteredTableData] = useState<SecurityInsight[]>(
    [],
  );
  const [tableData, setTableData] = useState<SecurityInsight[]>([]);
  const { entity } = useEntity();
  const { owner, repo } = useProjectEntity(entity);
  const projectName = useProjectName(entity);
  const scmAuth = useApi(scmAuthApiRef);
  const { baseUrl, hostname } = useUrl(entity);

  const { value, loading, error } = useAsync(async (): Promise<
    SecurityInsight[]
  > => {
    const credentials = await scmAuth.getCredentials({
      additionalScope: {
        customScopes: { github: ['repo'] },
      },
      url: `https://${hostname}`,
      optional: true,
    });
    const octokit = new Octokit({ auth: credentials.token });
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/code-scanning/alerts',
      {
        baseUrl,
        owner,
        repo,
        per_page: 100,
      },
    );
    const data = response.data as SecurityInsight[];
    setTableData(data);
    if (insightsStatusFilter) {
      setFilteredTableData(
        data.filter(entry => entry.state === insightsStatusFilter),
      );
    }
    return data;
  }, []);

  const generatedColumns: TableColumn[] = [
    {
      title: 'ID',
      field: 'number',
      width: '50px',
      highlight: true,
      render: (row: Partial<SecurityInsight>) => (
        <Box fontWeight="fontWeightBold">
          <a target="_blank" rel="noopener noreferrer" href={row.html_url}>
            #{row.number}
          </a>
        </Box>
      ),
    },
    {
      title: 'Description',
      field: 'rule.description',
      highlight: true,
      render: (row: Partial<SecurityInsight>) => (
        <Typography variant="body2" noWrap>
          {row?.rule?.description}
        </Typography>
      ),
    },
    {
      title: 'Severity',
      field: 'rule.severity',
      highlight: true,
      render: (row: Partial<SecurityInsight>) => {
        const severityLevel = row?.rule?.severity;
        return (
          <Box display="flex" alignItems="center" fontWeight="fontWeightLight">
            {severityLevel && getSeverityBadge(severityLevel)}
          </Box>
        );
      },
    },
    {
      title: 'State',
      field: 'state',
      highlight: true,
      render: (row: Partial<SecurityInsight>) =>
        row.state &&
        row.number && (
          <UpdateSeverityStatusModal
            owner={owner}
            repo={repo}
            severityData={row.state}
            id={row.number}
            tableData={tableData}
            setTableData={setTableData}
            entity={entity}
          />
        ),
    },
    {
      title: 'Tool',
      field: 'tool.name',
      highlight: true,
      render: (row: Partial<SecurityInsight>) => (
        <Typography variant="body2" noWrap>
          {row?.tool?.name}
        </Typography>
      ),
    },
    {
      title: 'Detected',
      field: 'created_at',
      highlight: true,
      render: (row: Partial<SecurityInsight>) => (
        <Typography variant="body2" noWrap>
          {getElapsedTime(row.created_at as string)}
        </Typography>
      ),
    },
  ];

  if (loading) {
    return <Progress />;
  } else if (error) {
    return (
      <Alert severity="error">
        <Grid container direction="row" spacing={3}>
          <Grid item xs={12}>
            <Typography>
              Failed to retrieve security insights information from GitHub.
              Security Insights plugin may require administrator access to
              display data correctly
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>Error message: {error.message}</Typography>
          </Grid>
        </Grid>
      </Alert>
    );
  }

  return value ? (
    <Table
      isLoading={loading}
      options={{
        paging: true,
        padding: 'dense',
      }}
      data={(insightsStatusFilter !== null && filteredTableData) || tableData}
      title={
        <>
          <Box display="flex" alignItems="center">
            <GitHubIcon />
            <Box mr={1} />
            <Typography variant="h6">{projectName}</Typography>
          </Box>
          <StateFilterComponent
            insightsStatusFilter={insightsStatusFilter}
            value={value}
            setInsightsStatusFilter={setInsightsStatusFilter}
            setFilteredTableData={setFilteredTableData}
          />
        </>
      }
      columns={generatedColumns}
    />
  ) : null;
};
