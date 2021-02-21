export const getStudentProfileById = ({ id }) => {
  return {
    type: 'studentProfile/getStudentProfileById',
    payload: id,
  };
};

export const generateTeachers = ({ id }) => {
  return {
    type: 'studentProfile/generateTeachers',
    payload: id,
  };
};
