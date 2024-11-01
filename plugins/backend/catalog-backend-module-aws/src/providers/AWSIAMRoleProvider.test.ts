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

import { mockServices } from '@backstage/backend-test-utils';
import { IAM, ListRolesCommand, Role } from '@aws-sdk/client-iam';
import { STS, GetCallerIdentityCommand } from '@aws-sdk/client-sts';

import { mockClient } from 'aws-sdk-client-mock';
import { AWSIAMRoleProvider } from './AWSIAMRoleProvider';
import { ConfigReader } from '@backstage/config';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';

// const iam = mockClient(IAM);
const iam = mockClient(IAM);
const sts = mockClient(STS);

const logger = mockServices.logger.mock();
const scheduler = mockServices.scheduler.mock();

describe('AWSIAMRoleProvider', () => {
  const config = new ConfigReader({
    accountId: '123456789012',
    roleName: 'arn:aws:iam::123456789012:role/role1',
    region: 'eu-west-1',
  });

  beforeEach(() => {
    sts.on(GetCallerIdentityCommand).resolves({});
  });

  describe('where there is no users', () => {
    beforeEach(() => {
      iam.on(ListRolesCommand).resolves({
        Roles: [],
      });
    });

    it('creates no aws users', async () => {
      const entityProviderConnection: EntityProviderConnection = {
        applyMutation: jest.fn(),
        refresh: jest.fn(),
      };
      const provider = AWSIAMRoleProvider.fromConfig(config, {
        logger,
        scheduler,
      });
      provider.connect(entityProviderConnection);
      await provider.run();
      expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
        type: 'full',
        entities: [],
      });
    });
  });

  describe('where there are is a user', () => {
    beforeEach(() => {
      iam.on(ListRolesCommand).resolves({
        Roles: [
          {
            RoleId: 'asdfewfwef',
            RoleName: 'adsf',
            Arn: 'arn:aws:iam::123456789012:role/asdf',
          } as Partial<Role> as any,
        ],
      });
    });

    it('creates aws users', async () => {
      const entityProviderConnection: EntityProviderConnection = {
        applyMutation: jest.fn(),
        refresh: jest.fn(),
      };
      const provider = AWSIAMRoleProvider.fromConfig(config, {
        logger,
        scheduler,
      });
      provider.connect(entityProviderConnection);
      await provider.run();
      expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
        type: 'full',
        entities: [
          expect.objectContaining({
            entity: expect.objectContaining({
              kind: 'Resource',
              metadata: expect.objectContaining({
                title: 'adsf',
              }),
            }),
          }),
        ],
      });
    });
  });
});
