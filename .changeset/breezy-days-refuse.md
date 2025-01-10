---
'@roadiehq/backstage-plugin-github-pull-requests': major
'@roadiehq/backstage-plugin-github-insights': major
'@roadiehq/backstage-plugin-security-insights': major
---

BREAKING: Needs SCM auth API to be configured in the application.

Migrate to use SCM auth instead of direct GitHub to allow possibility to work with multiple GitHub integrations at once.

This will work automatically if `ScmAuth.createDefaultApiFactory()` is used when APIs registered. If not, you need to register an implementation of `scmAuthApiRef` as documented in: https://backstage.io/docs/auth/#custom-scmauthapi-implementation.
