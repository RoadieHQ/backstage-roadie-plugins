This monorepo will contain all plugins we, at Roadie, have worked on up until now. Currently we are in the process of integration so for now you may not find all the plugins in this repository, so you can search for the ones we still haven't integrated [here](https://github.com/RoadieHQ?q=backstage-plugins&type=public&language=&sort=stargazers) or look them up on [npmjs](https://npmjs.com).


## Getting Started

To get up and running with this repository, you will need to clone it off of GitHub and run an initial build.

```bash
git clone https://github.com/RoadieHQ/roadie-backstage-plugins.git
cd roadie-backstage-plugins
```

# Fetch dependencies and run an initial build from root directory

```bash
yarn install
yarn tsc
yarn build
```

You will be able to see plugins which are already integrated and installed in package.json inside

```bash
cd packages/app
```

folder. For now, you will be able to see Github Pull Requests plugin and others will be added in the future.

Inside this repository you can add other plugins by running 

```bash
// packages/app
yarn add <<plugin>>
```

followed by 

```bash
// packages/app
yarn install
```
and running same command in root directory.


You should be able to run application from root directory, by running

```bash
yarn dev
```

 More informations about Github Pull Requests plugin, together with installation instructions, can be found on the link below

 [Github Pull Requests](https://www.npmjs.com/package/@roadiehq/backstage-plugin-github-pull-requests).
 
## Structure of the repository.

This repository, as mentioned above, will be a place where all of the plugins we have developed will be integrated under `/plugins` folder. This way it will be easy and straightforward to use and/or modify them by following steps below:
 
### Plugins container

Navigate to 

```bash
cd roadie-backstage-plugin/plugins
cd selected-plugin
```

Plugin folders will consist separate unit tests per every plugin, while general e2e tests are written under 

```bash
cd roadie-backstage-plugin/packages/app/cypress/integration
```
folder.

### Sample service

In order to make e2e testing isolated from real entities, we have created `test-entity.yaml` under `packages/entitites`, which will be shown as sample-service entity when you start the app. This is used only for testing purposes and can be modified accordingly.

```bash
cd roadie-backstage-plugin/plugins
cd selected-plugin
```

Plugin folders will consist separate unit tests per every plugin, while general e2e tests are written under 

```bash
cd roadie-backstage-plugin/packages/app/cypress/integration
```
folder.

## Community

- [Discord chatroom](https://discord.gg/3S4xrW7B) - Get support 
- [Contributing](https://github.com/RoadieHQ/roadie-backstage-plugins/blob/master/CONTRIBUTING.md) - Start here if you want to contribute
- Give us a star ⭐️ - If you are using Backstage or think it is an interesting project, we would love a star ❤️

## License

 Copyright 2021 Larder Software Limited. Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
