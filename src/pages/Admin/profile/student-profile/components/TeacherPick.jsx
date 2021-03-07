import React, { useState } from "react"
import ScheduleSelector from "react-schedule-selector"
import { connect } from "umi"
import { Collapse, Input, Tooltip, TimePicker, Button, Form, Space, Select, message } from "antd"
import { QuestionCircleOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import moment from 'moment';
import { pickMeetingTime } from "../actions"

const { RangePicker } = TimePicker
const { Panel } = Collapse
const { Option } = Select

const TeacherPick = (props) => {
  const { listPickedTeachers, subject, subjectIndex, profile } = props
  let convertedTime = []

  const onFinish = (values) => {
    let meetingTimes = {}
    // console.log('Received values of form:', values);
    for (let meeting of values.meetingTimes) {
      // meetingTimes is an object with key is weekday
      let { day, time } = meeting
      let [start, end] = time
      meetingTimes[day] = []


      let startTime = convertToTime(day, start)

      meetingTimes[day].push(startTime)
      let endTime = convertToTime(day, end)

      const chunks = parseInt((endTime.getTime() - startTime.getTime()) / 1800000)
      // initial time, in hour
      let pointerTime = moment(start).toDate().getHours() + moment(start).toDate().getMinutes() / 60
      for (let i = 0; i < chunks; i++) {
        if (i != 0) {
          pointerTime += 0.5

          let timeBetween = new Date()
          timeBetween.setMinutes((pointerTime % 1) * 60)  //get the minutes: 0 or 30
          timeBetween.setHours(Math.floor(pointerTime))
          timeBetween.setMonth(2)
          timeBetween.setSeconds(0)
          if (day === 'sun') {
            timeBetween.setDate(28)
          } else {
            timeBetween.setDate(21 + convertWeekDayToNum(day))
          }
          meetingTimes[day].push(timeBetween)
        }
      }

      meetingTimes[day].push(endTime)
    }

    props.pickMeetingTime({ subject, meetingTimes })
  };

  const handleOKPicker = (value) => {
    // TODO:L validate the input time
  }


  // time is moment object
  const convertToTime = (day, time) => {
    let hour = moment(time).toDate().getHours().toPrecision()
    let minute = moment(time).toDate().getMinutes()

    let component = new Date()
    component.setHours(hour)
    component.setMinutes(minute)
    component.setMonth(2)
    component.setSeconds(0)
    // set the week day
    if (day === 'sun') {
      component.setDate(28)
    } else {
      component.setDate(21 + convertWeekDayToNum(day))
    }

    return component
  }

  const convertToWeekDay = (num) => {
    let day = '';
    switch (num) {
      case 0:
        day = 'sun';
        break;
      case 1:
        day = 'mon';
        break;
      case 2:
        day = 'tue';
        break;
      case 3:
        day = 'wed';
        break;
      case 4:
        day = 'thu';
        break;
      case 5:
        day = 'fri';
        break;
      case 6:
        day = 'sat';

      default:
        break;
    }
    return day
  }

  const convertWeekDayToNum = (day) => {
    let num = 0;
    switch (day) {
      case 'sun':
        num = 0;
        break;
      case 'mon':
        num = 1;
        break;
      case 'tue':
        num = 2;
        break;
      case 'wed':
        num = 3;
        break;
      case 'thu':
        num = 4;
        break;
      case 'fri':
        num = 5;
        break;
      case 'sat':
        num = 6;

      default:
        break;
    }
    return num
  }

  const handleChooseDay = (key, value) => {
    Object.entries(convertedTime).map(([key, value]) => {
      const day = convertToWeekDay(value.getDay())
      return day
    }).includes(key) || message.error(`The teacher is not available on ${value.children}`)
  }

  return (
    <div>
      {listPickedTeachers.map((teacher, index) => {
        if (index === subjectIndex) {
          const teacherTime = [...teacher.raw_time_data]
          const studentTime = [...profile.raw_time_data]

          let commonTime = teacherTime.filter(time => {
            return studentTime.indexOf(time) !== -1
          })

          let commonTimeObject = { ...commonTime }
          for (let time in commonTimeObject) {
            convertedTime.push(new Date(commonTimeObject[time]))
          }

          return (
            <Collapse key={teacher.key}>
              <Panel header={subject}>
                <p>Name: {teacher.name}</p>
                <p>Gender: {teacher.gender}</p>
                <p>Year of birth: {teacher.dob}</p>
                <p>Teaching: {subject}</p>
                <p>Location: {teacher.location}</p>
                <p>Distance to student's home: {teacher.distance}</p>
                <p>
                  Possible meeting time &nbsp;
                  <Tooltip title="This table is read-only">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </p>
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
                <p>
                  <div>Meeting time</div>
                  <div>
                    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
                      <div>
                        {teacher.meeting_time && Object.keys(teacher.meeting_time).map((item, index) => {
                          if (teacher.meeting_time[item] != null) {
                            const listTimeInOneMeeting = teacher.meeting_time[item]
                            const duration = teacher.meeting_time[item].filter((e, index) =>
                              index === 0 || index === listTimeInOneMeeting.length - 1)

                            const start = moment(duration[0]).toDate()
                            const end = moment(duration[1]).toDate()

                            return (
                              <div>
                                <Select key={index} placeholder="Select weekday" style={{ width: 200 }} defaultValue={item} disabled >
                                  <Option value="mon">Monday</Option>
                                  <Option value="tue">Tuesday</Option>
                                  <Option value="wed">Wednesday</Option>
                                  <Option value="thu">Thursday</Option>
                                  <Option value="fri">Friday</Option>
                                  <Option value="sat">Saturday</Option>
                                  <Option value="sun">Sunday</Option>
                                </Select>

                                <RangePicker
                                  disabled
                                  defaultValue={[moment(`${start.getHours()}: ${start.getMinutes()}`, "HH:mm"), moment(`${end.getHours()}: ${end.getMinutes()}`, "HH:mm")]} />
                              </div>
                            )
                          }
                        })}
                      </div>
                      <Form.List name="meetingTimes">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(field => (
                              <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">

                                <Form.Item
                                  {...field}
                                  name={[field.name, 'day']}
                                  fieldKey={[field.fieldKey, 'day']}
                                >
                                  <Select placeholder="Select weekday" style={{ width: 200 }} onSelect={handleChooseDay} >
                                    <Option value="mon">Monday</Option>
                                    <Option value="tue">Tuesday</Option>
                                    <Option value="wed">Wednesday</Option>
                                    <Option value="thu">Thursday</Option>
                                    <Option value="fri">Friday</Option>
                                    <Option value="sat">Saturday</Option>
                                    <Option value="sun">Sunday</Option>
                                  </Select>
                                </Form.Item>

                                <Form.Item
                                  {...field}
                                  name={[field.name, 'time']}
                                  fieldKey={[field.fieldKey, 'time']}
                                >
                                  <RangePicker format="HH mm" minuteStep={30} onOk={handleOKPicker} />
                                </Form.Item>

                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                              </Space>
                            ))}
                            <Form.Item>
                              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add meeting time
                               </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                </p>
              </Panel>
            </Collapse>
          )
        }
      })}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    profile: state.studentProfile.profile,
  }
}

const mapDispatchToProps = {
  pickMeetingTime
}

export default connect(mapStateToProps, mapDispatchToProps)(TeacherPick);