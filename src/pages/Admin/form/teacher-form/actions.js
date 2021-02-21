export const createTeacher = ({ teacher }) => {
  return {
    type: 'admin/createTeacher',
    payload: teacher,
  };
};

export const createFreeTime = ({ schedule }) => {
  return {
    type: 'admin/createFreeTime',
    payload: schedule,
  };
};

export const clearFreeTimeByDay = ({ day }) => {
  return {
    type: 'admin/clearFreeTimeByDay',
    payload: day,
  };
};

export const clearFreeTime = () => {
  return {
    type: 'admin/clearFreeTime',
  };
};
