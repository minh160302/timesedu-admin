export const pickTeachers = ({ studentId, listTeachers }) => {
  return {
    type: 'pickTeacher/pickTeachers',
    payload: { studentId, listTeachers },
  };
};

export const getAssignedTeachers = ({ studentId }) => {
  return {
    type: 'pickTeacher/getAssignedTeachers',
    payload: studentId,
  };
};

export const pickMeetingTime = ({ subject, meetingTimes }) => {
  return {
    type: 'pickTeacher/pickMeetingTime',
    payload: { subject, meetingTimes },
  };
};