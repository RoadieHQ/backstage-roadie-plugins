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
import { createHttpBackstageAction } from './backstageRequest';
import { Config, ConfigReader } from '@backstage/config';
import os from 'os'; // eslint-disable-line
import { getVoidLogger } from '@backstage/backend-common';
import { PassThrough } from 'stream'; // eslint-disable-line
import { http } from './helpers';

jest.mock('./helpers', () => ({
  ...jest.requireActual('./helpers.ts'),
  http: jest.fn(),
}));

describe('http:backstage:request', () => {
  let config: Config;
  let action: any;
  const mockConfigBaseUrl = 'http://backstage.tests.config.baseurl';
  const mockUserBaseUrl = 'http://backstage.tests.user.baseurl';
  const logger = getVoidLogger();

  beforeEach(() => {
    jest.resetAllMocks();
    config = new ConfigReader({
      app: {
        baseUrl: mockConfigBaseUrl,
      },
      backend: {
        baseUrl: mockConfigBaseUrl,
        listen: {
          port: 7007,
        },
      },
    });
    action = createHttpBackstageAction({ config });
  });

  const mockContext = {
    workspacePath: os.tmpdir(),
    logger: logger,
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  describe('when the action runs correctly', () => {
    describe('with path simple request', () => {
      it('should create a request and add baseurl of app', async () => {
        (http as jest.Mock).mockReturnValue({
          code: 200,
          headers: {},
          body: {},
        });
        await action.handler({
          ...mockContext,
          input: {
            path: '/api/proxy/foo',
            method: 'GET',
          },
        });
        expect(http).toBeCalledWith(
          {
            url: `${mockConfigBaseUrl}/api/proxy/foo`,
            method: 'GET',
            headers: {},
          },
          logger,
        );
      });
    });

    describe('with a user provided baseUrl', () => {
      it('should create a request', async () => {
        (http as jest.Mock).mockReturnValue({
          code: 200,
          headers: {},
          body: {},
        });
        await action.handler({
          ...mockContext,
          input: {
            path: '/api/proxy/foo',
            method: 'GET',
            baseUrl: mockUserBaseUrl,
          },
        });
        expect(http).toBeCalledWith(
          {
            url: `${mockUserBaseUrl}/api/proxy/foo`,
            method: 'GET',
            headers: {},
          },
          logger,
        );
      });
    });

    describe('with body defined as application/json', () => {
      it('should create a request and pass body parameter', async () => {
        (http as jest.Mock).mockReturnValue({
          code: 200,
          headers: {},
          body: {},
        });
        await action.handler({
          ...mockContext,
          input: {
            path: '/api/proxy/foo',
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: {
              name: 'test',
            },
          },
        });
        expect(http).toBeCalledWith(
          {
            url: `${mockConfigBaseUrl}/api/proxy/foo`,
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: '{"name":"test"}',
          },
          logger,
        );
      });
    });

    describe('with body defined as a string', () => {
      it('should create a request and pass body parameter', async () => {
        (http as jest.Mock).mockReturnValue({
          code: 200,
          headers: {},
          body: {},
        });
        await action.handler({
          ...mockContext,
          input: {
            path: '/api/proxy/foo',
            method: 'POST',
            body: 'test',
          },
        });
        expect(http).toBeCalledWith(
          {
            url: `${mockConfigBaseUrl}/api/proxy/foo`,
            method: 'POST',
            headers: {},
            body: 'test',
          },
          logger,
        );
      });
    });

    describe('with authorization header', () => {
      const BACKSTAGE_TOKEN = 'BACKSTAGE_TOKEN';
      it('should create a request and pass backstage token as authorization header', async () => {
        (http as jest.Mock).mockReturnValue({
          code: 200,
          headers: {},
          body: {},
        });
        await action.handler({
          ...mockContext,
          secrets: {
            backstageToken: BACKSTAGE_TOKEN,
          },
          input: {
            path: '/api/proxy/foo',
            method: 'POST',
            body: 'test',
            headers: {},
          },
        });
        expect(http).toBeCalledWith(
          {
            url: `${mockConfigBaseUrl}/api/proxy/foo`,
            method: 'POST',
            headers: {
              authorization: `Bearer ${BACKSTAGE_TOKEN}`,
            },
            body: 'test',
          },
          logger,
        );
      });

      it('should create a request and pass custom authorization header from input', async () => {
        const HEADERS = {
          Authorization: '123',
          Test: 'some-test',
        };

        (http as jest.Mock).mockReturnValue({
          code: 200,
          headers: {},
          body: {},
        });
        await action.handler({
          ...mockContext,
          secrets: {
            backstageToken: BACKSTAGE_TOKEN,
          },
          input: {
            path: '/api/proxy/foo',
            method: 'POST',
            body: 'test',
            headers: HEADERS,
          },
        });
        expect(http).toBeCalledWith(
          {
            url: `${mockConfigBaseUrl}/api/proxy/foo`,
            method: 'POST',
            headers: HEADERS,
            body: 'test',
          },
          logger,
        );
      });
    });

    describe('with body undefined', () => {
      it('should create a request and body should be undefined', async () => {
        (http as jest.Mock).mockReturnValue({
          code: 200,
          headers: {},
          body: {},
        });
        await action.handler({
          ...mockContext,
          input: {
            path: '/api/proxy/foo',
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
          },
        });
        expect(http).toBeCalledWith(
          {
            url: `${mockConfigBaseUrl}/api/proxy/foo`,
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: undefined,
          },
          logger,
        );
      });
    });

    describe('with a token request', () => {
      it('should create a request', async () => {
        (http as jest.Mock).mockReturnValue({
          code: 200,
          headers: {},
          body: {},
        });
        await action.handler({
          ...mockContext,
          secrets: { backstageToken: 'some-token' },
          input: {
            path: `/api/proxy/foo`,
            method: 'GET',
          },
        });
        expect(http).toBeCalledWith(
          {
            url: `${mockConfigBaseUrl}/api/proxy/foo`,
            method: 'GET',
            headers: {
              authorization: 'Bearer some-token',
            },
          },
          logger,
        );
      });
    });
  });

  describe("when the action doesn't run correctly", () => {
    describe('with no proxy path', () => {
      it('fails to run', async () => {
        config = new ConfigReader({});
        action = createHttpBackstageAction({ config });
        await expect(
          async () =>
            await action.handler({
              ...mockContext,
              input: {
                path: '/api/path',
                method: 'GET',
              },
            }),
        ).rejects.toThrowError(
          'Unable to generate Backstage Url, baseUrl not provided in scaffolder action or the app config.',
        );
      });
    });
  });
});
