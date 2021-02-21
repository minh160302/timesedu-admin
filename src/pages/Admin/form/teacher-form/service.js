import request from 'umi-request';

export async function createTeacherService(params) {
  return request('/api/admin/teacher/create', {
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
