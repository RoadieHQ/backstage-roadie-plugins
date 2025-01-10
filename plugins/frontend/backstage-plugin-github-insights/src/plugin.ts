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

import {
  configApiRef,
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';
import { githubApiRef, GithubClient } from './apis';
import { scmAuthApiRef } from '@backstage/integration-react';

export const githubInsightsPlugin = createPlugin({
  id: 'code-insights',
  apis: [
    createApiFactory({
      api: githubApiRef,
      deps: {
        configApi: configApiRef,
        scmAuthApi: scmAuthApiRef,
      },
      factory: deps => new GithubClient(deps),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const EntityGithubInsightsContent = githubInsightsPlugin.provide(
  createRoutableExtension({
    name: 'EntityGithubInsightsContent',
    component: () =>
      import('./components/InsightsPage').then(m => m.InsightsPage),
    mountPoint: rootRouteRef,
  }),
);

export const EntityGithubInsightsComplianceCard = githubInsightsPlugin.provide(
  createComponentExtension({
    name: 'EntityGithubInsightsComplianceCard',
    component: {
      lazy: () =>
        import('./components/Widgets/index').then(m => m.ComplianceCard),
    },
  }),
);

export const EntityGithubInsightsContributorsCard =
  githubInsightsPlugin.provide(
    createComponentExtension({
      name: 'EntityGithubInsightsContributorsCard',
      component: {
        lazy: () =>
          import('./components/Widgets/index').then(m => m.ContributorsCard),
      },
    }),
  );

export const EntityGithubInsightsLanguagesCard = githubInsightsPlugin.provide(
  createComponentExtension({
    name: 'EntityGithubInsightsLanguagesCard',
    component: {
      lazy: () =>
        import('./components/Widgets/index').then(m => m.LanguagesCard),
    },
  }),
);

export const EntityGithubInsightsReadmeCard = githubInsightsPlugin.provide(
  createComponentExtension({
    name: 'EntityGithubInsightsReadmeCard',
    component: {
      lazy: () => import('./components/Widgets/index').then(m => m.ReadMeCard),
    },
  }),
);

export const EntityGithubInsightsReleasesCard = githubInsightsPlugin.provide(
  createComponentExtension({
    name: 'EntityGithubInsightsReleasesCard',
    component: {
      lazy: () =>
        import('./components/Widgets/index').then(m => m.ReleasesCard),
    },
  }),
);

export const EntityGithubInsightsEnvironmentsCard =
  githubInsightsPlugin.provide(
    createComponentExtension({
      name: 'EntityGithubInsightsEnvironmentsCard',
      component: {
        lazy: () =>
          import('./components/Widgets/index').then(m => m.EnvironmentsCard),
      },
    }),
  );

export const GithubInsightsMarkdownContent = githubInsightsPlugin.provide(
  createComponentExtension({
    name: 'GithubInsightsMarkdownContent',
    component: {
      lazy: () =>
        import('./components/Widgets/index').then(m => m.MarkdownContent),
    },
  }),
);
