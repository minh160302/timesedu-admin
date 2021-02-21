import request from 'umi-request';

export async function createStudentService(params) {
  return request('/api/admin/student/create', {
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
