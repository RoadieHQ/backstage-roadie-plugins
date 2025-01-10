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

import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from '@material-ui/lab';
import {
  MarkdownContent as RawMarkdownContent,
  Progress,
} from '@backstage/core-components';
import {
  ApiHolder,
  configApiRef,
  useApi,
  useApiHolder,
} from '@backstage/core-plugin-api';
import { MarkdownContentProps } from './types';
import { Button, Grid, Tooltip, Typography } from '@material-ui/core';
import useAsync from 'react-use/lib/useAsync';
import { GithubApi, githubApiRef, GithubClient } from '../../../apis';
import { scmAuthApiRef } from '@backstage/integration-react';

const getGithubClient = (apiHolder: ApiHolder) => {
  let githubClient: GithubApi | undefined = apiHolder.get(githubApiRef);
  if (!githubClient) {
    const configApi = apiHolder.get(configApiRef);
    const scmAuthApi = apiHolder.get(scmAuthApiRef);
    if (scmAuthApi && configApi) {
      githubClient = new GithubClient({ configApi, scmAuthApi });
    }
  }
  if (!githubClient) {
    throw new Error(
      'The MarkdownCard component Failed to get the SCM auth client or SCM configuration',
    );
  }
  return githubClient;
};

const GithubFileContent = (props: MarkdownContentProps) => {
  const { preserveHtmlComments } = props;
  const apiHolder = useApiHolder();

  const { value, loading, error } = useAsync(async () => {
    const githubClient = getGithubClient(apiHolder);
    return githubClient.getContent({ ...props });
  }, [apiHolder]);

  const transformImageUri = useCallback(
    (href: string) => {
      return value?.media[href] || href;
    },
    [value?.media],
  );

  const transformLinkUri = useCallback(
    (href: string) => {
      return value?.links[href] || href;
    },
    [value?.links],
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (!value) {
    return <Progress />;
  }

  let content = value.content;
  if (!preserveHtmlComments) {
    content = content.replace(/<!--(.|\n)*?-->/g, '');
  }

  return (
    <RawMarkdownContent
      transformImageUri={transformImageUri}
      transformLinkUri={transformLinkUri}
      content={content}
    />
  );
};

const GithubNotAuthorized = ({
  hostname = 'github.com',
}: {
  hostname?: string;
}) => {
  const scmAuth = useApi(scmAuthApiRef);
  return (
    <Grid container>
      <Grid item xs={8}>
        <Typography>
          You are not logged into github. You need to be signed in to see the
          content of this card.
        </Typography>
      </Grid>
      <Grid item xs={4} container justifyContent="flex-end">
        <Tooltip placement="top" arrow title="Sign in to Github">
          <Button
            variant="outlined"
            color="primary"
            onClick={() =>
              scmAuth.getCredentials({
                additionalScope: {
                  customScopes: { github: ['repo'] },
                },
                url: `https://${hostname}`,
                optional: true,
              })
            }
          >
            Sign in
          </Button>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

/**
 * A component to render a markdown file from github
 *
 * @public
 */
const MarkdownContent = (props: MarkdownContentProps) => {
  const { hostname } = props;
  const scmAuth = useApi(scmAuthApiRef);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const githubUrl = hostname ? `https://${hostname}` : 'https://github.com';

  useEffect(() => {
    const doLogin = async () => {
      const credentials = await scmAuth.getCredentials({
        additionalScope: {
          customScopes: { github: ['repo'] },
        },
        url: githubUrl,
        optional: true,
      });

      if (credentials?.token) {
        setIsLoggedIn(true);
      }
    };
    doLogin();
  }, [scmAuth, githubUrl]);

  return isLoggedIn ? (
    <GithubFileContent {...props} />
  ) : (
    <GithubNotAuthorized />
  );
};

export default MarkdownContent;
