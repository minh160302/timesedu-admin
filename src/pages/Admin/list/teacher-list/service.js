import request from 'umi-request';

export async function queryRule(params) {
  const data = await request(`/api/admin/teacher`, {
    params: {
      page: params.current - 1,
      limit: params.pageSize
    }
  })
  const mapData = data.data.map((d, index) => {
    return{...d, key: index + 1 + (params.current - 1) * (params.pageSize)}
  })
  return {
    data: mapData,
    pageSize: data.meta.pageSize,
    total: data.meta.total,
    success: data.meta.success,
  }
  // const data = await request('/api/admin/student')
  // console.log(data)
  

  // return data
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}