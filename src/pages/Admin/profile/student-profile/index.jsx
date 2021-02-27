import {
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
import { getTeacherById } from "../teacher-profile/actions"
import ScheduleSelector from 'react-schedule-selector';

const { TabPane } = Tabs;
const { Panel } = Collapse

const StudentProfile = (props) => {
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([])

  const [pickedTeachers, setPickedTeachers] = useState([])


  const { profile } = props
  const studentId = props.location.pathname.split('/')[4]

  useEffect(() => {
    props.getStudentProfileById({ id: studentId })
    props.generateTeachers({ id: studentId })
    props.getAssignedTeachers({ studentId })
    setPickedTeachers(props.listTeachers)
    props.listTeachers?.map((teacher) => {
      setSelectedSubject((prevArr) => [...prevArr, teacher.subject])
    })
  }, [])

  useEffect(() => {
    setPickedTeachers(props.listTeachers)
    props.listTeachers?.map((teacher) => {
      setSelectedSubject((prevArr) => [...prevArr, teacher.subject])
    })
  }, [props.listTeachers])

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
          <Descriptions.Item label="Name">{profile.name}</Descriptions.Item>
          <Descriptions.Item label="Year of Birth">{profile.dob}</Descriptions.Item>
          <Descriptions.Item label="Location">{profile.location}</Descriptions.Item>
          <Descriptions.Item label="Gender">{profile.gender}</Descriptions.Item>
          <Descriptions.Item label="Demand">
            <StudentDemand />
          </Descriptions.Item>
          <Descriptions.Item label="Description">Description goes here</Descriptions.Item>
          <Descriptions.Item label="Availability">
            <Availability />
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
            let color = renderTagColor(tag)
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
      <Tabs defaultActiveKey="0">

        {profile.demand?.map((subject, subjectIndex) => {
          let teachersBySubject = dataSource?.filter(teacher => teacher.professions.includes(subject))
          let color = renderTagColor(subject)
          return (
            <TabPane tab={subject} key={subjectIndex}>
              <div className={styles.main}>
                <GridContent>
                  <Card
                    title={`List Teachers for ${subject}`}
                    style={{
                      marginBottom: 24,
                    }}
                    bordered={false}
                  >
                    <Table
                      dataSource={teachersBySubject}
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
                  </Card>
                </GridContent>
              </div>

              <Divider>
                <span>Pick your {subject} teacher</span>
                <Tooltip title="You can only pick 1 teacher for each subject">
                  <InfoCircleOutlined
                    style={{
                      marginRight: 4,
                      marginLeft: 4
                    }}
                  />
                </Tooltip>
              </Divider>

              <Card className={styles.teacherPicker}>
                <Tag
                  visible={selectedRowsState.length > 0 || props.listTeachers?.length > 0}
                  draggable color={color}
                  key={subject}
                  onClick={() => {
                    if (!selectedRowsState[0].professions.includes(subject)) {
                      message.error("this teacher is incompatible")
                      setSelectedRows([])
                    } else {
                      if (!selectedSubject.includes(subject)) {
                        // add subject to each teacher in tracking student
                        selectedRowsState[0].subject = subject
                        setPickedTeachers((prevArr) => [...prevArr, selectedRowsState[0]])

                        props.getTeacherById({ id: selectedRowsState[0].id })
                      } else {
                        message.error("this subject already has teacher")
                      }
                    }

                    setSelectedSubject((prevArray) => [...prevArray, subject])
                  }} className={styles.pickTag} >
                  {subject.toUpperCase()}
                </Tag>
              </Card>
            </TabPane>
          )
        })}

      </Tabs>


      {pickedTeachers.length > 0 && profile.demand?.map((item, itemIndex) => {
        if (selectedSubject.includes(item)) {
          return (
            <p>
              <Card
                key={itemIndex}
                className={styles.pickTag}
              >
                {pickedTeachers.map((teacher, index) => {
                  console.log(teacher)
                  if (index === itemIndex) {
                    const teacherTime = [...teacher.raw_time_data]
                    const studentTime = [...profile.raw_time_data]

                    let commonTime = teacherTime.filter(time => {
                      return studentTime.indexOf(time) !== -1
                    })

                    let commonTimeObject = { ...commonTime }

                    let convertedTime = []
                    for (let time in commonTimeObject) {
                      convertedTime.push(new Date(commonTimeObject[time]))
                    }

                    return (
                      <Collapse key={teacher.key}>
                        <Panel header={item}>
                          <p>Name: {teacher.name}</p>
                          <p>Gender: {teacher.gender}</p>
                          <p>Year of birth: {teacher.dob}</p>
                          <p>Teaching: {item}</p>
                          <p>Location: {teacher.location}</p>
                          <p>Distance to student's home: {teacher.distance}</p>
                          <p>
                            <ScheduleSelector
                              selection={convertedTime}
                              numDays={7}
                              minTime={8}
                              maxTime={22}
                              hourlyChunks={2}
                              startDate={new Date(2021, 2, 22)} //monday
                              dateFormat="ddd"
                              timeFormat="hh mm a"
                            />
                          </p>
                        </Panel>
                      </Collapse>
                    )
                  }
                })}

                <Button>Delete</Button>
              </Card>
            </p>
          )
        }

      })}

      <Button
        type="primary"
        onClick={() => {
          console.log(pickedTeachers)
          props.pickTeachers({ studentId: studentId, listTeachers: pickedTeachers })
        }}
        disabled={props.listTeachers.length === profile.demand?.length}
      >Submit</Button>

      <Button onClick={() => {
        setPickedTeachers([])
        setSelectedSubject([])

      }}>Delete all</Button>

    </PageContainer>
  );
}

const mapStateToProps = (state) => {
  return {
    profile: state.studentProfile.profile,
    listTeachers: state.pickTeacher.listTeachers
  }
}

const mapDispatchToProps = {
  getStudentProfileById,
  generateTeachers,
  pickTeachers,
  getAssignedTeachers,
  getTeacherById
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentProfile)
