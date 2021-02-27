import {
  DingdingOutlined,
  DownOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Descriptions,
  Divider,
  Tooltip,
  Empty,
  Table,
  Row,
  Tag,
  Tabs,
  Modal,
  message,
  Collapse
} from 'antd';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import styles from './style.less';
import Availability from "./components/Availability"
import TeacherProfessions from "./components/TeacherProfessions"
import { getTeacherById } from "./actions"

const { TabPane } = Tabs;
const { Panel } = Collapse

const TeacherProfile = (props) => {
  const [selectedRowsState, setSelectedRows] = useState([]);

  const { teacher } = props
  const teacherId = props.location.pathname.split('/')[4]

  useEffect(() => {
    props.getTeacherById({ id: teacherId })
  }, [])

  const renderTagColor = (subject) => {
    let color = 'geekblue';
    switch (subject) {
      case 'cap1':
        color = 'green'
        break;
      case 'cap2':
        color = 'geekblue'
        break;
      case 'cap3':
        color = 'orange'
        break;
      case 'ielts':
        color = 'volcano'
        break;
      case 'toefl':
        color = 'purple'
        break;

      default:
        break;
    }

    return color
  }

  const description = (
    <RouteContext.Consumer>
      {({ isMobile }) => (
        <Descriptions className={styles.headerList} size="small" column={isMobile ? 1 : 2}>
          <Descriptions.Item label="Name">{teacher.name}</Descriptions.Item>
          <Descriptions.Item label="Year of Birth">{teacher.dob}</Descriptions.Item>
          <Descriptions.Item label="Location">{teacher.location}</Descriptions.Item>
          <Descriptions.Item label="Gender">{teacher.gender}</Descriptions.Item>
          <Descriptions.Item label="Professions">
            <TeacherProfessions />
          </Descriptions.Item>
          <Descriptions.Item label="Description">Description goes here</Descriptions.Item>
          <Descriptions.Item label="Availability">
            <Availability />
          </Descriptions.Item>
        </Descriptions>
      )}
    </RouteContext.Consumer>
  );


  return (
    <PageContainer
      title={`Teacher ID: ${teacher.id}`}
      className={styles.pageHeader}
      content={description}
    >
      <Tabs defaultActiveKey="0">

      </Tabs>

    </PageContainer>
  );
}

const mapStateToProps = (state) => {
  return {
    teacher: state.teacher.teacher
  }
}

const mapDispatchToProps = {
  getTeacherById
}

export default connect(mapStateToProps, mapDispatchToProps)(TeacherProfile)
