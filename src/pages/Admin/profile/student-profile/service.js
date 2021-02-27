import request from 'umi-request';

export async function pickTeachersService(params) {
  console.log(params)
  const reqBody = {
    teacher_list: params.listTeachers,
  }
  return request(`/api/admin/pick-teachers/${params.studentId}`, {
    method: 'POST',
    data: reqBody,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getAssignedTeachers(params) {
  return request(`/api/admin/${params}/teachers`)
}

// export async function createTeacherService(params) {
//   return request('/api/admin/teacher/create', {
//     method: 'POST',
//     data: params,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
// }
