export const createStudent = ({ student }) => {
  return {
    type: 'student/createStudent',
    payload: student,
  };
};

export const createFreeTime = ({ schedule }) => {
  return {
    type: 'student/createFreeTime',
    payload: schedule,
  };
};

export const clearFreeTimeByDay = ({ day }) => {
  return {
    type: 'student/clearFreeTimeByDay',
    payload: day,
  };
};

export const clearFreeTime = () => {
  return {
    type: 'student/clearFreeTime',
  };
};
