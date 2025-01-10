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

import React, { FC, useCallback, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useApi } from '@backstage/core-plugin-api';
import Alert from '@material-ui/lab/Alert';
import { useAsyncFn } from 'react-use';
import { Octokit } from '@octokit/rest';
import { useUrl } from '../useUrl';
import {
  SecurityInsightFilterState,
  UpdateSeverityStatusProps,
} from '../../types';
import { scmAuthApiRef } from '@backstage/integration-react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    dialog: {
      minWidth: '300px',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    label: {
      color: 'inherit',
    },
  }),
);

export const UpdateSeverityStatusModal: FC<UpdateSeverityStatusProps> = ({
  owner,
  repo,
  severityData,
  id,
  tableData,
  setTableData,
  entity,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [dismissedReason, setDismissedReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const scmAuth = useApi(scmAuthApiRef);
  const { baseUrl, hostname } = useUrl(entity);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [state, dissmiss] = useAsyncFn(async reason => {
    if (reason.length === 0) return setErrorMsg('Field required');

    const credentials = await scmAuth.getCredentials({
      additionalScope: {
        customScopes: { github: ['repo'] },
      },
      url: `https://${hostname}`,
      optional: true,
    });
    const octokit = new Octokit({ auth: credentials.token });

    const response = await octokit.request(
      'PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}',
      {
        baseUrl,
        owner: 'RoadieHQ' || owner,
        repo: 'backstage' || repo,
        alert_number: id,
        state: 'dismissed',
        dismissed_reason: reason,
      },
    );
    const data = response.data;
    handleClose();
    setTableData(
      tableData.map(element =>
        element.number === id ? { ...element, state: 'dismissed' } : element,
      ),
    );
    return data;
  }, []);

  const getSeverityState = useCallback(
    (severityState: SecurityInsightFilterState) => {
      switch (severityState) {
        case 'open':
          return (
            <Chip
              label="Open"
              color="primary"
              variant="outlined"
              size="small"
              classes={{
                label: classes.label,
              }}
              onClick={handleClickOpen}
            />
          );
        case 'dismissed':
          return (
            <Chip
              label="Dismissed"
              color="secondary"
              variant="outlined"
              size="small"
              classes={{
                label: classes.label,
              }}
            />
          );
        case 'fixed':
          return (
            <Chip
              label="Fixed"
              color="primary"
              variant="outlined"
              size="small"
              classes={{
                label: classes.label,
              }}
            />
          );
        default:
          return 'Unknown';
      }
    },
    [],
  );

  return (
    <>
      {getSeverityState(severityData)}
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-slide-title">
          Dismiss severity #{id}
        </DialogTitle>
        <DialogContent>
          {state.error && (
            <Box mb={3}>
              <Alert severity="error">{state.error.message}</Alert>
            </Box>
          )}

          <FormControl
            error={Boolean(errorMsg)}
            className={classes.formControl}
          >
            <InputLabel id="dissmis-type-select-error-label">
              Dismiss type
            </InputLabel>
            <Select
              labelId="dissmis-type-select-error-label"
              id="dissmis-type"
              value={dismissedReason}
              onChange={e => {
                setErrorMsg('');
                setDismissedReason(e.target.value as string);
              }}
              autoWidth
            >
              <MenuItem value="false positive">False positive</MenuItem>
              <MenuItem value="won't fix">Won't fix</MenuItem>
              <MenuItem value="used in tests">Used in tests</MenuItem>
            </Select>
            <FormHelperText>{errorMsg}</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="secondary">
            Close
          </Button>
          <Button
            onClick={() => dissmiss(dismissedReason)}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
