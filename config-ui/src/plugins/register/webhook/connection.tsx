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

import { useState } from 'react';
import { EyeOutlined, FormOutlined, CloseCircleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Flex, Table, Space, Button, Modal } from 'antd';

import { Message } from '@/components';
import { useAppSelector } from '@/hooks';
import { selectWebhooks } from '@/features/connections';
import { IWebhook } from '@/types';

import { CreateDialog, ViewDialog, EditDialog, DeleteDialog } from './components';

type Type = 'add' | 'edit' | 'show' | 'delete' | 'remove';

interface Props {
  fromProject?: boolean;
  filterIds?: ID[];
  onAssociate?: (id: ID) => void;
  onRemove?: (id: ID) => void;
}

export const WebHookConnection = ({ filterIds, fromProject = false, onAssociate, onRemove }: Props) => {
  const [type, setType] = useState<Type>();
  const [currentID, setCurrentID] = useState<ID>();

  const webhooks = useAppSelector(selectWebhooks);

  const handleHideDialog = () => {
    setType(undefined);
    setCurrentID(undefined);
  };

  const handleShowDialog = (t: Type, r?: IWebhook) => {
    setType(t);
    setCurrentID(r?.id);
  };

  return (
    <Flex vertical gap="middle">
      <Table
        rowKey="id"
        size="middle"
        columns={[
          {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
          },
          {
            title: 'Webhook Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, row) => <span onClick={() => handleShowDialog('show', row)}>{name}</span>,
          },
          {
            title: '',
            dataIndex: '',
            key: 'action',
            align: 'center',
            render: (_, row) => (
              <Space>
                <Button type="primary" icon={<EyeOutlined />} onClick={() => handleShowDialog('show', row)} />
                <Button type="primary" icon={<FormOutlined />} onClick={() => handleShowDialog('edit', row)} />
                {fromProject ? (
                  <Button
                    type="primary"
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() => handleShowDialog('remove', row)}
                  />
                ) : (
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleShowDialog('delete', row)}
                  />
                )}
              </Space>
            ),
          },
        ]}
        dataSource={webhooks.filter((cs) => (filterIds ? filterIds.includes(cs.id) : true))}
        pagination={false}
      />
      <Flex>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleShowDialog('add')}>
          Add a Webhook
        </Button>
      </Flex>
      {type === 'add' && <CreateDialog open onCancel={handleHideDialog} onSubmitAfter={(id) => onAssociate?.(id)} />}
      {type === 'show' && currentID && <ViewDialog initialId={currentID} onCancel={handleHideDialog} />}
      {type === 'edit' && currentID && <EditDialog initialId={currentID} onCancel={handleHideDialog} />}
      {type === 'delete' && currentID && <DeleteDialog initialId={currentID} onCancel={handleHideDialog} />}
      {type === 'remove' && currentID && (
        <Modal
          open
          title="Remove this Webhook?"
          okText="Confirm"
          onCancel={handleHideDialog}
          onOk={() => {
            onRemove?.(currentID);
            handleHideDialog();
          }}
        >
          <Message content="This will only remove the webhook from this project. To permanently delete the webhook, please visit the Connections page." />
        </Modal>
      )}
    </Flex>
  );
};
