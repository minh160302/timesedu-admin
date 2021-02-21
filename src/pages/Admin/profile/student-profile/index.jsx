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
import { getStudentProfileById, generateTeachers } from "../../list/student-list/actions"
import Availability from "./components/Availability"
import StudentDemand from "./components/StudentDemand"
import { pickTeachers, getAssignedTeachers } from "./actions"

const { TabPane } = Tabs;
const { Panel } = Collapse

const StudentProfile = (props) => {
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("")

  const [pickedTeachers, setPickedTeachers] = useState([])
  const [pickedSubject, setPickedSubject] = useState([])


  const { profile } = props
  const studentId = props.location.pathname.split('/')[4]

  useEffect(() => {
    props.getStudentProfileById({ id: studentId })
    props.generateTeachers({ id: studentId })
    props.getAssignedTeachers({ studentId })
  }, [])

  useEffect(() => {
    setPickedTeachers(props.listTeachers)
  }, [props.listTeachers])

  const description = (
    <RouteContext.Consumer>
      {({ isMobile }) => (
        <Descriptions className={styles.headerList} size="small" column={isMobile ? 1 : 2}>
          <Descriptions.Item label="Name">{profile.name}</Descriptions.Item>
          <Descriptions.Item label="Year of Birth">{profile.dob}</Descriptions.Item>
          <Descriptions.Item label="Location">{profile.location}</Descriptions.Item>
          <Descriptions.Item label="Gender">{profile.gender}</Descriptions.Item>
          <Descriptions.Item label="Demand">
            <StudentDemand />
          </Descriptions.Item>
          <Descriptions.Item label="Description">Description goes here</Descriptions.Item>
          <Descriptions.Item label="Availability">
            <Availability time={profile.free_time} />
          </Descriptions.Item>
        </Descriptions>
      )}
    </RouteContext.Consumer>
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Birth Year',
      dataIndex: 'dob',
      key: 'dob',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Distance',
      dataIndex: 'distance',
      key: 'distance',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Professions',
      dataIndex: 'professions',
      key: 'professions',
      render: tags => (
        <>
          {tags.map(tag => {
            let color = 'geekblue';
            //  : 'green';

            switch (tag) {
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
            return (
              <Tag draggable color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
  ];

  // add key to list teachers in table
  let dataSource = props.profile.list_teachers
  if (dataSource?.length >= 1) {
    dataSource.map((item, index) => {
      item["key"] = index
    })
  }

  return (
    <PageContainer
      title={`Student ID: ${profile.id}`}
      className={styles.pageHeader}
      content={description}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Detail" key="1">
          <div className={styles.main} tabIndex={0}>
            <GridContent>
              <Card
                title="List Teachers"
                style={{
                  marginBottom: 24,
                }}
                bordered={false}
              >
                <Table
                  dataSource={dataSource}
                  columns={columns}
                  rowSelection={{
                    type: "radio",
                    onChange: (_, selectedRows) => {
                      setSelectedRows(selectedRows);
                    },
                    getCheckboxProps: () => ({
                      disabled: pickedTeachers.length === profile.demand?.length, // Column configuration not to be checked
                    }),
                  }} />

                <Divider>
                  <span>Pick teacher for the subjects below</span>
                  <Tooltip title="pick 1 and submit respectively">
                    <InfoCircleOutlined
                      style={{
                        marginRight: 4,
                        marginLeft: 4
                      }}
                    />
                  </Tooltip>
                </Divider>
                <Card className={styles.teacherPicker}>
                  {profile.demand?.map(tag => {
                    let color = 'geekblue';
                    //  : 'green';

                    switch (tag) {
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
                    return (
                      <Tag
                        visible={selectedRowsState.length > 0 || props.listTeachers?.length > 0}
                        draggable color={color}
                        key={tag}
                        onClick={() => {
                          if (!selectedRowsState[0].professions.includes(tag)) {
                            message.error("this teacher is incompatible")
                            setSelectedRows([])
                          } else {
                            if (!pickedSubject.includes(tag)) {
                              // selectedRowsState[0].professions = tag
                              setPickedTeachers((prevArr) => [...prevArr, selectedRowsState[0]])
                              setPickedSubject((prevArr) => [...prevArr, tag])
                            } else {
                              message.error("this subject already has teacher")
                            }
                          }

                          setSelectedSubject(tag)
                        }} className={styles.pickTag} >
                        {tag.toUpperCase()}
                      </Tag>
                    );
                  })}
                </Card>

                {profile.demand?.map((item, itemIndex) => {
                  return (
                    <p>
                      <Card className={styles.pickTag} style={selectedSubject === item || pickedTeachers.length > 0 ? { display: "block" } : { display: "none" }}>
                        {pickedTeachers.map((teacher, index) => {
                          if (index === itemIndex) {
                            return (
                              <Collapse key={teacher.key}>
                                <Panel header={teacher.subject}>
                                  <p>Name: {teacher.name}</p>
                                  <p>Gender: {teacher.gender}</p>
                                  <p>Year of birth: {teacher.dob}</p>
                                  <p>Location: {teacher.location}</p>
                                  <p>Distance to student's home: {teacher.distance}</p>
                                  {/* <p>{selectedRowsState[0]}</p> */}
                                </Panel>
                              </Collapse>
                            )
                          }
                        })}
                      </Card>
                    </p>
                  )
                })}

                <Button onClick={() => {
                  // props.pickTeachers({ studentId: studentId, teacherId: selectedRowsState[0]?.id })
                  console.log(pickedTeachers)
                  props.pickTeachers({ studentId: studentId, listTeacher: pickedTeachers, listSubject: pickedSubject })
                }}>Submit</Button>

                <Button onClick={() => {
                  setPickedTeachers([])
                  setPickedSubject([])
                }}>Reset</Button>
              </Card>
            </GridContent>
          </div>
        </TabPane>
        <TabPane tab="Tab 2" key="2">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="Tab 3" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>

    </PageContainer>
  );
}

const mapStateToProps = (state) => {
  return {
    profile: state.studentProfile.profile,
    listTeachers: state.subject.listTeachers
  }
}

const mapDispatchToProps = {
  getStudentProfileById,
  generateTeachers,
  pickTeachers,
  getAssignedTeachers
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentProfile)
