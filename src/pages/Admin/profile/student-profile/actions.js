export const pickTeachers = ({ studentId, listTeacher, listSubject }) => {
  return {
    type: 'subject/pickTeachers',
    payload: { studentId, listTeacher, listSubject },
  };
};

export const getAssignedTeachers = ({ studentId }) => {
  return {
    type: 'subject/getAssignedTeachers',
    payload: studentId,
  };
};