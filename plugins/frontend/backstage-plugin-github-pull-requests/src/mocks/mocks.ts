export const entityMock = {
  metadata: {
    namespace: 'default',
    annotations: {
      'backstage.io/managed-by-location':
        'url:https://github.com/mcalus3/sample-service/blob/master/backstage4.yaml',
      'github.com/project-slug': 'RoadieHQ/backstage-plugin-argo-cd',
    },
    name: 'sample-service',
    description:
      'A service for testing Backstage functionality. For example, we can trigger errors\non the sample-service, these are sent to Sentry, then we can view them in the \nBackstage plugin for Sentry.\n',
    uid: '33f123a4-e83e-4d3f-8baa-631266c5638b',
    etag: 'ZTVmZThhZDctN2VkYi00OTI5LTlkZDMtZTBkNDA4ODg3NDQ4',
    generation: 1,
  },
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  spec: {
    type: 'service',
    owner: 'david@roadie.io',
    lifecycle: 'experimental',
  },
};

export const groupEntityMock = {
  metadata: {
    namespace: 'default',
    annotations: {
      'backstage.io/managed-by-location':
        'url:https://github.com/org/repo/blob/master/catalog-info.yaml',
    },
    name: 'roadie-backstage-admin',
    description: 'The Backstage Admins',
    uid: '9a2bb4d3-db09-48c1-86fe-0b060e762484',
    etag: 'ZTVmZThhZDctN2VkYi00OTI5LTlkZDMtZEDFNDA4ODg3ABC4',
    generation: 1,
  },
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Group',
  spec: {
    type: 'team',
    profile: {
      displayName: 'roadie-backstage-admin',
      email: 'rroadie-backstage-admin@example.com',
      picture:
        'https://avatars.dicebear.com/api/identicon/backstage@example.com.svg?background=%23fff&margin=25',
    },
    children: [],
    members: ['default/brian'],
  },
};

export const groupEntityMockWithSlug = {
  metadata: {
    namespace: 'default',
    annotations: {
      'backstage.io/managed-by-location':
        'url:https://github.com/org/repo/blob/master/catalog-info.yaml',
      'github.com/team-slug': 'rroadie-backstage-admin',
    },
    name: 'roadie-backstage-admin',
    description: 'The Backstage Admins',
    uid: '9a2bb4d3-db09-48c1-86fe-0b060e762484',
    etag: 'ZTVmZThhZDctN2VkYi00OTI5LTlkZDMtZEDFNDA4ODg3ABC4',
    generation: 1,
  },
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Group',
  spec: {
    type: 'team',
    profile: {
      displayName: 'roadie-backstage-admin',
      email: 'rroadie-backstage-admin@example.com',
      picture:
        'https://avatars.dicebear.com/api/identicon/backstage@example.com.svg?background=%23fff&margin=25',
    },
    children: [],
    members: ['default/brian'],
  },
};

export const openPullsRequestMock = {
  total_count: 3,
  incomplete_results: false,
  items: [
    {
      url: 'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/88',
      repository_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd',
      labels_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/88/labels{/name}',
      comments_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/88/comments',
      events_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/88/events',
      html_url: 'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/88',
      id: 1061305226,
      node_id: 'PR_kwDOEtkFyM4u6IH7',
      number: 88,
      title: 'Remove old instructions',
      user: {
        login: 'martina-if',
        id: 736631,
        node_id: 'MDQ6VXNlcjczNjYzMQ==',
        avatar_url: 'https://avatars.githubusercontent.com/u/736631?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/martina-if',
        html_url: 'https://github.com/martina-if',
        followers_url: 'https://api.github.com/users/martina-if/followers',
        following_url:
          'https://api.github.com/users/martina-if/following{/other_user}',
        gists_url: 'https://api.github.com/users/martina-if/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/martina-if/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/martina-if/subscriptions',
        organizations_url: 'https://api.github.com/users/martina-if/orgs',
        repos_url: 'https://api.github.com/users/martina-if/repos',
        events_url: 'https://api.github.com/users/martina-if/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/martina-if/received_events',
        type: 'User',
        site_admin: false,
      },
      labels: [],
      state: 'open',
      locked: true,
      assignee: null,
      assignees: [],
      milestone: null,
      comments: 0,
      created_at: '2021-11-23T13:44:18Z',
      updated_at: '2021-11-23T13:49:27Z',
      closed_at: null,
      author_association: 'MEMBER',
      active_lock_reason: null,
      draft: false,
      pull_request: {
        url: 'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/pulls/88',
        html_url:
          'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/88',
        diff_url:
          'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/88.diff',
        patch_url:
          'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/88.patch',
        merged_at: null,
      },
      body: null,
      reactions: {
        url: 'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/88/reactions',
        total_count: 0,
        '+1': 0,
        '-1': 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      timeline_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/88/timeline',
      performed_via_github_app: null,
      score: 1,
    },
    {
      url: 'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/87',
      repository_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd',
      labels_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/87/labels{/name}',
      comments_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/87/comments',
      events_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/87/events',
      html_url: 'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/87',
      id: 969722103,
      node_id: 'MDExOlB1bGxSZXF1ZXN0NzExNzQ5Mzcy',
      number: 87,
      title: 'Bump path-parse from 1.0.6 to 1.0.7',
      user: {
        login: 'dependabot[bot]',
        id: 49699333,
        node_id: 'MDM6Qm90NDk2OTkzMzM=',
        avatar_url: 'https://avatars.githubusercontent.com/in/29110?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/dependabot%5Bbot%5D',
        html_url: 'https://github.com/apps/dependabot',
        followers_url:
          'https://api.github.com/users/dependabot%5Bbot%5D/followers',
        following_url:
          'https://api.github.com/users/dependabot%5Bbot%5D/following{/other_user}',
        gists_url:
          'https://api.github.com/users/dependabot%5Bbot%5D/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/dependabot%5Bbot%5D/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/dependabot%5Bbot%5D/subscriptions',
        organizations_url:
          'https://api.github.com/users/dependabot%5Bbot%5D/orgs',
        repos_url: 'https://api.github.com/users/dependabot%5Bbot%5D/repos',
        events_url:
          'https://api.github.com/users/dependabot%5Bbot%5D/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/dependabot%5Bbot%5D/received_events',
        type: 'Bot',
        site_admin: false,
      },
      labels: [
        {
          id: 2579513429,
          node_id: 'MDU6TGFiZWwyNTc5NTEzNDI5',
          url: 'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/labels/dependencies',
          name: 'dependencies',
          color: '0366d6',
          default: false,
          description: 'Pull requests that update a dependency file',
        },
      ],
      state: 'open',
      locked: true,
      assignee: null,
      assignees: [],
      milestone: null,
      comments: 2,
      created_at: '2021-08-12T23:03:51Z',
      updated_at: '2021-08-17T11:18:15Z',
      closed_at: null,
      author_association: 'CONTRIBUTOR',
      active_lock_reason: null,
      draft: false,
      pull_request: {
        url: 'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/pulls/87',
        html_url:
          'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/87',
        diff_url:
          'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/87.diff',
        patch_url:
          'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/87.patch',
        merged_at: null,
      },
      body: 'Bumps [path-parse](https://github.com/jbgutierrez/path-parse) from 1.0.6 to 1.0.7.\n<details>\n<summary>Commits</summary>\n<ul>\n<li>See full diff in <a href="https://github.com/jbgutierrez/path-parse/commits/v1.0.7">compare view</a></li>\n</ul>\n</details>\n<br />\n\n\n[![Dependabot compatibility score](https://dependabot-badges.githubapp.com/badges/compatibility_score?dependency-name=path-parse&package-manager=npm_and_yarn&previous-version=1.0.6&new-version=1.0.7)](https://docs.github.com/en/github/managing-security-vulnerabilities/about-dependabot-security-updates#about-compatibility-scores)\n\nDependabot will resolve any conflicts with this PR as long as you don\'t alter it yourself. You can also trigger a rebase manually by commenting `@dependabot rebase`.\n\n[//]: # (dependabot-automerge-start)\n[//]: # (dependabot-automerge-end)\n\n---\n\n<details>\n<summary>Dependabot commands and options</summary>\n<br />\n\nYou can trigger Dependabot actions by commenting on this PR:\n- `@dependabot rebase` will rebase this PR\n- `@dependabot recreate` will recreate this PR, overwriting any edits that have been made to it\n- `@dependabot merge` will merge this PR after your CI passes on it\n- `@dependabot squash and merge` will squash and merge this PR after your CI passes on it\n- `@dependabot cancel merge` will cancel a previously requested merge and block automerging\n- `@dependabot reopen` will reopen this PR if it is closed\n- `@dependabot close` will close this PR and stop Dependabot recreating it. You can achieve the same result by closing it manually\n- `@dependabot ignore this major version` will close this PR and stop Dependabot creating any more for this major version (unless you reopen the PR or upgrade to it yourself)\n- `@dependabot ignore this minor version` will close this PR and stop Dependabot creating any more for this minor version (unless you reopen the PR or upgrade to it yourself)\n- `@dependabot ignore this dependency` will close this PR and stop Dependabot creating any more for this dependency (unless you reopen the PR or upgrade to it yourself)\n- `@dependabot use these labels` will set the current labels as the default for future PRs for this repo and language\n- `@dependabot use these reviewers` will set the current reviewers as the default for future PRs for this repo and language\n- `@dependabot use these assignees` will set the current assignees as the default for future PRs for this repo and language\n- `@dependabot use this milestone` will set the current milestone as the default for future PRs for this repo and language\n\nYou can disable automated security fix PRs for this repo from the [Security Alerts page](https://github.com/RoadieHQ/backstage-plugin-argo-cd/network/alerts).\n\n</details>',
      reactions: {
        url: 'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/87/reactions',
        total_count: 0,
        '+1': 0,
        '-1': 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      timeline_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/87/timeline',
      performed_via_github_app: null,
      score: 1,
    },
    {
      url: 'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/86',
      repository_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd',
      labels_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/86/labels{/name}',
      comments_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/86/comments',
      events_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/86/events',
      html_url: 'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/86',
      id: 966860124,
      node_id: 'MDExOlB1bGxSZXF1ZXN0NzA5MDczMDg5',
      number: 86,
      title: 'Complete code migration to plugins repo',
      user: {
        login: 'iain-b',
        id: 1415599,
        node_id: 'MDQ6VXNlcjE0MTU1OTk=',
        avatar_url: 'https://avatars.githubusercontent.com/u/1415599?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/iain-b',
        html_url: 'https://github.com/iain-b',
        followers_url: 'https://api.github.com/users/iain-b/followers',
        following_url:
          'https://api.github.com/users/iain-b/following{/other_user}',
        gists_url: 'https://api.github.com/users/iain-b/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/iain-b/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/iain-b/subscriptions',
        organizations_url: 'https://api.github.com/users/iain-b/orgs',
        repos_url: 'https://api.github.com/users/iain-b/repos',
        events_url: 'https://api.github.com/users/iain-b/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/iain-b/received_events',
        type: 'User',
        site_admin: false,
      },
      labels: [],
      state: 'open',
      locked: true,
      assignee: null,
      assignees: [],
      milestone: null,
      comments: 1,
      created_at: '2021-08-11T14:46:40Z',
      updated_at: '2021-08-16T17:18:11Z',
      closed_at: null,
      author_association: 'CONTRIBUTOR',
      active_lock_reason: null,
      draft: false,
      pull_request: {
        url: 'ttps://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/pulls/86',
        html_url:
          'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/86',
        diff_url:
          'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/86.diff',
        patch_url:
          'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/86.patch',
        merged_at: null,
      },
      body: 'https://github.com/RoadieHQ/roadie-backstage-plugins',
      reactions: {
        url: 'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/86/reactions',
        total_count: 0,
        '+1': 0,
        '-1': 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      timeline_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/86/timeline',
      performed_via_github_app: null,
      score: 1,
    },
  ],
};

export const closedPullsRequestMock = {
  total_count: 78,
  incomplete_results: false,
  items: [
    {
      url: 'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/85',
      repository_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd',
      labels_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/85/labels{/name}',
      comments_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/85/comments',
      events_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/85/events',
      html_url: 'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/85',
      id: 963806855,
      node_id: 'MDExOlB1bGxSZXF1ZXN0NzA2MzU2ODgw',
      number: 85,
      title: 'Bump Backstage packages with minor version updates',
      user: {
        login: 'onematchfox',
        id: 878612,
        node_id: 'MDQ6VXNlcjg3ODYxMg==',
        avatar_url: 'https://avatars.githubusercontent.com/u/878612?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/onematchfox',
        html_url: 'https://github.com/onematchfox',
        followers_url: 'https://api.github.com/users/onematchfox/followers',
        following_url:
          'https://api.github.com/users/onematchfox/following{/other_user}',
        gists_url: 'https://api.github.com/users/onematchfox/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/onematchfox/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/onematchfox/subscriptions',
        organizations_url: 'https://api.github.com/users/onematchfox/orgs',
        repos_url: 'https://api.github.com/users/onematchfox/repos',
        events_url: 'https://api.github.com/users/onematchfox/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/onematchfox/received_events',
        type: 'User',
        site_admin: false,
      },
      labels: [],
      state: 'closed',
      locked: true,
      assignee: {
        login: 'Xantier',
        id: 2392775,
        node_id: 'MDQ6VXNlcjIzOTI3NzU=',
        avatar_url: 'https://avatars.githubusercontent.com/u/2392775?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/Xantier',
        html_url: 'https://github.com/Xantier',
        followers_url: 'https://api.github.com/users/Xantier/followers',
        following_url:
          'https://api.github.com/users/Xantier/following{/other_user}',
        gists_url: 'ttps://api.github.com/users/Xantier/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/Xantier/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/Xantier/subscriptions',
        organizations_url: 'https://api.github.com/users/Xantier/orgs',
        repos_url: 'https://api.github.com/users/Xantier/repos',
        events_url: 'https://api.github.com/users/Xantier/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/Xantier/received_events',
        type: 'User',
        site_admin: false,
      },
      assignees: [
        {
          login: 'Xantier',
          id: 2392775,
          node_id: 'MDQ6VXNlcjIzOTI3NzU=',
          avatar_url: 'https://avatars.githubusercontent.com/u/2392775?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/Xantier',
          html_url: 'https://github.com/Xantier',
          followers_url: 'https://api.github.com/users/Xantier/followers',
          following_url:
            'https://api.github.com/users/Xantier/following{/other_user}',
          gists_url: 'https://api.github.com/users/Xantier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/Xantier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/Xantier/subscriptions',
          organizations_url: 'https://api.github.com/users/Xantier/orgs',
          repos_url: 'https://api.github.com/users/Xantier/repos',
          events_url: 'https://api.github.com/users/Xantier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/Xantier/received_events',
          type: 'User',
          site_admin: false,
        },
      ],
      milestone: null,
      comments: 0,
      created_at: '2021-08-09T09:26:49Z',
      updated_at: '2021-08-10T07:41:49Z',
      closed_at: '2021-08-10T07:29:15Z',
      author_association: 'CONTRIBUTOR',
      active_lock_reason: null,
      draft: false,
      pull_request: {
        url: 'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/pulls/85',
        html_url:
          'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/85',
        diff_url:
          'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/85.diff',
        patch_url:
          'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/85.patch',
        merged_at: '2021-08-10T07:29:15Z',
      },
      body: "Notes:\r\n- Cherry picked change from #83 as part of upgrade of `@backstage/core-components`\r\n- Noticed that https://github.com/RoadieHQ/backstage-plugin-argo-cd/blob/main/docs/releasing.md seems to be a little out of date after the change in https://github.com/RoadieHQ/backstage-plugin-argo-cd/commit/3f765afc891d6158327565a93ffdb0564840040f. \r\n\r\nPlease do let me know if I've missed anything needed in the PR. ",
      reactions: {
        url: 'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/85/reactions',
        total_count: 0,
        '+1': 0,
        '-1': 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      timeline_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/85/timeline',
      performed_via_github_app: null,
      score: 1.0,
    },
    {
      url: 'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/84',
      repository_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd',
      labels_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/84/labels{/name}',
      comments_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/84/comments',
      events_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/84/events',
      html_url: 'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/84',
      id: 959739426,
      node_id: 'MDExOlB1bGxSZXF1ZXN0NzAyODMwNTMy',
      number: 84,
      title: 'Bump tar from 6.1.0 to 6.1.5',
      user: {
        login: 'dependabot[bot]',
        id: 49699333,
        node_id: 'MDM6Qm90NDk2OTkzMzM=',
        avatar_url: 'https://avatars.githubusercontent.com/in/29110?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/dependabot%5Bbot%5D',
        html_url: 'https://github.com/apps/dependabot',
        followers_url:
          'https://api.github.com/users/dependabot%5Bbot%5D/followers',
        following_url:
          'https://api.github.com/users/dependabot%5Bbot%5D/following{/other_user}',
        gists_url:
          'https://api.github.com/users/dependabot%5Bbot%5D/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/dependabot%5Bbot%5D/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/dependabot%5Bbot%5D/subscriptions',
        organizations_url:
          'https://api.github.com/users/dependabot%5Bbot%5D/orgs',
        repos_url: 'https://api.github.com/users/dependabot%5Bbot%5D/repos',
        events_url:
          'https://api.github.com/users/dependabot%5Bbot%5D/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/dependabot%5Bbot%5D/received_events',
        type: 'Bot',
        site_admin: false,
      },
      labels: [
        {
          id: 2579513429,
          node_id: 'MDU6TGFiZWwyNTc5NTEzNDI5',
          url: 'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/labels/dependencies',
          name: 'dependencies',
          color: '0366d6',
          default: false,
          description: 'Pull requests that update a dependency file',
        },
      ],
      state: 'closed',
      locked: true,
      assignee: null,
      assignees: [],
      milestone: null,
      comments: 1,
      created_at: '2021-08-04T01:14:03Z',
      updated_at: '2021-08-10T07:29:59Z',
      closed_at: '2021-08-10T07:29:58Z',
      author_association: 'CONTRIBUTOR',
      active_lock_reason: null,
      draft: false,
      pull_request: {
        url: 'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/pulls/84',
        html_url:
          'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/84',
        diff_url:
          'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/84.diff',
        patch_url:
          'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/84.patch',
        merged_at: null,
      },
      body: 'Bumps [tar](https://github.com/npm/node-tar) from 6.1.0 to 6.1.5.\n<details>\n<summary>Commits</summary>\n<ul>\n<li><a href="https://github.com/npm/node-tar/commit/bd4691c90478f41b2649a97048199e34927dc046"><code>bd4691c</code></a> 6.1.5</li>\n<li><a href="https://github.com/npm/node-tar/commit/d694c4f810d864badf223efa35d24a000d780179"><code>d694c4f</code></a> ci: test on node 16</li>\n<li><a href="https://github.com/npm/node-tar/commit/84acbd31288541100910a528e437f901f8012214"><code>84acbd3</code></a> fix(unpack): fix hang on large file on open() fail</li>\n<li><a href="https://github.com/npm/node-tar/commit/97c46fcee7e4e7849ea3432086c4537fb6197025"><code>97c46fc</code></a> fix(unpack): always resume parsing after an entry error</li>\n<li><a href="https://github.com/npm/node-tar/commit/488ab8c01de69379406d937419fa3e5550e651c0"><code>488ab8c</code></a> chore: WriteEntry cleaner write() handling</li>\n<li><a href="https://github.com/npm/node-tar/commit/be89aafd95296e9721e124b77eee7c745e1c1e97"><code>be89aaf</code></a> WriteEntry backpressure</li>\n<li><a href="https://github.com/npm/node-tar/commit/ba73f5eea55f9cf65048b4d9578462ec8f80bc5e"><code>ba73f5e</code></a> chore: track fs state on WriteEntry class, not in arguments</li>\n<li><a href="https://github.com/npm/node-tar/commit/bf693837b3dcfeb76878b212310302dc5dc3d3dc"><code>bf69383</code></a> 6.1.4</li>\n<li><a href="https://github.com/npm/node-tar/commit/06cbde5935aa7643f578f874de84a7da2a74fe3a"><code>06cbde5</code></a> Avoid an unlikely but theoretically possible redos</li>\n<li><a href="https://github.com/npm/node-tar/commit/0b78386c53b00dce422742e19de94f2a4d9389f3"><code>0b78386</code></a> 6.1.3</li>\n<li>Additional commits viewable in <a href="https://github.com/npm/node-tar/compare/v6.1.0...v6.1.5">compare view</a></li>\n</ul>\n</details>\n<br />\n\n\n[![Dependabot compatibility score](https://dependabot-badges.githubapp.com/badges/compatibility_score?dependency-name=tar&package-manager=npm_and_yarn&previous-version=6.1.0&new-version=6.1.5)](https://docs.github.com/en/github/managing-security-vulnerabilities/about-dependabot-security-updates#about-compatibility-scores)\n\nDependabot will resolve any conflicts with this PR as long as you don\'t alter it yourself. You can also trigger a rebase manually by commenting `@dependabot rebase`.\n\n[//]: # (dependabot-automerge-start)\n[//]: # (dependabot-automerge-end)\n\n---\n\n<details>\n<summary>Dependabot commands and options</summary>\n<br />\n\nYou can trigger Dependabot actions by commenting on this PR:\n- `@dependabot rebase` will rebase this PR\n- `@dependabot recreate` will recreate this PR, overwriting any edits that have been made to it\n- `@dependabot merge` will merge this PR after your CI passes on it\n- `@dependabot squash and merge` will squash and merge this PR after your CI passes on it\n- `@dependabot cancel merge` will cancel a previously requested merge and block automerging\n- `@dependabot reopen` will reopen this PR if it is closed\n- `@dependabot close` will close this PR and stop Dependabot recreating it. You can achieve the same result by closing it manually\n- `@dependabot ignore this major version` will close this PR and stop Dependabot creating any more for this major version (unless you reopen the PR or upgrade to it yourself)\n- `@dependabot ignore this minor version` will close this PR and stop Dependabot creating any more for this minor version (unless you reopen the PR or upgrade to it yourself)\n- `@dependabot ignore this dependency` will close this PR and stop Dependabot creating any more for this dependency (unless you reopen the PR or upgrade to it yourself)\n- `@dependabot use these labels` will set the current labels as the default for future PRs for this repo and language\n- `@dependabot use these reviewers` will set the current reviewers as the default for future PRs for this repo and language\n- `@dependabot use these assignees` will set the current assignees as the default for future PRs for this repo and language\n- `@dependabot use this milestone` will set the current milestone as the default for future PRs for this repo and language\n\nYou can disable automated security fix PRs for this repo from the [Security Alerts page](https://github.com/RoadieHQ/backstage-plugin-argo-cd/network/alerts).\n\n</details>',
      reactions: {
        url: 'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/84/reactions',
        total_count: 0,
        '+1': 0,
        '-1': 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      timeline_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/84/timeline',
      performed_via_github_app: null,
      score: 1.0,
    },
    {
      url: 'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/83',
      repository_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd',
      labels_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/83/labels{/name}',
      comments_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/83/comments',
      events_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/83/events',
      html_url: 'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/83',
      id: 958689758,
      node_id: 'MDExOlB1bGxSZXF1ZXN0NzAxOTI4NjIx',
      number: 83,
      title: '[Snyk] Upgrade @material-ui/core from 4.11.3 to 4.12.1',
      user: {
        login: 'snyk-bot',
        id: 19733683,
        node_id: 'MDQ6VXNlcjE5NzMzNjgz',
        avatar_url: 'https://avatars.githubusercontent.com/u/19733683?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/snyk-bot',
        html_url: 'https://github.com/snyk-bot',
        followers_url: 'https://api.github.com/users/snyk-bot/followers',
        following_url:
          'https://api.github.com/users/snyk-bot/following{/other_user}',
        gists_url: 'https://api.github.com/users/snyk-bot/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/snyk-bot/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/snyk-bot/subscriptions',
        organizations_url: 'https://api.github.com/users/snyk-bot/orgs',
        repos_url: 'https://api.github.com/users/snyk-bot/repos',
        events_url: 'https://api.github.com/users/snyk-bot/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/snyk-bot/received_events',
        type: 'User',
        site_admin: false,
      },
      labels: [],
      state: 'closed',
      locked: true,
      assignee: null,
      assignees: [],
      milestone: null,
      comments: 0,
      created_at: '2021-08-03T03:42:49Z',
      updated_at: '2021-11-23T13:43:50Z',
      closed_at: '2021-11-23T13:43:50Z',
      author_association: 'CONTRIBUTOR',
      active_lock_reason: null,
      draft: false,
      pull_request: {
        url: 'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/pulls/83',
        html_url:
          'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/83',
        diff_url:
          'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/83.diff',
        patch_url:
          'https://github.com/RoadieHQ/backstage-plugin-argo-cd/pull/83.patch',
        merged_at: '2021-11-23T13:43:50Z',
      },
      body: '<h3>Snyk has created this PR to upgrade @material-ui/core from 4.11.3 to 4.12.1.</h3>\n\n![merge advice](https://app.snyk.io/badges/merge-advice/?package_manager=yarn&package_name=@material-ui/core&from_version=4.11.3&to_version=4.12.1&pr_id=e03e6155-660a-454a-b976-e35a5162f1c2&visibility=true&has_feature_flag=false)\n:information_source: Keep your dependencies up-to-date. This makes it easier to fix existing vulnerabilities and to more quickly identify and fix newly disclosed vulnerabilities when they affect your project.\n<hr/>\n\n- The recommended version is **3 versions** ahead of your current version.\n- The recommended version was released **a month ago**, on 2021-07-07.\n\n\n<hr/>\n\n**Note:** *You are seeing this because you or someone else with access to this repository has authorized Snyk to open upgrade PRs.*\n\nFor more information:  <img src="https://api.segment.io/v1/pixel/track?data=eyJ3cml0ZUtleSI6InJyWmxZcEdHY2RyTHZsb0lYd0dUcVg4WkFRTnNCOUEwIiwiYW5vbnltb3VzSWQiOiJlMDNlNjE1NS02NjBhLTQ1NGEtYjk3Ni1lMzVhNTE2MmYxYzIiLCJldmVudCI6IlBSIHZpZXdlZCIsInByb3BlcnRpZXMiOnsicHJJZCI6ImUwM2U2MTU1LTY2MGEtNDU0YS1iOTc2LWUzNWE1MTYyZjFjMiJ9fQ==" width="0" height="0"/>\n\n🧐 [View latest project report](https://app.snyk.io/org/roadie/project/5e6d83e1-ad28-4599-802e-aeb1f30950bc?utm_source&#x3D;github&amp;utm_medium&#x3D;upgrade-pr)\n\n🛠 [Adjust upgrade PR settings](https://app.snyk.io/org/roadie/project/5e6d83e1-ad28-4599-802e-aeb1f30950bc/settings/integration?utm_source&#x3D;github&amp;utm_medium&#x3D;upgrade-pr)\n\n🔕 [Ignore this dependency or unsubscribe from future upgrade PRs](https://app.snyk.io/org/roadie/project/5e6d83e1-ad28-4599-802e-aeb1f30950bc/settings/integration?pkg&#x3D;@material-ui/core&amp;utm_source&#x3D;github&amp;utm_medium&#x3D;upgrade-pr#auto-dep-upgrades)\n\n<!--- (snyk:metadata:{"prId":"e03e6155-660a-454a-b976-e35a5162f1c2","prPublicId":"e03e6155-660a-454a-b976-e35a5162f1c2","dependencies":[{"name":"@material-ui/core","from":"4.11.3","to":"4.12.1"}],"packageManager":"yarn","type":"auto","projectUrl":"https://app.snyk.io/org/roadie/project/5e6d83e1-ad28-4599-802e-aeb1f30950bc?utm_source=github&utm_medium=upgrade-pr","projectPublicId":"5e6d83e1-ad28-4599-802e-aeb1f30950bc","env":"prod","prType":"upgrade","vulns":[],"issuesToFix":[],"upgrade":[],"upgradeInfo":{"versionsDiff":3,"publishedDate":"2021-07-07T13:06:32.449Z"},"templateVariants":["merge-advice-badge-shown"],"hasFixes":false,"isMajorUpgrade":false,"isBreakingChange":false,"priorityScoreList":[]}) --->\n',
      reactions: {
        url: 'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/83/reactions',
        total_count: 0,
        '+1': 0,
        '-1': 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      timeline_url:
        'https://api.github.com/repos/RoadieHQ/backstage-plugin-argo-cd/issues/83/timeline',
      performed_via_github_app: null,
      score: 1.0,
    },
  ],
};

export const requestedReviewsMock = {
  total_count: 2,
  incomplete_results: false,
  items: [
    {
      url: 'https://api.github.com/repos/RoadieHQ/marketing-site/issues/650',
      repository_url: 'https://api.github.com/repos/RoadieHQ/marketing-site',
      labels_url:
        'https://api.github.com/repos/RoadieHQ/marketing-site/issues/650/labels{/name}',
      comments_url:
        'https://api.github.com/repos/RoadieHQ/marketing-site/issues/650/comments',
      events_url:
        'https://api.github.com/repos/RoadieHQ/marketing-site/issues/650/events',
      html_url: 'https://github.com/RoadieHQ/marketing-site/pull/650',
      id: 1183476633,
      node_id: 'PR_kwDOEIx70M41KGvn',
      number: 650,
      title: 'Revert "Sc 7454 AWS S3 docs (#640)"',
      user: {
        login: 'iain-b',
        id: 1415599,
        node_id: 'MDQ6VXNlcjE0MTU1OTk=',
        avatar_url: 'https://avatars.githubusercontent.com/u/1415599?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/iain-b',
        html_url: 'https://github.com/iain-b',
        followers_url: 'https://api.github.com/users/iain-b/followers',
        following_url:
          'https://api.github.com/users/iain-b/following{/other_user}',
        gists_url: 'https://api.github.com/users/iain-b/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/iain-b/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/iain-b/subscriptions',
        organizations_url: 'https://api.github.com/users/iain-b/orgs',
        repos_url: 'https://api.github.com/users/iain-b/repos',
        events_url: 'https://api.github.com/users/iain-b/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/iain-b/received_events',
        type: 'User',
        site_admin: false,
      },
      labels: [],
      state: 'open',
      locked: false,
      assignee: null,
      assignees: [],
      milestone: null,
      comments: 2,
      created_at: '2022-03-28T13:51:40Z',
      updated_at: '2022-03-28T13:52:53Z',
      closed_at: null,
      author_association: 'CONTRIBUTOR',
      active_lock_reason: null,
      draft: false,
      pull_request: {
        url: 'https://api.github.com/repos/RoadieHQ/marketing-site/pulls/650',
        html_url: 'https://github.com/RoadieHQ/marketing-site/pull/650',
        diff_url: 'https://github.com/RoadieHQ/marketing-site/pull/650.diff',
        patch_url: 'https://github.com/RoadieHQ/marketing-site/pull/650.patch',
        merged_at: null,
      },
      body: 'This reverts commit d54d9a533d48b9024b892a188e1b7102962d4d34.',
      reactions: {
        url: 'https://api.github.com/repos/RoadieHQ/marketing-site/issues/650/reactions',
        total_count: 0,
        '+1': 0,
        '-1': 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      timeline_url:
        'https://api.github.com/repos/RoadieHQ/marketing-site/issues/650/timeline',
      performed_via_github_app: null,
      score: 1,
    },
    {
      url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/462',
      repository_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins',
      labels_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/462/labels{/name}',
      comments_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/462/comments',
      events_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/462/events',
      html_url: 'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/462',
      id: 1178106595,
      node_id: 'PR_kwDOFl4HeM404aPw',
      number: 462,
      title: "Test PR don't merge",
      user: {
        login: 'Xantier',
        id: 2392775,
        node_id: 'MDQ6VXNlcjIzOTI3NzU=',
        avatar_url: 'https://avatars.githubusercontent.com/u/2392775?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/Xantier',
        html_url: 'https://github.com/Xantier',
        followers_url: 'https://api.github.com/users/Xantier/followers',
        following_url:
          'https://api.github.com/users/Xantier/following{/other_user}',
        gists_url: 'https://api.github.com/users/Xantier/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/Xantier/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/Xantier/subscriptions',
        organizations_url: 'https://api.github.com/users/Xantier/orgs',
        repos_url: 'https://api.github.com/users/Xantier/repos',
        events_url: 'https://api.github.com/users/Xantier/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/Xantier/received_events',
        type: 'User',
        site_admin: false,
      },
      labels: [],
      state: 'open',
      locked: false,
      assignee: null,
      assignees: [],
      milestone: null,
      comments: 0,
      created_at: '2022-03-23T13:13:21Z',
      updated_at: '2022-03-23T13:13:31Z',
      closed_at: null,
      author_association: 'CONTRIBUTOR',
      active_lock_reason: null,
      draft: false,
      pull_request: {
        url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/pulls/462',
        html_url:
          'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/462',
        diff_url:
          'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/462.diff',
        patch_url:
          'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/462.patch',
        merged_at: null,
      },
      body: '<!-- Please describe what these changes achieve -->\r\n\r\n#### :heavy_check_mark: Checklist\r\n\r\n- [ ] Added tests for new functionality and regression tests for bug fixes\r\n- [ ] Screenshots of before and after attached (for UI changes)\r\n- [ ] Added or updated documentation (if applicable)\r\n',
      reactions: {
        url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/462/reactions',
        total_count: 0,
        '+1': 0,
        '-1': 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      timeline_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/462/timeline',
      performed_via_github_app: null,
      score: 1,
    },
  ],
};
export const requestedReviewsCustomQueryMock = {
  total_count: 1,
  incomplete_results: false,
  items: [
    {
      url: 'https://api.github.com/repos/RoadieHQ/marketing-site/issues/650',
      repository_url: 'https://api.github.com/repos/RoadieHQ/marketing-site',
      labels_url:
        'https://api.github.com/repos/RoadieHQ/marketing-site/issues/650/labels{/name}',
      comments_url:
        'https://api.github.com/repos/RoadieHQ/marketing-site/issues/650/comments',
      events_url:
        'https://api.github.com/repos/RoadieHQ/marketing-site/issues/650/events',
      html_url: 'https://github.com/RoadieHQ/marketing-site/pull/650',
      id: 1183476633,
      node_id: 'PR_kwDOEIx70M41KGvn',
      number: 650,
      title: 'Revert "Sc 7454 AWS S3 docs (#640)"',
      user: {
        login: 'iain-b',
        id: 1415599,
        node_id: 'MDQ6VXNlcjE0MTU1OTk=',
        avatar_url: 'https://avatars.githubusercontent.com/u/1415599?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/iain-b',
        html_url: 'https://github.com/iain-b',
        followers_url: 'https://api.github.com/users/iain-b/followers',
        following_url:
          'https://api.github.com/users/iain-b/following{/other_user}',
        gists_url: 'https://api.github.com/users/iain-b/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/iain-b/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/iain-b/subscriptions',
        organizations_url: 'https://api.github.com/users/iain-b/orgs',
        repos_url: 'https://api.github.com/users/iain-b/repos',
        events_url: 'https://api.github.com/users/iain-b/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/iain-b/received_events',
        type: 'User',
        site_admin: false,
      },
      labels: [],
      state: 'open',
      locked: false,
      assignee: null,
      assignees: [],
      milestone: null,
      comments: 2,
      created_at: '2022-03-28T13:51:40Z',
      updated_at: '2022-03-28T13:52:53Z',
      closed_at: null,
      author_association: 'CONTRIBUTOR',
      active_lock_reason: null,
      draft: true,
      pull_request: {
        url: 'https://api.github.com/repos/RoadieHQ/marketing-site/pulls/650',
        html_url: 'https://github.com/RoadieHQ/marketing-site/pull/650',
        diff_url: 'https://github.com/RoadieHQ/marketing-site/pull/650.diff',
        patch_url: 'https://github.com/RoadieHQ/marketing-site/pull/650.patch',
        merged_at: null,
      },
      body: 'This reverts commit d54d9a533d48b9024b892a188e1b7102962d4d34.',
      reactions: {
        url: 'https://api.github.com/repos/RoadieHQ/marketing-site/issues/650/reactions',
        total_count: 0,
        '+1': 0,
        '-1': 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      timeline_url:
        'https://api.github.com/repos/RoadieHQ/marketing-site/issues/650/timeline',
      performed_via_github_app: null,
      score: 1,
    },
  ],
};
export const repoMock = {
  id: 375261048,
  node_id: 'MDEwOlJlcG9zaXRvcnkzNzUyNjEwNDg=',
  name: 'roadie-backstage-plugins',
  full_name: 'RoadieHQ/roadie-backstage-plugins',
  private: false,
  owner: {
    login: 'RoadieHQ',
    id: 61759275,
    node_id: 'MDEyOk9yZ2FuaXphdGlvbjYxNzU5Mjc1',
    avatar_url: 'https://avatars.githubusercontent.com/u/61759275?v=4',
    gravatar_id: '',
    url: 'https://api.github.com/users/RoadieHQ',
    html_url: 'https://github.com/RoadieHQ',
    followers_url: 'https://api.github.com/users/RoadieHQ/followers',
    following_url:
      'https://api.github.com/users/RoadieHQ/following{/other_user}',
    gists_url: 'https://api.github.com/users/RoadieHQ/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/RoadieHQ/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/RoadieHQ/subscriptions',
    organizations_url: 'https://api.github.com/users/RoadieHQ/orgs',
    repos_url: 'https://api.github.com/users/RoadieHQ/repos',
    events_url: 'https://api.github.com/users/RoadieHQ/events{/privacy}',
    received_events_url:
      'https://api.github.com/users/RoadieHQ/received_events',
    type: 'Organization',
    site_admin: false,
  },
  html_url: 'https://github.com/RoadieHQ/roadie-backstage-plugins',
  description: 'All Backstage plugins created by Roadie.',
  fork: false,
  url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins',
  forks_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/forks',
  keys_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/keys{/key_id}',
  collaborators_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/collaborators{/collaborator}',
  teams_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/teams',
  hooks_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/hooks',
  issue_events_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/events{/number}',
  events_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/events',
  assignees_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/assignees{/user}',
  branches_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/branches{/branch}',
  tags_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/tags',
  blobs_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/git/blobs{/sha}',
  git_tags_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/git/tags{/sha}',
  git_refs_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/git/refs{/sha}',
  trees_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/git/trees{/sha}',
  statuses_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/statuses/{sha}',
  languages_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/languages',
  stargazers_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/stargazers',
  contributors_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/contributors',
  subscribers_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/subscribers',
  subscription_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/subscription',
  commits_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/commits{/sha}',
  git_commits_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/git/commits{/sha}',
  comments_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/comments{/number}',
  issue_comment_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/comments{/number}',
  contents_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/contents/{+path}',
  compare_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/compare/{base}...{head}',
  merges_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/merges',
  archive_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/{archive_format}{/ref}',
  downloads_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/downloads',
  issues_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues{/number}',
  pulls_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/pulls{/number}',
  milestones_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/milestones{/number}',
  notifications_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/notifications{?since,all,participating}',
  labels_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/labels{/name}',
  releases_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/releases{/id}',
  deployments_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/deployments',
  created_at: '2021-06-09T07:12:18Z',
  updated_at: '2022-03-28T10:58:52Z',
  pushed_at: '2022-03-28T08:46:06Z',
  git_url: 'git://github.com/RoadieHQ/roadie-backstage-plugins.git',
  ssh_url: 'git@github.com:RoadieHQ/roadie-backstage-plugins.git',
  clone_url: 'https://github.com/RoadieHQ/roadie-backstage-plugins.git',
  svn_url: 'https://github.com/RoadieHQ/roadie-backstage-plugins',
  homepage: 'https://roadie.io',
  size: 18236,
  stargazers_count: 53,
  watchers_count: 53,
  language: 'TypeScript',
  has_issues: true,
  has_projects: false,
  has_downloads: true,
  has_wiki: false,
  has_pages: false,
  forks_count: 41,
  mirror_url: null,
  archived: false,
  disabled: false,
  open_issues_count: 28,
  license: {
    key: 'apache-2.0',
    name: 'Apache License 2.0',
    spdx_id: 'Apache-2.0',
    url: 'https://api.github.com/licenses/apache-2.0',
    node_id: 'MDc6TGljZW5zZTI=',
  },
  allow_forking: true,
  is_template: false,
  topics: ['backstage', 'backstage-plugin'],
  visibility: 'public',
  forks: 41,
  open_issues: 28,
  watchers: 53,
  default_branch: 'main',
  permissions: {
    admin: true,
    maintain: true,
    push: true,
    triage: true,
    pull: true,
  },
  temp_clone_token: '',
  allow_squash_merge: true,
  allow_merge_commit: true,
  allow_rebase_merge: true,
  allow_auto_merge: false,
  delete_branch_on_merge: true,
  allow_update_branch: false,
  organization: {
    login: 'RoadieHQ',
    id: 61759275,
    node_id: 'MDEyOk9yZ2FuaXphdGlvbjYxNzU5Mjc1',
    avatar_url: 'https://avatars.githubusercontent.com/u/61759275?v=4',
    gravatar_id: '',
    url: 'https://api.github.com/users/RoadieHQ',
    html_url: 'https://github.com/RoadieHQ',
    followers_url: 'https://api.github.com/users/RoadieHQ/followers',
    following_url:
      'https://api.github.com/users/RoadieHQ/following{/other_user}',
    gists_url: 'https://api.github.com/users/RoadieHQ/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/RoadieHQ/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/RoadieHQ/subscriptions',
    organizations_url: 'https://api.github.com/users/RoadieHQ/orgs',
    repos_url: 'https://api.github.com/users/RoadieHQ/repos',
    events_url: 'https://api.github.com/users/RoadieHQ/events{/privacy}',
    received_events_url:
      'https://api.github.com/users/RoadieHQ/received_events',
    type: 'Organization',
    site_admin: false,
  },
  network_count: 41,
  subscribers_count: 11,
};

export const marketingSiteMock = {
  id: 375261048,
  node_id: 'MDEwOlJlcG9zaXRvcnkzNzUyNjEwNDg=',
  name: 'roadie-backstage-plugins',
  full_name: 'RoadieHQ/roadie-backstage-plugins',
  private: false,
  owner: {
    login: 'RoadieHQ',
    id: 61759275,
    node_id: 'MDEyOk9yZ2FuaXphdGlvbjYxNzU5Mjc1',
    avatar_url: 'https://avatars.githubusercontent.com/u/61759275?v=4',
    gravatar_id: '',
    url: 'https://api.github.com/users/RoadieHQ',
    html_url: 'https://github.com/RoadieHQ',
    followers_url: 'https://api.github.com/users/RoadieHQ/followers',
    following_url:
      'https://api.github.com/users/RoadieHQ/following{/other_user}',
    gists_url: 'https://api.github.com/users/RoadieHQ/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/RoadieHQ/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/RoadieHQ/subscriptions',
    organizations_url: 'https://api.github.com/users/RoadieHQ/orgs',
    repos_url: 'https://api.github.com/users/RoadieHQ/repos',
    events_url: 'https://api.github.com/users/RoadieHQ/events{/privacy}',
    received_events_url:
      'https://api.github.com/users/RoadieHQ/received_events',
    type: 'Organization',
    site_admin: false,
  },
  html_url: 'https://github.com/RoadieHQ/roadie-backstage-plugins',
  description: 'All Backstage plugins created by Roadie.',
  fork: false,
  url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins',
  forks_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/forks',
  keys_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/keys{/key_id}',
  collaborators_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/collaborators{/collaborator}',
  teams_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/teams',
  hooks_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/hooks',
  issue_events_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/events{/number}',
  events_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/events',
  assignees_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/assignees{/user}',
  branches_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/branches{/branch}',
  tags_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/tags',
  blobs_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/git/blobs{/sha}',
  git_tags_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/git/tags{/sha}',
  git_refs_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/git/refs{/sha}',
  trees_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/git/trees{/sha}',
  statuses_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/statuses/{sha}',
  languages_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/languages',
  stargazers_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/stargazers',
  contributors_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/contributors',
  subscribers_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/subscribers',
  subscription_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/subscription',
  commits_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/commits{/sha}',
  git_commits_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/git/commits{/sha}',
  comments_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/comments{/number}',
  issue_comment_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/comments{/number}',
  contents_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/contents/{+path}',
  compare_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/compare/{base}...{head}',
  merges_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/merges',
  archive_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/{archive_format}{/ref}',
  downloads_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/downloads',
  issues_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues{/number}',
  pulls_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/pulls{/number}',
  milestones_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/milestones{/number}',
  notifications_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/notifications{?since,all,participating}',
  labels_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/labels{/name}',
  releases_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/releases{/id}',
  deployments_url:
    'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/deployments',
  created_at: '2021-06-09T07:12:18Z',
  updated_at: '2022-03-28T10:58:52Z',
  pushed_at: '2022-03-28T08:46:06Z',
  git_url: 'git://github.com/RoadieHQ/roadie-backstage-plugins.git',
  ssh_url: 'git@github.com:RoadieHQ/roadie-backstage-plugins.git',
  clone_url: 'https://github.com/RoadieHQ/roadie-backstage-plugins.git',
  svn_url: 'https://github.com/RoadieHQ/roadie-backstage-plugins',
  homepage: 'https://roadie.io',
  size: 18236,
  stargazers_count: 53,
  watchers_count: 53,
  language: 'TypeScript',
  has_issues: true,
  has_projects: false,
  has_downloads: true,
  has_wiki: false,
  has_pages: false,
  forks_count: 41,
  mirror_url: null,
  archived: false,
  disabled: false,
  open_issues_count: 28,
  license: {
    key: 'apache-2.0',
    name: 'Apache License 2.0',
    spdx_id: 'Apache-2.0',
    url: 'https://api.github.com/licenses/apache-2.0',
    node_id: 'MDc6TGljZW5zZTI=',
  },
  allow_forking: true,
  is_template: false,
  topics: ['backstage', 'backstage-plugin'],
  visibility: 'public',
  forks: 41,
  open_issues: 28,
  watchers: 53,
  default_branch: 'main',
  permissions: {
    admin: true,
    maintain: true,
    push: true,
    triage: true,
    pull: true,
  },
  temp_clone_token: '',
  allow_squash_merge: true,
  allow_merge_commit: true,
  allow_rebase_merge: true,
  allow_auto_merge: false,
  delete_branch_on_merge: true,
  allow_update_branch: false,
  organization: {
    login: 'RoadieHQ',
    id: 61759275,
    node_id: 'MDEyOk9yZ2FuaXphdGlvbjYxNzU5Mjc1',
    avatar_url: 'https://avatars.githubusercontent.com/u/61759275?v=4',
    gravatar_id: '',
    url: 'https://api.github.com/users/RoadieHQ',
    html_url: 'https://github.com/RoadieHQ',
    followers_url: 'https://api.github.com/users/RoadieHQ/followers',
    following_url:
      'https://api.github.com/users/RoadieHQ/following{/other_user}',
    gists_url: 'https://api.github.com/users/RoadieHQ/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/RoadieHQ/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/RoadieHQ/subscriptions',
    organizations_url: 'https://api.github.com/users/RoadieHQ/orgs',
    repos_url: 'https://api.github.com/users/RoadieHQ/repos',
    events_url: 'https://api.github.com/users/RoadieHQ/events{/privacy}',
    received_events_url:
      'https://api.github.com/users/RoadieHQ/received_events',
    type: 'Organization',
    site_admin: false,
  },
  network_count: 41,
  subscribers_count: 11,
};

export const yourOpenPullRequests = {
  total_count: 2,
  incomplete_results: false,
  items: [
    {
      url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/457',
      repository_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins',
      labels_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/457/labels{/name}',
      comments_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/457/comments',
      events_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/457/events',
      html_url: 'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/457',
      id: 1175720871,
      node_id: 'PR_kwDOFl4HeM40wePA',
      number: 457,
      title: 'add github homepage PR components',
      user: {
        login: 'kissmikijr',
        id: 24729496,
        node_id: 'MDQ6VXNlcjI0NzI5NDk2',
        avatar_url: 'https://avatars.githubusercontent.com/u/24729496?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/kissmikijr',
        html_url: 'https://github.com/kissmikijr',
        followers_url: 'https://api.github.com/users/kissmikijr/followers',
        following_url:
          'https://api.github.com/users/kissmikijr/following{/other_user}',
        gists_url: 'https://api.github.com/users/kissmikijr/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/kissmikijr/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/kissmikijr/subscriptions',
        organizations_url: 'https://api.github.com/users/kissmikijr/orgs',
        repos_url: 'https://api.github.com/users/kissmikijr/repos',
        events_url: 'https://api.github.com/users/kissmikijr/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/kissmikijr/received_events',
        type: 'User',
        site_admin: false,
      },
      labels: [],
      state: 'open',
      locked: false,
      assignee: null,
      assignees: [],
      milestone: null,
      comments: 3,
      created_at: '2022-03-21T17:34:59Z',
      updated_at: '2022-03-25T09:20:53Z',
      closed_at: null,
      author_association: 'CONTRIBUTOR',
      active_lock_reason: null,
      draft: false,
      pull_request: {
        url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/pulls/457',
        html_url:
          'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/457',
        diff_url:
          'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/457.diff',
        patch_url:
          'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/457.patch',
        merged_at: null,
      },
      body: '<!-- Please describe what these changes achieve -->\r\n\r\n![image](https://user-images.githubusercontent.com/24729496/160092420-aa408dce-445c-4f7b-96e2-8d4bae0944a1.png)\r\n\r\n\r\n\r\n#### :heavy_check_mark: Checklist\r\n\r\n- [ ] Added tests for new functionality and regression tests for bug fixes\r\n- [ ] Screenshots of before and after attached (for UI changes)\r\n- [ ] Added or updated documentation (if applicable)\r\n',
      reactions: {
        url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/457/reactions',
        total_count: 0,
        '+1': 0,
        '-1': 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      timeline_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/457/timeline',
      performed_via_github_app: null,
      score: 1,
    },
    {
      url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/450',
      repository_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins',
      labels_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/450/labels{/name}',
      comments_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/450/comments',
      events_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/450/events',
      html_url: 'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/450',
      id: 1166632752,
      node_id: 'PR_kwDOFl4HeM40T37p',
      number: 450,
      title: 'add poc',
      user: {
        login: 'kissmikijr',
        id: 24729496,
        node_id: 'MDQ6VXNlcjI0NzI5NDk2',
        avatar_url: 'https://avatars.githubusercontent.com/u/24729496?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/kissmikijr',
        html_url: 'https://github.com/kissmikijr',
        followers_url: 'https://api.github.com/users/kissmikijr/followers',
        following_url:
          'https://api.github.com/users/kissmikijr/following{/other_user}',
        gists_url: 'https://api.github.com/users/kissmikijr/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/kissmikijr/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/kissmikijr/subscriptions',
        organizations_url: 'https://api.github.com/users/kissmikijr/orgs',
        repos_url: 'https://api.github.com/users/kissmikijr/repos',
        events_url: 'https://api.github.com/users/kissmikijr/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/kissmikijr/received_events',
        type: 'User',
        site_admin: false,
      },
      labels: [],
      state: 'open',
      locked: false,
      assignee: null,
      assignees: [],
      milestone: null,
      comments: 0,
      created_at: '2022-03-11T16:43:06Z',
      updated_at: '2022-03-11T16:43:06Z',
      closed_at: null,
      author_association: 'CONTRIBUTOR',
      active_lock_reason: null,
      draft: true,
      pull_request: {
        url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/pulls/450',
        html_url:
          'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/450',
        diff_url:
          'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/450.diff',
        patch_url:
          'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/450.patch',
        merged_at: null,
      },
      body: '<!-- Please describe what these changes achieve -->\r\nA POC to drive plugin behaviour based on UserEntity annotations.',
      reactions: {
        url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/450/reactions',
        total_count: 0,
        '+1': 0,
        '-1': 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      timeline_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/450/timeline',
      performed_via_github_app: null,
      score: 1,
    },
  ],
};
export const yourOpenDraftPullRequests = {
  total_count: 1,
  incomplete_results: false,
  items: [
    {
      url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/450',
      repository_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins',
      labels_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/450/labels{/name}',
      comments_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/450/comments',
      events_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/450/events',
      html_url: 'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/450',
      id: 1166632752,
      node_id: 'PR_kwDOFl4HeM40T37p',
      number: 450,
      title: 'add poc',
      user: {
        login: 'kissmikijr',
        id: 24729496,
        node_id: 'MDQ6VXNlcjI0NzI5NDk2',
        avatar_url: 'https://avatars.githubusercontent.com/u/24729496?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/kissmikijr',
        html_url: 'https://github.com/kissmikijr',
        followers_url: 'https://api.github.com/users/kissmikijr/followers',
        following_url:
          'https://api.github.com/users/kissmikijr/following{/other_user}',
        gists_url: 'https://api.github.com/users/kissmikijr/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/kissmikijr/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/kissmikijr/subscriptions',
        organizations_url: 'https://api.github.com/users/kissmikijr/orgs',
        repos_url: 'https://api.github.com/users/kissmikijr/repos',
        events_url: 'https://api.github.com/users/kissmikijr/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/kissmikijr/received_events',
        type: 'User',
        site_admin: false,
      },
      labels: [],
      state: 'open',
      locked: false,
      assignee: null,
      assignees: [],
      milestone: null,
      comments: 0,
      created_at: '2022-03-11T16:43:06Z',
      updated_at: '2022-03-11T16:43:06Z',
      closed_at: null,
      author_association: 'CONTRIBUTOR',
      active_lock_reason: null,
      draft: true,
      pull_request: {
        url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/pulls/450',
        html_url:
          'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/450',
        diff_url:
          'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/450.diff',
        patch_url:
          'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/450.patch',
        merged_at: null,
      },
      body: '<!-- Please describe what these changes achieve -->\r\nA POC to drive plugin behaviour based on UserEntity annotations.',
      reactions: {
        url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/450/reactions',
        total_count: 0,
        '+1': 0,
        '-1': 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      timeline_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/450/timeline',
      performed_via_github_app: null,
      score: 1,
    },
  ],
};
export const backstagePluginArgoCdMocks: Record<string, object> = {
  '85': {
    url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/pulls/467',
    id: 894318735,
    number: 467,
    state: 'closed',
    created_at: '2022-03-30T11:30:01Z',
    updated_at: '2022-03-30T15:35:39Z',
    closed_at: '2022-03-30T15:35:39Z',
    merged_at: '2022-03-30T15:35:39Z',
    draft: false,
    comments: 1,
    review_comments: 0,
    commits: 5,
    additions: 1691,
    deletions: 1618,
    changed_files: 19,
  },
  '84': {
    url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/pulls/467',
    id: 894318735,
    number: 467,
    state: 'closed',
    created_at: '2022-03-30T11:30:01Z',
    updated_at: '2022-03-30T15:35:39Z',
    closed_at: '2022-03-30T15:35:39Z',
    merged_at: '2022-03-30T15:35:39Z',
    draft: false,
    comments: 1,
    review_comments: 0,
    commits: 5,
    additions: 1691,
    deletions: 1618,
    changed_files: 19,
  },
  '83': {
    url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/pulls/467',
    id: 894318735,
    number: 467,
    state: 'closed',
    created_at: '2022-03-30T11:30:01Z',
    updated_at: '2022-03-30T15:35:39Z',
    closed_at: '2022-03-30T15:35:39Z',
    merged_at: '2022-03-30T15:35:39Z',
    draft: false,
    comments: 1,
    review_comments: 0,
    commits: 5,
    additions: 1691,
    deletions: 1618,
    changed_files: 19,
  },
};
export const groupAssignedReviewsMock = {
  total_count: 2,
  incomplete_results: false,
  items: [
    {
      url: 'https://api.github.com/repos/RoadieHQ/marketing-site/issues/650',
      repository_url: 'https://api.github.com/repos/RoadieHQ/marketing-site',
      labels_url:
        'https://api.github.com/repos/RoadieHQ/marketing-site/issues/650/labels{/name}',
      comments_url:
        'https://api.github.com/repos/RoadieHQ/marketing-site/issues/650/comments',
      events_url:
        'https://api.github.com/repos/RoadieHQ/marketing-site/issues/650/events',
      html_url: 'https://github.com/RoadieHQ/marketing-site/pull/650',
      id: 1183476633,
      node_id: 'PR_kwDOEIx70M41KGvn',
      number: 650,
      title: 'Revert "Sc 7454 AWS S3 docs (#640)"',
      user: {
        login: 'iain-b',
        id: 1415599,
        node_id: 'MDQ6VXNlcjE0MTU1OTk=',
        avatar_url: 'https://avatars.githubusercontent.com/u/1415599?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/iain-b',
        html_url: 'https://github.com/iain-b',
        followers_url: 'https://api.github.com/users/iain-b/followers',
        following_url:
          'https://api.github.com/users/iain-b/following{/other_user}',
        gists_url: 'https://api.github.com/users/iain-b/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/iain-b/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/iain-b/subscriptions',
        organizations_url: 'https://api.github.com/users/iain-b/orgs',
        repos_url: 'https://api.github.com/users/iain-b/repos',
        events_url: 'https://api.github.com/users/iain-b/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/iain-b/received_events',
        type: 'User',
        site_admin: false,
      },
      labels: [],
      state: 'open',
      locked: false,
      assignee: null,
      assignees: [],
      requested_teams: [
        {
          id: 2,
          node_id: 'MDQ6VGVhbTE=',
          url: 'https://api.github.com/teams/2',
          html_url:
            'https://github.com/orgs/github/teams/rroadie-backstage-admin',
          name: 'Roadie Backstage Admins',
          slug: 'rroadie-backstage-admin',
          description: 'A great team of Admins.',
          privacy: 'closed',
          permission: 'admin',
          members_url: 'https://api.github.com/teams/2/members{/member}',
          repositories_url: 'https://api.github.com/teams/2/repos',
          parent: null,
        },
      ],
      milestone: null,
      comments: 2,
      created_at: '2022-03-28T13:51:40Z',
      updated_at: '2022-03-28T13:52:53Z',
      closed_at: null,
      author_association: 'CONTRIBUTOR',
      active_lock_reason: null,
      draft: false,
      pull_request: {
        url: 'https://api.github.com/repos/RoadieHQ/marketing-site/pulls/650',
        html_url: 'https://github.com/RoadieHQ/marketing-site/pull/650',
        diff_url: 'https://github.com/RoadieHQ/marketing-site/pull/650.diff',
        patch_url: 'https://github.com/RoadieHQ/marketing-site/pull/650.patch',
        merged_at: null,
      },
      body: 'This reverts commit d54d9a533d48b9024b892a188e1b7102962d4d34.',
      reactions: {
        url: 'https://api.github.com/repos/RoadieHQ/marketing-site/issues/650/reactions',
        total_count: 0,
        '+1': 0,
        '-1': 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      timeline_url:
        'https://api.github.com/repos/RoadieHQ/marketing-site/issues/650/timeline',
      performed_via_github_app: null,
      score: 1,
    },
    {
      url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/462',
      repository_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins',
      labels_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/462/labels{/name}',
      comments_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/462/comments',
      events_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/462/events',
      html_url: 'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/462',
      id: 1178106595,
      node_id: 'PR_kwDOFl4HeM404aPw',
      number: 462,
      title: "Test PR don't merge",
      user: {
        login: 'Xantier',
        id: 2392775,
        node_id: 'MDQ6VXNlcjIzOTI3NzU=',
        avatar_url: 'https://avatars.githubusercontent.com/u/2392775?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/Xantier',
        html_url: 'https://github.com/Xantier',
        followers_url: 'https://api.github.com/users/Xantier/followers',
        following_url:
          'https://api.github.com/users/Xantier/following{/other_user}',
        gists_url: 'https://api.github.com/users/Xantier/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/Xantier/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/Xantier/subscriptions',
        organizations_url: 'https://api.github.com/users/Xantier/orgs',
        repos_url: 'https://api.github.com/users/Xantier/repos',
        events_url: 'https://api.github.com/users/Xantier/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/Xantier/received_events',
        type: 'User',
        site_admin: false,
      },
      labels: [],
      state: 'open',
      locked: false,
      assignee: null,
      assignees: [],
      requested_teams: [
        {
          id: 2,
          node_id: 'MDQ6VGVhbTE=',
          url: 'https://api.github.com/teams/2',
          html_url:
            'https://github.com/orgs/github/teams/rroadie-backstage-admin',
          name: 'Roadie Backstage Admins',
          slug: 'rroadie-backstage-admin',
          description: 'A great team of Admins.',
          privacy: 'closed',
          permission: 'admin',
          members_url: 'https://api.github.com/teams/2/members{/member}',
          repositories_url: 'https://api.github.com/teams/2/repos',
          parent: null,
        },
      ],
      milestone: null,
      comments: 0,
      created_at: '2022-03-23T13:13:21Z',
      updated_at: '2022-03-23T13:13:31Z',
      closed_at: null,
      author_association: 'CONTRIBUTOR',
      active_lock_reason: null,
      draft: false,
      pull_request: {
        url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/pulls/462',
        html_url:
          'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/462',
        diff_url:
          'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/462.diff',
        patch_url:
          'https://github.com/RoadieHQ/roadie-backstage-plugins/pull/462.patch',
        merged_at: null,
      },
      body: '<!-- Please describe what these changes achieve -->\r\n\r\n#### :heavy_check_mark: Checklist\r\n\r\n- [ ] Added tests for new functionality and regression tests for bug fixes\r\n- [ ] Screenshots of before and after attached (for UI changes)\r\n- [ ] Added or updated documentation (if applicable)\r\n',
      reactions: {
        url: 'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/462/reactions',
        total_count: 0,
        '+1': 0,
        '-1': 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      timeline_url:
        'https://api.github.com/repos/RoadieHQ/roadie-backstage-plugins/issues/462/timeline',
      performed_via_github_app: null,
      score: 1,
    },
  ],
};
