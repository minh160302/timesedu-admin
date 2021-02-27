export const getTeacherById = ({ id }) => {
  return {
    type: 'teacher/getTeacherById',
    payload: id,
  };
};
