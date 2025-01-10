import React, { useEffect, useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { scmAuthApiRef } from '@backstage/integration-react';
import { Button, Grid, Tooltip, Typography } from '@material-ui/core';

export const GithubNotAuthorized = ({
  hostname = 'github.com',
}: {
  hostname?: string;
}) => {
  const scmAuth = useApi(scmAuthApiRef);

  return (
    <Grid container>
      <Grid item xs={8}>
        <Typography>
          You are not logged into GitHub. You need to be signed in to see the
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

export const useGithubLoggedIn = (hostname: string = 'github.com') => {
  const scmAuth = useApi(scmAuthApiRef);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const doLogin = async () => {
      const credentials = await scmAuth.getCredentials({
        additionalScope: {
          customScopes: { github: ['repo'] },
        },
        url: `https://${hostname}`,
        optional: true,
      });

      if (credentials?.token) {
        setIsLoggedIn(true);
      }
    };

    doLogin();
  }, [hostname, scmAuth]);

  return isLoggedIn;
};
