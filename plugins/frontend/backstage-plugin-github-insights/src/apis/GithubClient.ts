/*
 * Copyright 2022 Larder Software Limited
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

import { GithubApi } from './GithubApi';
import { ConfigApi } from '@backstage/core-plugin-api';
import { Octokit } from '@octokit/rest';
import parseGitUrl from 'git-url-parse';
import { MarkdownContentProps } from '../components/Widgets/MarkdownContent/types';
import { readGithubIntegrationConfigs } from '@backstage/integration';
import { ScmAuthApi } from '@backstage/integration-react';

const mimeTypeMap: Record<string, string> = {
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
};

const mimeTypeLookup = (href: string): string | undefined => {
  const match = href.match(/\.([a-zA-Z]*)$/);
  const extension = match ? match[1] : undefined;
  return extension ? mimeTypeMap[extension.toLowerCase()] : undefined;
};

const getRepositoryDefaultBranch = (url: string) => {
  return new URL(url).searchParams.get('ref');
};

/**
 * Combines a given path to a README file with a relative path, resulting in a new path
 * that resolves the relative path against the directory of the README file.
 * This function is particularly useful for scenarios where navigation relative
 * to a known file location is needed, such as linking to another file in a Git repository.
 *
 * @param readmePath The absolute path to a README file. This path should be in the form of
 *                   an absolute path starting from the root directory (e.g., /path/to/repo/README.md).
 * @param relativePath The relative path to resolve against the directory containing the README file.
 *                     This path can include various combinations of ./ and ../ to navigate
 *                     up and down the directory tree (e.g., ../../../other/file.txt).
 * @return The resulting path after combining and resolving the relative path against the
 *         directory of the README file. The returned path is formatted as an absolute path
 *         starting from the root directory, without any protocol prefixes.
 *
 * Example:
 * const readmePath = '/path/to/repo/README.md';
 * const relativePath = '../../../other/file.txt';
 * const resultPath = combinePaths(readmePath, relativePath);
 * console.log(resultPath); // Outputs: '/path/other/file.txt'
 */
const combinePaths = (readmePath: string, relativePath: string): string => {
  // Ensure readmePath is a full path
  // Create a new URL object with the readmePath
  const readmeUrl = new URL(`file://${readmePath}`);

  // Get the directory path by navigating to the parent directory
  const dirUrl = new URL('.', readmeUrl);

  // Create a new URL object with the relative path and the directory path as base
  const combinedUrl = new URL(relativePath, dirUrl);

  return combinedUrl.pathname.startsWith('/')
    ? combinedUrl.pathname
    : `/${combinedUrl.pathname}`;
};

export class GithubClient implements GithubApi {
  private readonly configApi: ConfigApi;
  private readonly scmAuthApi: ScmAuthApi;

  constructor(options: { configApi: ConfigApi; scmAuthApi: ScmAuthApi }) {
    this.configApi = options.configApi;
    this.scmAuthApi = options.scmAuthApi;
  }

  private async getOctokit(hostname: string = 'github.com'): Promise<Octokit> {
    const { token } = await this.scmAuthApi.getCredentials({
      url: `https://${hostname}/`,
      additionalScope: {
        customScopes: {
          github: ['repo'],
        },
      },
    });
    const configs = readGithubIntegrationConfigs(
      this.configApi.getOptionalConfigArray('integrations.github') ?? [],
    );
    const githubIntegrationConfig = configs.find(v => v.host === hostname);
    const baseUrl = githubIntegrationConfig?.apiBaseUrl;
    return new Octokit({ auth: token, baseUrl });
  }

  async getContent(props: MarkdownContentProps): Promise<{
    content: string;
    media: Record<string, string>;
    links: Record<string, string>;
  }> {
    const { path: customReadmePath, repo, owner, branch, hostname } = props;

    const octokit = await this.getOctokit(hostname);

    let query = 'readme';
    if (customReadmePath) {
      query = `contents/${customReadmePath}`;
    }

    const readmePath = query;

    const response = await octokit.request(
      `GET /repos/{owner}/{repo}/${query}`,
      {
        owner,
        repo,
        ...(branch && { ref: branch }),
      },
    );
    const content = Buffer.from(response.data.content, 'base64').toString(
      'utf8',
    );

    const mediaLinks = [
      ...content.matchAll(
        /!\[([^\]]*)\]\(([^)]+\.(?:png|jpg|jpeg|gif|webp|svg))\)/gi,
      ),
    ].map(match => [match[2], match[3]].join(''));

    const media: Record<string, string> = {};

    const { ref, resource: domain, protocol } = parseGitUrl(response.data.url);
    const domainLowerCased = domain.toLocaleLowerCase('en-US');
    for (const mediaLink of mediaLinks) {
      const mimeType = mimeTypeLookup(mediaLink);
      if (!mimeType) {
        continue;
      }

      const getUrl = () => {
        const linkLowerCased = mediaLink.toLocaleLowerCase('en-US');
        if (!linkLowerCased.startsWith('http')) {
          return new URL(mediaLink, response.data.url);
        }

        if (linkLowerCased.includes(domainLowerCased)) {
          const {
            owner: ownerLink,
            name: repoLink,
            ref: refLink,
            filepath,
          } = parseGitUrl(mediaLink);
          if (filepath) {
            return `/repos/${ownerLink}/${repoLink}/contents/${filepath}${
              refLink && `?ref=${refLink}`
            }`;
          }
        }
        return undefined;
      };

      const url = getUrl();
      if (url) {
        try {
          const contentResponse = await octokit.request(`GET ${url}`);
          media[
            mediaLink
          ] = `data:${mimeType};base64,${contentResponse.data.content.replaceAll(
            '\n',
            '',
          )}`;
        } catch (e: any) {
          /* eslint no-console: ["error", { allow: ["warn"] }] */
          console.warn(
            `There was a problem loading the image content at ${url} via the GitHub API due to error: ${e.message}`,
          );
        }
      }
    }

    const markdownLinks = [
      ...content.matchAll(/\[([^\[\]]*)\]\((?!https?:\/\/)(.*?)(\.md)\)/gim),
    ].map(match => [match[2], match[3]].join(''));

    const links: Record<string, string> = {};

    const loadFromBranch =
      branch || ref || getRepositoryDefaultBranch(response.data.url);

    for (const markdownLink of markdownLinks) {
      const basicLink = `${protocol}://${domain}/${owner}/${repo}/blob/${loadFromBranch}`;

      const combinedPath = combinePaths(readmePath, markdownLink);
      links[markdownLink] = `${basicLink}${combinedPath}`;
    }
    return { content, media, links };
  }
}
