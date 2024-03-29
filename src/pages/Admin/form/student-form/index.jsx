import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Input, Form, InputNumber, Radio, Select, Tooltip, Space, Checkbox, Row, Col } from 'antd';
import { connect, FormattedMessage, formatMessage } from 'umi';
import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './style.less';
import { clearFreeTime, createStudent, clearFreeTimeByDay, createFreeTime } from "./actions"

import ScheduleSelector from "react-schedule-selector"

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const StudentForm = (props) => {
  const { submitting } = props;
  const [form] = Form.useForm();
  const [showPublicUsers, setShowPublicUsers] = React.useState(false);
  const [schedule, setSchedule] = useState([])

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 7,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 12,
      },
      md: {
        span: 10,
      },
    },
  };
  const submitFormLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 10,
        offset: 7,
      },
    },
  };

  const onFinish = (values) => {
    values.free_time = props.student.free_time
    values.gender = values.gender[0]
    values.dob = values.dob.year()
    console.log(values)
    values.raw_time_data = schedule

    props.createStudent({ student: values })

    setTimeout(() => {
      window.location.reload()
    }, 1500)
  };

  const onFinishFailed = (errorInfo) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  const onValuesChange = (changedValues) => {
    const { publicType } = changedValues;
    if (publicType) setShowPublicUsers(publicType === '2');
  };

  const onDateChange = (date, dateString) => {
    console.log(date, dateString);
  }

  const handleScheduleChange = (newSchedule) => {
    setSchedule(newSchedule);
    console.log(newSchedule)
    props.createFreeTime({ schedule: newSchedule })
  }

  const handleScheduleClear = () => {
    setSchedule([])
    props.clearFreeTime();
  }

  return (
    <PageContainer content={<FormattedMessage id="formandbasic-form.basic.description" />}>
      <Card bordered={false}>
        <Form
          hideRequiredMark
          style={{
            marginTop: 8,
          }}
          form={form}
          name="basic"
          initialValues={{
            public: '1',
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={onValuesChange}
        >
          <FormItem
            {...formItemLayout}
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter student's name",
              },
            ]}
          >
            <Input
              placeholder="Student's name"
            />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Year of Birth"
            name="dob"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'formandbasic-form.year.required',
                }),
              },
            ]}
          >
            <DatePicker onChange={onDateChange} picker="year" placeholder="Enter a year" />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={
              <span>
                <span>Location</span>
                <em className={styles.optional}>
                  <Tooltip title="your exact house number">
                    <InfoCircleOutlined
                      style={{
                        marginRight: 4,
                        marginLeft: 4
                      }}
                    />
                  </Tooltip>
                </em>
              </span>
            }
            name="location"
            rules={[
              {
                required: true,
                message: "Please enter the location",
              },
            ]}
          >
            <Input
              placeholder="Location"
            />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={
              <span>
                <span>Gender</span>
                <em className={styles.optional}>
                  <Tooltip title="Gender of teacher you want">
                    <InfoCircleOutlined
                      style={{
                        marginRight: 4,
                        marginLeft: 4
                      }}
                    />
                  </Tooltip>
                </em>
              </span>
            }
            name="gender"
            rules={[
              {
                required: true,
                message: "Please pick gender",
              },
            ]}
          >
            <Checkbox.Group>
              <Checkbox value="male">Male</Checkbox>
              <Checkbox value="female">Female</Checkbox>
            </Checkbox.Group>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={
              <span>
                <span>Demand</span>
                <em className={styles.optional}>
                  <Tooltip title="Which subject you want to improve?">
                    <InfoCircleOutlined
                      style={{
                        marginRight: 4,
                        marginLeft: 4
                      }}
                    />
                  </Tooltip>
                </em>
              </span>
            }
            name="demand"
            rules={[
              {
                required: true,
                message: "Please check the student's demand",
              },
            ]}
          >
            <Checkbox.Group>
              <Row>
                <Col span={12}>
                  <Checkbox value="cap1">Cap 1</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="cap2">Cap 2</Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Checkbox value="cap3">Cap 3</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="ielts">IELTS</Checkbox>
                </Col>
              </Row>
              <Row>
                <Checkbox value="toefl">TOEFL</Checkbox>
              </Row>
            </Checkbox.Group>
          </FormItem>


          <FormItem
            {...formItemLayout}
            label={
              <span>
                <span>Time</span>
                <em className={styles.optional}>
                  <Tooltip title="Free time">
                    <InfoCircleOutlined
                      style={{
                        marginRight: 4,
                        marginLeft: 4
                      }}
                    />
                  </Tooltip>
                </em>
              </span>
            }
            name="free_time"
          >
            <ScheduleSelector
              selection={schedule}
              numDays={7}
              minTime={8}
              maxTime={22}
              hourlyChunks={2}
              onChange={handleScheduleChange}
              startDate={new Date(2021, 2, 22)} //monday
              dateFormat="ddd"
              timeFormat="hh mm a"
            />
            <div className="clear-time-container">
              <Button onClick={handleScheduleClear} type="dashed" >Clear</Button>
            </div>
          </FormItem>

          <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 32,
            }}
          >
            <Button type="primary" htmlType="submit" loading={submitting}>
              <FormattedMessage id="formandbasic-form.form.submit" />
            </Button>
            <Button
              style={{
                marginLeft: 8,
              }}
            >
              <FormattedMessage id="formandbasic-form.form.save" />
            </Button>
          </FormItem>
        </Form>
      </Card>
    </PageContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    student: state.student.student
  }
}

const mapDispatchToProps = {
  clearFreeTime,
  createStudent,
  clearFreeTimeByDay,
  createFreeTime
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentForm)