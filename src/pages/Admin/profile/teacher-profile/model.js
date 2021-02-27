import { message } from 'antd';
import { getTeacherByIdService } from './service';

const Model = {
  namespace: 'teacher',
  state: {
    teacher: {},
  },
  effects: {
    *getTeacherById({ payload }, { call, put }) {
      const teacher = yield call(getTeacherByIdService, payload);
      yield put({
        type: 'getTeacherByIdReducer',
        payload: teacher,
      });
    },
  },
  reducers: {
    getTeacherByIdReducer(state, action) {
      return {
        ...state,
        teacher: action.payload,
      };
    },
  },
};

export default Model;
