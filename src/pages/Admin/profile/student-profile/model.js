import { message } from 'antd';
import { pickTeachersService, getAssignedTeachers } from './service';

const Model = {
  namespace: 'subject',
  state: {
    listTeachers: [],
  },
  effects: {
    *pickTeachers({ payload }, { call, put }) {
      const data = yield call(pickTeachersService, payload);
      console.log(data);
      message.success('success');
      yield put({
        type: 'pickTeachersReducer',
        payload: data,
      });
    },
    *getAssignedTeachers({ payload }, { call, put }) {
      const data = yield call(getAssignedTeachers, payload);

      yield put({
        type: 'getAssignedTeachersReducer',
        payload: data
      })
    },
  },
  reducers: {
    pickTeachersReducer(state, action) {
      let newState = { ...state };
      newState.listTeachers.push(action.payload);

      return newState;
    },
    getAssignedTeachersReducer(state, action) {
      return {
        ...state,
        listTeachers: action.payload
      }
    }
  },
};

export default Model;
