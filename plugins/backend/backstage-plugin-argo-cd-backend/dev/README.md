# Local Development

You can run `yarn start` in the root of this plugin and the standalone server will start on port 7007. To bypass authentication requirements you can disable the default auth policy in your local app config (`backend` -> `auth` -> `dangerouslyDisableDefaultAuthPolicy: true`), or you can temprorarily set the http router auth policy on the plugin to `unauthenticated` (`httpRouter.addAuthPolicy()`).

You can also change the port if needed by setting the `backend` -> `listen` -> `port` configuration in your local yaml.
