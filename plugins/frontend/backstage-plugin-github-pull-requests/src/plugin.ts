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

import {
  createPlugin,
  createApiFactory,
  createRouteRef,
  createRoutableExtension,
  createComponentExtension,
  configApiRef,
} from '@backstage/core-plugin-api';
import { createCardExtension } from '@backstage/plugin-home-react';

import { githubPullRequestsApiRef, GithubPullRequestsClient } from './api';
import { scmAuthApiRef } from '@backstage/integration-react';

export const entityContentRouteRef = createRouteRef({
  id: 'github-pull-requests',
});

export const githubPullRequestsPlugin = createPlugin({
  id: 'github-pull-requests',

  apis: [
    createApiFactory({
      api: githubPullRequestsApiRef,
      deps: { configApi: configApiRef, scmAuthApi: scmAuthApiRef },
      factory: ({ configApi, scmAuthApi }) =>
        new GithubPullRequestsClient({ configApi, scmAuthApi }),
    }),
  ],
  routes: {
    entityContent: entityContentRouteRef,
  },
});

export const EntityGithubPullRequestsContent = githubPullRequestsPlugin.provide(
  createRoutableExtension({
    name: 'EntityGithubPullRequestsContent',
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: entityContentRouteRef,
  }),
);

export const EntityGithubPullRequestsOverviewCard =
  githubPullRequestsPlugin.provide(
    createComponentExtension({
      name: 'EntityGithubPullRequestsOverviewCard',
      component: {
        lazy: () =>
          import('./components/PullRequestsStatsCard').then(
            m => m.PullRequestsStatsCard,
          ),
      },
    }),
  );

export const EntityGithubPullRequestsTable = githubPullRequestsPlugin.provide(
  createComponentExtension({
    name: 'EntityGithubPullRequestsTable',
    component: {
      lazy: () =>
        import('./components/PullRequestsTable').then(m => m.PullRequestsTable),
    },
  }),
);

export const HomePageRequestedReviewsCard = githubPullRequestsPlugin.provide(
  createCardExtension<{ query?: string }>({
    name: 'HomePageRequestedReviewsCard',
    title: 'Review requests',
    components: () => import('./components/Home/RequestedReviewsCard'),
  }),
);

export const HomePageYourOpenPullRequestsCard =
  githubPullRequestsPlugin.provide(
    createCardExtension<{ query?: string }>({
      name: 'YourOpenPullRequestsCard',
      title: 'Your open pull requests',
      components: () => import('./components/Home/YourOpenPullRequestsCard'),
    }),
  );

export const EntityGithubGroupPullRequestsCard =
  githubPullRequestsPlugin.provide(
    createCardExtension({
      name: 'EntityGithubGroupPullRequestsCard',
      title: 'Team Assigned Review requests',
      components: () => import('./components/GroupPullRequestsCard'),
    }),
  );
