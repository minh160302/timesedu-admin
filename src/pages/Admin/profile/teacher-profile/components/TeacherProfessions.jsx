import React from "react"
import { connect } from "umi"
import { Tag } from "antd"

const TeacherProfessions = (props) => {
  const { teacher } = props

  return (
    <div>
      {teacher.professions?.map(tag => {
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
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    teacher: state.teacher.teacher
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(TeacherProfessions)