/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { request } from '@/utils';

import { ICheck, ITransform2deployments } from './types';

export const list = (plugin: string, connectionId: ID) =>
  request(`/plugins/${plugin}/connections/${connectionId}/scope-configs`);

export const get = (plugin: string, connectionId: ID, id: ID) =>
  request(`/plugins/${plugin}/connections/${connectionId}/scope-configs/${id}`);

export const create = (plugin: string, connectionId: ID, data: any) =>
  request(`/plugins/${plugin}/connections/${connectionId}/scope-configs`, {
    method: 'post',
    data,
  });

export const update = (plugin: string, connectionId: ID, id: ID, data: any) =>
  request(`/plugins/${plugin}/connections/${connectionId}/scope-configs/${id}`, {
    method: 'patch',
    data,
  });

export const check = (plugin: string, id: ID): Promise<ICheck> =>
  request(`/plugins/${plugin}/scope-config/${id}/projects`);

export const deployments = (plugin: string, connectionId: ID): Promise<string[]> =>
  request(`/plugins/${plugin}/connections/${connectionId}/deployments`);

export const transform2deployments = (
  plugin: string,
  connectionId: ID,
  data: {
    deploymentPattern: string;
    productionPattern: string;
  } & Pagination,
): Promise<{ total: number; data: ITransform2deployments[] | null }> =>
  request(`/plugins/${plugin}/connections/${connectionId}/transform-to-deployments`, {
    method: 'post',
    data,
  });
