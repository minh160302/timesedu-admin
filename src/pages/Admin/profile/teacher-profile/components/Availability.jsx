import React, { useState, useEffect } from "react"
import ScheduleSelector from "react-schedule-selector"
import { Button } from "antd"
import { connect } from "umi"

const Availability = (props) => {
  const { teacher } = props


  const [schedule, setSchedule] = useState([])

  useEffect(() => {
    let rawTime = { ...teacher.raw_time_data }

    for (let time in rawTime) {
      setSchedule((prevArray) => [
        ...prevArray,
        new Date(rawTime[time])
      ])
    }

  }, [teacher.raw_time_data])


  return (
    <div>
      <ScheduleSelector
        selection={schedule}
        numDays={7}
        minTime={8}
        maxTime={22}
        hourlyChunks={2}
        startDate={new Date(2021, 2, 22)} //monday
        dateFormat="ddd"
        timeFormat="hh mm a"
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    teacher: state.teacher.teacher
  }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Availability)