import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Space } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import { queryRule, removeRule } from './service';
import { connect, history } from "umi"

const handleRemove = async (selectedRows) => {
  const hide = message.loading('Deleting');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Deletion failed, please try again');
    return false;
  }
};

const handleNewClick = () => {
  history.push("/admin/form/teacher")
}

const TableList = () => {
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const columns = [
    {
      title: "No.",
      dataIndex: 'key',
      valueType: 'key',
      hideInForm: true
    },
    {
      title: "Name",
      dataIndex: 'name',
      valueType: 'name',
    },
    {
      title: "DOB",
      dataIndex: 'dob',
      valueType: 'dob',
    },
    {
      title: "Location",
      dataIndex: 'location',
      valueType: 'location',
    },
    {
      title: "Gender",
      dataIndex: 'gender',
      hideInForm: true,
      valueEnum: {
        0: {
          text: 'Male',
          gender: 'male',
        },
        1: {
          text: 'Female',
          gender: 'female',
        },
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: 'Shut down',
          status: 'Default',
        },
        1: {
          text: 'Running',
          status: 'Processing',
        },
        2: {
          text: 'Online',
          status: 'Success',
        },
        3: {
          text: 'Abnormal',
          status: 'Error',
        },
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => {
            console.log(record.id)
            // history.push("/admin/")
          }}>View details</a>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle="List of Teachers"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={handleNewClick}>
            <PlusOutlined /> New
          </Button>,
        ]}
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              Chosen{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              items&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Delele
          </Button>
          <Button type="primary">Approve</Button>
        </FooterToolbar>
      )}

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
