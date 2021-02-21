import { message } from 'umi';
import { getStudentProfileService, generateTeachersService } from './service';

const Model = {
  namespace: 'studentProfile',
  state: {
    profile: {},
  },
  effects: {
    *getStudentProfileById({ payload }, { call, put }) {
      const profile = yield call(getStudentProfileService, payload);
      yield put({
        type: 'getStudentProfileReducer',
        payload: profile,
      });
    },
    *generateTeachers({ payload }, { call, put }) {
      const listTeachers = yield call(generateTeachersService, payload);
      yield put({
        type: 'generateTeachersReducer',
        payload: listTeachers,
      });
    },
  },
  reducers: {
    getStudentProfileReducer(state, action) {
      return {
        ...state,
        profile: action.payload,
      };
    },
    generateTeachersReducer(state, action) {
      return {
        ...state,
        profile: {
          ...state.profile,
          list_teachers: action.payload
        },
      };
    },
  },
};

export default Model;
