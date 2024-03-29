import { message } from 'antd';
import { createTeacherService } from './service';

/// watch this
let index = 0;
let dividedTimeList = [[]];
function divideTimeToStage(array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i + 1] - array[i] > 0.5) {
      // let array1 = [...array].splice(0, i + 1);
      dividedTimeList.push([]);
      dividedTimeList[index].push(array[i]);

      index += 1;
      let array2 = array.splice(i + 1, array.length);

      return divideTimeToStage(array2);
    } else {
      dividedTimeList[index].push(array[i]);
    }
  }

  return dividedTimeList;
}

const Model = {
  namespace: 'admin',
  state: {
    teacher: {
      name: '',
      dob: 0,
      location: '',
      gender: '',
      professions: [],
      free_time: {
        mon: {
          list_time: [],
          stages: [
            {
              start_time: 0,
              end_time: 0,
            },
          ],
        },
        tue: {
          list_time: [],
          stages: [
            {
              start_time: 0,
              end_time: 0,
            },
          ],
        },
        wed: {
          list_time: [],
          stages: [
            {
              start_time: 0,
              end_time: 0,
            },
          ],
        },
        thu: {
          list_time: [],
          stages: [
            {
              start_time: 0,
              end_time: 0,
            },
          ],
        },
        fri: {
          list_time: [],
          stages: [
            {
              start_time: 0,
              end_time: 0,
            },
          ],
        },
        sat: {
          list_time: [],
          stages: [
            {
              start_time: 0,
              end_time: 0,
            },
          ],
        },
        sun: {
          list_time: [],
          stages: [
            {
              start_time: 0,
              end_time: 0,
            },
          ],
        },
      },
      raw_time_data: {},
    },
  },
  effects: {
    *createTeacher({ payload }, { call }) {
      console.log(payload);
      yield call(createTeacherService, payload);
      message.success('success');
    },
    *createFreeTime({ payload }, { put }) {
      yield put({
        type: 'createFreeTimeReducer',
        payload,
      });

      yield put({
        type: 'createFreeTimeByStageReducer',
      });
    },
    *clearFreeTime({}, { put }) {
      yield put({
        type: 'clearFreeTimeReducer',
      });
    },
    *clearFreeTimeByDay({ payload }, { put }) {
      yield put({
        type: 'clearFreeTimeByDayReducer',
        payload,
      });
    },
  },
  reducers: {
    createFreeTimeReducer(state, action) {
      let newState = { ...state };
      // reset after every change
      for (let day in newState.teacher.free_time) {
        newState.teacher.free_time[day].list_time = [];
      }

      // create/update list of times
      for (const [key, value] of Object.entries(action.payload)) {
        let userFreeDay = '';
        switch (value.getDay()) {
          case 0:
            userFreeDay = 'sun';
            break;
          case 1:
            userFreeDay = 'mon';
            break;
          case 2:
            userFreeDay = 'tue';
            break;
          case 3:
            userFreeDay = 'wed';
            break;
          case 4:
            userFreeDay = 'thu';
            break;
          case 5:
            userFreeDay = 'fri';
            break;
          case 6:
            userFreeDay = 'sat';

          default:
            break;
        }

        let localTime = 0;
        if (value.getMinutes() === 0) {
          localTime = value.getHours();
        } else {
          localTime = value.getHours() + value.getMinutes() / 60;
        }

        newState.teacher.free_time[userFreeDay].list_time.push(localTime);
        newState.teacher.free_time[userFreeDay].list_time.sort(function (a, b) {
          return a - b;
        });
      }
      return newState;
    },
    createFreeTimeByStageReducer(state) {
      let newState = { ...state };
      for (let day in newState.teacher.free_time) {
        let listTimeByDay = [...newState.teacher.free_time[day].list_time];
        if (listTimeByDay.length >= 1) {
          dividedTimeList = [[]];
          index = 0;
          newState.teacher.free_time[day].stages = [];
          let stages = divideTimeToStage(listTimeByDay);
          for (let i in stages) {
            let newStage = {};
            newStage.start_time = stages[i][0];
            newStage.end_time = stages[i][stages[i].length - 1];
            newState.teacher.free_time[day].stages.push(newStage);
          }
        }
      }

      return newState;
    },
    clearFreeTimeReducer(state) {
      let newState = { ...state };
      for (let day in newState.teacher.free_time) {
        newState.teacher.free_time[day].list_time = [];
        newState.teacher.free_time[day].start_time = 0;
        newState.teacher.free_time[day].end_time = 0;
      }

      return newState;
    },
    clearFreeTimeByDayReducer(state, action) {
      let newState = { ...state };
      newState.teacher.free_time[action.payload].list_time = [];

      return newState;
    },
  },
};

export default Model;
