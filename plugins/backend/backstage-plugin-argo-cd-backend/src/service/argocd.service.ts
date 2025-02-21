import { Config } from '@backstage/config';
import fetch from 'cross-fetch';
import { Logger } from 'winston';
import { LoggerService } from '@backstage/backend-plugin-api';
import { timer } from './timer.services';
import {
  ArgoServiceApi,
  CreateArgoApplicationProps,
  CreateArgoProjectProps,
  CreateArgoResourcesProps,
  DeleteApplicationProps,
  DeleteProjectProps,
  InstanceConfig,
  ResyncProps,
  SyncArgoApplicationProps,
  SyncResponse,
  findArgoAppResp,
  DeleteApplicationAndProjectProps,
  DeleteApplicationAndProjectResponse,
  getRevisionDataResp,
  BuildArgoProjectArgs,
  BuildArgoApplicationArgs,
  UpdateArgoProjectAndAppProps,
  UpdateArgoApplicationProps,
  UpdateArgoProjectProps,
  GetArgoProjectProps,
  GetArgoProjectResp,
  ArgoProject,
  ResourceItem,
  TerminateArgoAppOperationFetchResponse,
  DeleteArgoAppFetchResponse,
  DeleteArgoProjectFetchResponse,
  GetArgoApplicationFetchResponse,
  getArgoApplicationInfoProps,
  terminateArgoAppOperationProps,
} from './types';
import { getArgoConfigByInstanceName } from '../utils/getArgoConfig';

const APP_NAMESPACE_QUERY_PARAM = 'appNamespace';

export class ArgoService implements ArgoServiceApi {
  instanceConfigs: InstanceConfig[];

  constructor(
    private readonly username: string,
    private readonly password: string,
    private readonly config: Config,
    private readonly logger: Logger | LoggerService,
  ) {
    this.instanceConfigs = this.config
      .getConfigArray('argocd.appLocatorMethods')
      .filter(element => element.getString('type') === 'config')
      .reduce(
        (acc: Config[], argoApp: Config) =>
          acc.concat(argoApp.getConfigArray('instances')),
        [],
      )
      .map(instance => ({
        name: instance.getString('name'),
        url: instance.getString('url'),
        token: instance.getOptionalString('token'),
        username: instance.getOptionalString('username'),
        password: instance.getOptionalString('password'),
      }));
  }

  getArgoInstanceArray(): InstanceConfig[] {
    return this.getAppArray().map(instance => ({
      name: instance.getString('name'),
      url: instance.getString('url'),
      token: instance.getOptionalString('token'),
      username: instance.getOptionalString('username'),
      password: instance.getOptionalString('password'),
    }));
  }

  getAppArray(): Config[] {
    const argoApps = this.config
      .getConfigArray('argocd.appLocatorMethods')
      .filter(element => element.getString('type') === 'config');

    return argoApps.reduce(
      (acc: Config[], argoApp: Config) =>
        acc.concat(argoApp.getConfigArray('instances')),
      [],
    );
  }

  async getRevisionData(
    baseUrl: string,
    options: {
      name: string;
      namespace?: string;
    },
    argoToken: string,
    revisionID: string,
  ): Promise<getRevisionDataResp> {
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${argoToken}`,
      },
    };

    let url = `${baseUrl}/api/v1/applications/${options.name}/revisions/${revisionID}/metadata`;
    if (options.namespace) {
      url = `${url}?${APP_NAMESPACE_QUERY_PARAM}=${options.namespace}`;
    }

    const resp = await fetch(url, requestOptions);

    if (!resp.ok) {
      throw new Error(`Request failed with ${resp.status} Error`);
    }

    const data: getRevisionDataResp = await resp?.json();
    return data;
  }

  async findArgoApp(options: {
    name?: string;
    selector?: string;
    namespace?: string;
  }): Promise<findArgoAppResp[]> {
    if (!options.name && !options.selector) {
      throw new Error('name or selector is required');
    }
    const resp = await Promise.all(
      this.instanceConfigs.map(async (argoInstance: any) => {
        let getArgoAppDataResp: any;
        let token: string;
        try {
          token = argoInstance.token || (await this.getArgoToken(argoInstance));
        } catch (error: any) {
          this.logger.error(
            `Error getting token from Argo Instance ${argoInstance.name}: ${error.message}`,
          );
          return null;
        }

        try {
          getArgoAppDataResp = await this.getArgoAppData(
            argoInstance.url,
            argoInstance.name,
            token,
            options,
          );
        } catch (error: any) {
          this.logger.error(
            `Error getting Argo App Data from Argo Instance ${argoInstance.name}: ${error.message}`,
          );
          return null;
        }

        if (options.selector && !getArgoAppDataResp.items) {
          return null;
        }

        return {
          name: argoInstance.name as string,
          url: argoInstance.url as string,
          appName: options.selector
            ? getArgoAppDataResp.items.map((x: any) => x.metadata.name)
            : [options.name],
        };
      }),
    ).catch();
    return resp.flatMap(f => (f ? [f] : []));
  }

  async getArgoProject({
    baseUrl,
    argoToken,
    projectName,
  }: GetArgoProjectProps): Promise<GetArgoProjectResp> {
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${argoToken}`,
      },
    };

    const resp = await fetch(
      `${baseUrl}/api/v1/projects/${projectName}`,
      requestOptions,
    );
    const data = await resp.json();

    if (resp.status !== 200) {
      this.logger.error(
        `Failed to get argo project ${projectName}: ${data.message}`,
      );
      throw new Error(`Failed to get argo project: ${data.message}`);
    }

    return data;
  }

  async getArgoToken(appConfig: {
    url: string;
    username?: string;
    password?: string;
  }): Promise<string> {
    const { url, username, password } = appConfig;

    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username || this.username,
        password: password || this.password,
      }),
    };
    const resp = await fetch(`${url}/api/v1/session`, options);
    if (!resp.ok) {
      this.logger.error(`failed to get argo token: ${url}`);
    }
    if (resp.status === 401) {
      throw new Error(`Getting unauthorized for Argo CD instance ${url}`);
    }
    const data = await resp.json();
    return data.token;
  }

  async getArgoAppData(
    baseUrl: string,
    argoInstanceName: string,
    argoToken: string,
    options?: {
      name?: string;
      selector?: string;
      namespace?: string;
    },
  ): Promise<any> {
    let urlSuffix = '';

    if (options?.name) {
      urlSuffix = `/${options.name}`;
      if (options?.namespace) {
        urlSuffix = `${urlSuffix}?${APP_NAMESPACE_QUERY_PARAM}=${options.namespace}`;
      }
    }

    if (options?.selector) {
      urlSuffix = `?selector=${options.selector}`;
      // add query param for namespace if it exists
      if (options?.namespace) {
        urlSuffix = `${urlSuffix}&${APP_NAMESPACE_QUERY_PARAM}=${options.namespace}`;
      }
    }

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${argoToken}`,
      },
    };

    const resp = await fetch(
      `${baseUrl}/api/v1/applications${urlSuffix}`,
      requestOptions,
    );

    if (!resp.ok) {
      throw new Error(`Request failed with ${resp.status} Error`);
    }

    const data = await resp?.json();
    if (data.items) {
      (data.items as any[]).forEach(item => {
        item.metadata.instance = { name: argoInstanceName };
      });
    } else if (data && options?.name) {
      data.instance = argoInstanceName;
    }
    return data;
  }

  private buildArgoProjectPayload({
    projectName,
    namespace,
    destinationServer,
    resourceVersion,
    sourceRepo,
  }: BuildArgoProjectArgs): ArgoProject {
    const clusterResourceBlacklist = this.config.getOptional<ResourceItem[]>(
      `argocd.projectSettings.clusterResourceBlacklist`,
    );
    const clusterResourceWhitelist = this.config.getOptional<ResourceItem[]>(
      `argocd.projectSettings.clusterResourceWhitelist`,
    );
    const namespaceResourceBlacklist = this.config.getOptional<ResourceItem[]>(
      `argocd.projectSettings.namespaceResourceBlacklist`,
    );
    const namespaceResourceWhitelist = this.config.getOptional<ResourceItem[]>(
      `argocd.projectSettings.namespaceResourceWhitelist`,
    );

    const project: ArgoProject = {
      metadata: {
        name: projectName,
        resourceVersion,
        finalizers: ['resources-finalizer.argocd.argoproj.io'],
      },
      spec: {
        destinations: [
          {
            name: 'local',
            namespace: namespace,
            server: destinationServer ?? 'https://kubernetes.default.svc',
          },
        ],
        ...(clusterResourceBlacklist && { clusterResourceBlacklist }),
        ...(clusterResourceWhitelist && { clusterResourceWhitelist }),
        ...(namespaceResourceBlacklist && { namespaceResourceBlacklist }),
        ...(namespaceResourceWhitelist && { namespaceResourceWhitelist }),
        sourceRepos: Array.isArray(sourceRepo) ? sourceRepo : [sourceRepo],
      },
    };
    return project;
  }

  async createArgoProject({
    baseUrl,
    argoToken,
    projectName,
    namespace,
    sourceRepo,
    destinationServer,
  }: CreateArgoProjectProps): Promise<object> {
    const data = {
      project: this.buildArgoProjectPayload({
        projectName,
        namespace,
        sourceRepo,
        destinationServer,
      }),
    };

    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${argoToken}`,
      },
      body: JSON.stringify(data),
    };

    const resp = await fetch(`${baseUrl}/api/v1/projects`, options);
    const responseData = await resp.json();
    if (resp.status === 403) {
      throw new Error(responseData.message);
    } else if (resp.status === 404) {
      return resp.json();
    } else if (
      JSON.stringify(responseData).includes(
        'existing project spec is different',
      )
    ) {
      throw new Error('Duplicate project detected. Cannot overwrite existing.');
    }
    return responseData;
  }

  private async updateArgoProject({
    baseUrl,
    argoToken,
    projectName,
    namespace,
    sourceRepo,
    resourceVersion,
    destinationServer,
  }: UpdateArgoProjectProps): Promise<object> {
    const data = {
      project: this.buildArgoProjectPayload({
        projectName,
        namespace,
        sourceRepo,
        resourceVersion,
        destinationServer,
      }),
    };

    const options: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${argoToken}`,
      },
      body: JSON.stringify(data),
    };
    const resp = await fetch(
      `${baseUrl}/api/v1/projects/${projectName}`,
      options,
    );
    const responseData = await resp.json();
    if (resp.status !== 200) {
      this.logger.error(
        `Error updating argo project ${projectName}: ${responseData.message}`,
      );
      throw new Error(`Error updating argo project: ${responseData.message}`);
    }
    return responseData;
  }

  private buildArgoApplicationPayload({
    appName,
    projectName,
    namespace,
    sourceRepo,
    sourcePath,
    labelValue,
    resourceVersion,
    destinationServer,
  }: BuildArgoApplicationArgs) {
    return {
      metadata: {
        name: appName,
        labels: { 'backstage-name': labelValue },
        finalizers: ['resources-finalizer.argocd.argoproj.io'],
        resourceVersion,
      },
      spec: {
        destination: {
          namespace: namespace,
          server: destinationServer
            ? destinationServer
            : 'https://kubernetes.default.svc',
        },
        project: projectName,
        revisionHistoryLimit: 10,
        source: {
          path: sourcePath,
          repoURL: sourceRepo,
        },
        syncPolicy: {
          automated: {
            allowEmpty: true,
            prune: true,
            selfHeal: true,
          },
          retry: {
            backoff: {
              duration: '5s',
              factor: 2,
              maxDuration: '5m',
            },
            limit: 10,
          },
          syncOptions: ['CreateNamespace=false', 'FailOnSharedResource=true'],
        },
      },
    };
  }

  async createArgoApplication({
    baseUrl,
    argoToken,
    appName,
    projectName,
    namespace,
    sourceRepo,
    sourcePath,
    labelValue,
    destinationServer,
  }: CreateArgoApplicationProps): Promise<object> {
    const data = this.buildArgoApplicationPayload({
      appName,
      projectName,
      namespace,
      sourcePath,
      sourceRepo,
      labelValue,
      destinationServer,
    });

    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${argoToken}`,
      },
      body: JSON.stringify(data),
    };

    const resp = await fetch(`${baseUrl}/api/v1/applications`, options);
    const respData = await resp.json();
    if (!resp.ok) {
      throw new Error(`Error creating argo app: ${respData.message}`);
    }
    return respData;
  }

  async resyncAppOnAllArgos({
    appSelector,
    terminateOperation,
  }: ResyncProps): Promise<SyncResponse[][]> {
    const argoAppResp: findArgoAppResp[] = await this.findArgoApp({
      selector: appSelector,
    });
    if (argoAppResp) {
      const parallelSyncCalls = argoAppResp.map(
        async (argoInstance: any): Promise<SyncResponse[]> => {
          try {
            const token = await this.getArgoToken(argoInstance);
            try {
              if (terminateOperation) {
                const terminateResp = argoInstance.appName.map(
                  (argoApp: any): Promise<any> => {
                    return this.terminateArgoAppOperation({
                      baseUrl: argoInstance.url,
                      argoAppName: argoApp,
                      argoToken: token,
                    });
                  },
                );
                await Promise.all(terminateResp);
              }

              const resp = argoInstance.appName.map(
                (argoApp: any): Promise<SyncResponse> => {
                  return this.syncArgoApp({
                    argoInstance,
                    argoToken: token,
                    appName: argoApp,
                  });
                },
              );
              return await Promise.all(resp);
            } catch (e: any) {
              return [{ status: 'Failure', message: e.message }];
            }
          } catch (e: any) {
            return [{ status: 'Failure', message: e.message }];
          }
        },
      );
      return await Promise.all(parallelSyncCalls);
    }
    return [];
  }

  async syncArgoApp({
    argoInstance,
    argoToken,
    appName,
  }: SyncArgoApplicationProps): Promise<SyncResponse> {
    const data = {
      prune: false,
      dryRun: false,
      strategy: {
        hook: {
          force: true,
        },
      },
      resources: null,
    };

    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${argoToken}`,
      },
    };
    const resp = await fetch(
      `${argoInstance.url}/api/v1/applications/${appName}/sync`,
      options,
    );
    if (resp.ok) {
      return {
        status: 'Success',
        message: `Re-synced ${appName} on ${argoInstance.name}`,
      };
    }
    return {
      message: `Failed to resync ${appName} on ${argoInstance.name}`,
      status: 'Failure',
    };
  }

  private async updateArgoApp({
    baseUrl,
    argoToken,
    appName,
    projectName,
    namespace,
    sourceRepo,
    sourcePath,
    labelValue,
    resourceVersion,
    destinationServer,
  }: UpdateArgoApplicationProps): Promise<object> {
    const data = this.buildArgoApplicationPayload({
      appName,
      projectName,
      namespace,
      sourceRepo,
      sourcePath,
      labelValue,
      resourceVersion,
      destinationServer,
    });

    const options: RequestInit = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${argoToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    const resp = await fetch(
      `${baseUrl}/api/v1/applications/${appName}`,
      options,
    );
    const respData = await resp.json();
    if (resp.status !== 200) {
      this.logger.error(
        `Error updating argo app ${appName}: ${respData.message}`,
      );
      throw new Error(`Error updating argo app: ${respData.message}`);
    }

    return respData;
  }

  // @see https://cd.apps.argoproj.io/swagger-ui#operation/ApplicationService_Delete
  async deleteApp({
    baseUrl,
    argoApplicationName,
    argoToken,
  }: DeleteApplicationProps) {
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${argoToken}`,
        'Content-Type': 'application/json',
      },
    };
    let statusText: string = '';
    try {
      const response = (await fetch(
        `${baseUrl}/api/v1/applications/${argoApplicationName}?${new URLSearchParams(
          {
            cascade: 'true',
          },
        )}`,
        options,
      )) as DeleteArgoAppFetchResponse;
      statusText = response.statusText;
      if (response.status === 200) {
        return { ...(await response.json()), statusCode: response.status };
      }
      return { ...(await response.json()), statusCode: response.status };
    } catch (error) {
      this.logger.error(
        `Error Deleting Argo Application for application ${argoApplicationName} in ${baseUrl} - ${JSON.stringify(
          { statusText, error: (error as Error).message },
        )}`,
      );
      throw error;
    }
  }

  // @see https://cd.apps.argoproj.io/swagger-ui#operation/ProjectService_Delete
  async deleteProject({
    baseUrl,
    argoProjectName,
    argoToken,
  }: DeleteProjectProps) {
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${argoToken}`,
        'Content-Type': 'application/json',
      },
    };

    let statusText: string = '';
    try {
      const response = (await fetch(
        `${baseUrl}/api/v1/projects/${argoProjectName}`,
        options,
      )) as DeleteArgoProjectFetchResponse;

      statusText = response.statusText;
      if (response.status === 200) {
        return { ...(await response.json()), statusCode: response.status };
      }
      return { ...(await response.json()), statusCode: response.status };
    } catch (error) {
      this.logger.error(
        `Error Deleting Argo Project for project  ${argoProjectName} in ${baseUrl} - ${JSON.stringify(
          { statusText, error: (error as Error).message },
        )}`,
      );
      throw error;
    }
  }

  async deleteAppandProject({
    argoAppName,
    argoInstanceName,
    terminateOperation,
  }: DeleteApplicationAndProjectProps): Promise<DeleteApplicationAndProjectResponse> {
    let continueToDeleteProject: boolean = false;
    let deleteAppDetails: DeleteApplicationAndProjectResponse['deleteAppDetails'];
    let deleteProjectDetails: DeleteApplicationAndProjectResponse['deleteProjectDetails'];
    let terminateOperationDetails: DeleteApplicationAndProjectResponse['terminateOperationDetails'];

    const matchedArgoInstance = this.instanceConfigs.find(
      argoInstance => argoInstance.name === argoInstanceName,
    );
    if (matchedArgoInstance === undefined) {
      throw new Error('cannot find an argo instance to match this cluster');
    }

    let token: string;
    if (!matchedArgoInstance.token) {
      token = await this.getArgoToken(matchedArgoInstance);
    } else {
      token = matchedArgoInstance.token;
    }

    if (terminateOperation) {
      const terminateOperationResp = await this.terminateArgoAppOperation({
        baseUrl: matchedArgoInstance.url,
        argoAppName: argoAppName,
        argoToken: token,
      });
      if (
        terminateOperationResp.statusCode !== (404 || 200) &&
        'message' in terminateOperationResp
      ) {
        terminateOperationDetails = {
          status: 'failed',
          argoResponse: terminateOperationResp,
          message: `failed to terminate ${argoAppName}'s operation for application`,
        };
      } else if (terminateOperationResp.statusCode === 404) {
        terminateOperationDetails = {
          status: 'failed',
          argoResponse: terminateOperationResp,
          message: `application ${argoAppName} not found`,
        };
      } else if (terminateOperationResp.statusCode === 200) {
        terminateOperationDetails = {
          status: 'success',
          argoResponse: terminateOperationResp,
          message: `${argoAppName}'s current operation terminated`,
        };
      }
    }

    const deleteAppResp = await this.deleteApp({
      baseUrl: matchedArgoInstance.url,
      argoApplicationName: argoAppName,
      argoToken: token,
    });

    if (
      deleteAppResp.statusCode !== (404 || 200) &&
      'message' in deleteAppResp
    ) {
      deleteAppDetails = {
        status: 'failed',
        message: `failed to delete application ${argoAppName}`,
        argoResponse: deleteAppResp,
      };
    } else if (deleteAppResp.statusCode === 404) {
      continueToDeleteProject = true;
      deleteAppDetails = {
        status: 'success',
        message: `application ${argoAppName} does not exist and therefore does not need to be deleted`,
        argoResponse: deleteAppResp,
      };
    } else if (deleteAppResp.statusCode === 200) {
      deleteAppDetails = {
        status: 'pending',
        message: `application ${argoAppName} pending deletion`,
        argoResponse: deleteAppResp,
      };
      const configuredWaitCycles =
        this.config.getOptionalNumber('argocd.waitCycles') || 1;
      const configuredWaitInterval =
        this.config.getOptionalNumber('argocd.waitInterval') || 5000;
      for (let attempts = 0; attempts < configuredWaitCycles; attempts++) {
        const applicationInfo = await this.getArgoApplicationInfo({
          baseUrl: matchedArgoInstance.url,
          argoApplicationName: argoAppName,
          argoToken: token,
        });
        deleteAppDetails.argoResponse = applicationInfo;
        if (
          applicationInfo.statusCode !== (404 || 200) &&
          'message' in applicationInfo
        ) {
          deleteAppDetails.status = 'failed';
          deleteAppDetails.message = `a request was successfully sent to delete application ${argoAppName}, but when getting your application information we received an error`;
          break;
        } else if (applicationInfo.statusCode === 404) {
          continueToDeleteProject = true;
          deleteAppDetails.status = 'success';
          deleteAppDetails.message = `application ${argoAppName} deletion verified (application no longer exists)`;
          break;
        } else if (
          applicationInfo.statusCode === 200 &&
          'metadata' in applicationInfo
        ) {
          deleteAppDetails.status = 'pending';
          deleteAppDetails.message = `application ${argoAppName} still pending deletion with the deletion timestamp of ${applicationInfo.metadata.deletionTimestamp}`;
          if (attempts < configuredWaitCycles - 1)
            await timer(configuredWaitInterval);
        }
      }
    }

    if (continueToDeleteProject) {
      const deleteProjectResponse = await this.deleteProject({
        baseUrl: matchedArgoInstance.url,
        argoProjectName: argoAppName,
        argoToken: token,
      });
      if (
        deleteProjectResponse.statusCode !== (404 || 200) &&
        'message' in deleteProjectResponse
      ) {
        deleteProjectDetails = {
          status: 'failed',
          message: `failed to delete project ${argoAppName}.`,
          argoResponse: deleteProjectResponse,
        };
      } else if (deleteProjectResponse.statusCode === 404) {
        deleteProjectDetails = {
          status: 'success',
          message: `project ${argoAppName} does not exist and therefore does not need to be deleted.`,
          argoResponse: deleteProjectResponse,
        };
      } else if (deleteProjectResponse.statusCode === 200) {
        deleteProjectDetails = {
          status: 'pending',
          message: `project ${argoAppName} is pending deletion.`,
          argoResponse: deleteProjectResponse,
        };
      }
    } else {
      deleteProjectDetails = {
        status: 'failed',
        message: `project ${argoAppName} deletion skipped due to application still existing and pending deletion, or the application failed to delete.`,
        argoResponse: {},
      };
    }

    return {
      ...(terminateOperationDetails ? { terminateOperationDetails } : {}),
      deleteAppDetails,
      deleteProjectDetails,
    };
  }

  async createArgoResources({
    argoInstance,
    appName,
    projectName,
    namespace,
    sourceRepo,
    sourcePath,
    labelValue,
    logger,
  }: CreateArgoResourcesProps): Promise<boolean> {
    logger.info(`Getting app ${appName} on ${argoInstance}`);
    const matchedArgoInstance = this.instanceConfigs.find(
      argoHost => argoHost.name === argoInstance,
    );

    if (!matchedArgoInstance) {
      throw new Error(`Unable to find Argo instance named '${argoInstance}'`);
    }

    const token =
      matchedArgoInstance.token ||
      (await this.getArgoToken(matchedArgoInstance));

    await this.createArgoProject({
      baseUrl: matchedArgoInstance.url,
      argoToken: token,
      projectName: projectName ? projectName : appName,
      namespace,
      sourceRepo,
    });

    await this.createArgoApplication({
      baseUrl: matchedArgoInstance.url,
      argoToken: token,
      appName,
      projectName: projectName ? projectName : appName,
      namespace,
      sourceRepo,
      sourcePath,
      labelValue: labelValue ? labelValue : appName,
    });

    return true;
  }

  async updateArgoProjectAndApp({
    instanceConfig,
    argoToken,
    appName,
    projectName,
    namespace,
    sourceRepo,
    sourcePath,
    labelValue,
    destinationServer,
  }: UpdateArgoProjectAndAppProps): Promise<boolean> {
    const appData = await this.getArgoAppData(
      instanceConfig.url,
      instanceConfig.name,
      argoToken,
      { name: appName },
    );
    if (!appData.spec?.source?.repoURL) {
      this.logger.error(`No repo URL found for argo app ${projectName}`);
      throw new Error('No repo URL found for argo app');
    }
    if (!appData.metadata?.resourceVersion) {
      this.logger.error(`No resourceVersion found for argo app ${projectName}`);
      throw new Error('No resourceVersion found for argo app');
    }
    const projData = await this.getArgoProject({
      baseUrl: instanceConfig.url,
      argoToken,
      projectName,
    });
    if (!projData.metadata?.resourceVersion) {
      this.logger.error(
        `No resourceVersion found for argo project ${projectName}`,
      );
      throw new Error('No resourceVersion found for argo project');
    }
    if (appData.spec?.source?.repoURL === sourceRepo) {
      await this.updateArgoProject({
        argoToken,
        baseUrl: instanceConfig.url,
        namespace,
        projectName,
        sourceRepo,
        resourceVersion: projData.metadata.resourceVersion,
        destinationServer,
      });
      await this.updateArgoApp({
        appName,
        argoToken,
        baseUrl: instanceConfig.url,
        labelValue,
        namespace,
        projectName,
        sourcePath,
        sourceRepo,
        resourceVersion: appData.metadata.resourceVersion,
        destinationServer,
      });
      return true;
    }
    await this.updateArgoProject({
      argoToken,
      baseUrl: instanceConfig.url,
      namespace,
      projectName,
      sourceRepo: [sourceRepo, appData.spec.source.repoURL],
      resourceVersion: projData.metadata.resourceVersion,
      destinationServer,
    });
    await this.updateArgoApp({
      appName,
      argoToken,
      baseUrl: instanceConfig.url,
      labelValue,
      namespace,
      projectName,
      sourcePath,
      sourceRepo,
      resourceVersion: appData.metadata.resourceVersion,
      destinationServer,
    });
    const updatedProjData = await this.getArgoProject({
      baseUrl: instanceConfig.url,
      argoToken,
      projectName,
    });
    await this.updateArgoProject({
      argoToken,
      baseUrl: instanceConfig.url,
      namespace,
      projectName,
      sourceRepo,
      resourceVersion: updatedProjData.metadata.resourceVersion,
      destinationServer,
    });

    return true;
  }

  // @see https://cd.apps.argoproj.io/swagger-ui#operation/ApplicationService_List
  async getArgoApplicationInfo(props: getArgoApplicationInfoProps) {
    const argoApplicationName = props.argoApplicationName;
    let url = 'baseUrl' in props ? props.baseUrl : undefined;
    let token = 'argoToken' in props ? props.argoToken : undefined;
    const argoInstanceName =
      'argoInstanceName' in props ? props.argoInstanceName : undefined;
    if (!(url && token)) {
      if (!argoInstanceName)
        throw new Error(
          `argo instance must be defined when baseurl or token are not given.`,
        );
      const matchedArgoInstance = getArgoConfigByInstanceName({
        argoConfigs: this.instanceConfigs,
        argoInstanceName,
      });
      if (!matchedArgoInstance)
        throw new Error(
          `config does not have argo information for the cluster named '${argoInstanceName}'`,
        );
      token =
        matchedArgoInstance.token ??
        (await this.getArgoToken(matchedArgoInstance));
      url = matchedArgoInstance.url;
    }

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    };

    let statusText: string = '';
    try {
      const response: GetArgoApplicationFetchResponse = (await fetch(
        `${url}/api/v1/applications/${argoApplicationName}`,
        options,
      )) as GetArgoApplicationFetchResponse;

      statusText = response.statusText;

      if (response.status === 200) {
        return { ...(await response.json()), statusCode: response.status };
      }
      return { ...(await response.json()), statusCode: response.status };
    } catch (error) {
      this.logger.error(
        `Error Getting Argo Application Information For Argo Instance Name ${
          argoInstanceName ?? url
        } - searching for application ${argoApplicationName} - ${JSON.stringify(
          { statusText, error: (error as Error).message },
        )}`,
      );
      throw error;
    }
  }

  // @see https://cd.apps.argoproj.io/swagger-ui#operation/ApplicationService_TerminateOperation
  async terminateArgoAppOperation(props: terminateArgoAppOperationProps) {
    const argoApplicationName = props.argoAppName;
    let url = 'baseUrl' in props ? props.baseUrl : undefined;
    let token = 'argoToken' in props ? props.argoToken : undefined;
    const argoInstanceName =
      'argoInstanceName' in props ? props.argoInstanceName : undefined;
    if (!(url && token)) {
      if (!argoInstanceName)
        throw new Error(
          `argo instance must be defined when baseurl or token are not given.`,
        );
      const matchedArgoInstance = getArgoConfigByInstanceName({
        argoConfigs: this.instanceConfigs,
        argoInstanceName,
      });
      if (!matchedArgoInstance)
        throw new Error(
          `config does not have argo information for the cluster named '${argoInstanceName}'`,
        );
      token =
        matchedArgoInstance.token ??
        (await this.getArgoToken(matchedArgoInstance));
      url = matchedArgoInstance.url;
    }
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    };

    this.logger.info(
      `Terminating current operation for ${
        argoInstanceName ?? url
      } and ${argoApplicationName}`,
    );
    let statusText: string = '';

    try {
      const response = (await fetch(
        `${url}/api/v1/applications/${argoApplicationName}/operation`,
        options,
      )) as TerminateArgoAppOperationFetchResponse;
      statusText = response.statusText;

      if (response.status === 200) {
        return { ...(await response.json()), statusCode: response.status };
      }
      return { ...(await response.json()), statusCode: response.status };
    } catch (error) {
      this.logger.error(
        `Error Terminating Argo Application Operation for application ${argoApplicationName} in Argo Instance Name ${
          argoInstanceName ?? url
        } - ${JSON.stringify({ statusText, error: (error as Error).message })}`,
      );
      throw error;
    }
  }
}
