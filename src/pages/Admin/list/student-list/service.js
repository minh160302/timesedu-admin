import request from 'umi-request';

export async function queryRule(params) {
  const data = await request(`/api/admin/student`, {
    params: {
      page: params.current - 1,
      limit: params.pageSize,
    },
  });
  const mapData = data.data.map((d, index) => {
    return { ...d, key: index + 1 + (params.current - 1) * params.pageSize };
  });
  return {
    data: mapData,
    pageSize: data.meta.pageSize,
    total: data.meta.total,
    success: data.meta.success,
  };
}

export async function getStudentProfileService(params) {
  return request(`/api/admin/student/${params}`);
}

export async function generateTeachersService(params) {
  return request(`/api/admin/result/${params}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// export async function createTeacherService(params) {
//   return request('/api/admin/teacher/create', {
// method: 'POST',
// data: params,
// headers: {
//   'Content-Type': 'application/json',
// },
//   });
// }

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
