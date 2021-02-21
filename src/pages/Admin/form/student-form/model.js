import { message } from 'antd';
import { createStudentService } from './service';

/// watch this
let index = 0;
let dividedTimeList = [[]];
function divideTimeToStage(array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i + 1] - array[i] > 1) {
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

  return dividedTimeList
}

const Model = {
  namespace: 'student',
  state: {
    student: {
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
              start_time: -1,
              end_time: -1,
            },
          ],
        },
        tue: {
          list_time: [],
          stages: [
            {
              start_time: -1,
              end_time: -1,
            },
          ],
        },
        wed: {
          list_time: [],
          stages: [
            {
              start_time: -1,
              end_time: -1,
            },
          ],
        },
        thu: {
          list_time: [],
          stages: [
            {
              start_time: -1,
              end_time: -1,
            },
          ],
        },
        fri: {
          list_time: [],
          stages: [
            {
              start_time: -1,
              end_time: -1,
            },
          ],
        },
        sat: {
          list_time: [],
          stages: [
            {
              start_time: -1,
              end_time: -1,
            },
          ],
        },
        sun: {
          list_time: [],
          stages: [
            {
              start_time: -1,
              end_time: -1,
            },
          ],
        },
      },
    },
  },
  effects: {
    *createStudent({ payload }, { call }) {
      yield call(createStudentService, payload);
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
      for (let day in newState.student.free_time) {
        newState.student.free_time[day].list_time = [];
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

        newState.student.free_time[userFreeDay].list_time.push(value.getHours());
        newState.student.free_time[userFreeDay].list_time.sort(function (a, b) {
          return a - b;
        });
      }
      return newState;
    },
    createFreeTimeByStageReducer(state) {
      let newState = { ...state };
      for (let day in newState.student.free_time) {
        let listTimeByDay = [...newState.student.free_time[day].list_time];
        if (listTimeByDay.length >= 1) {
          dividedTimeList = [[]]
          index = 0
          newState.student.free_time[day].stages = []
          let stages = divideTimeToStage(listTimeByDay);
          for(let i in stages){
            let newStage = {}
            newStage.start_time = stages[i][0]
            newStage.end_time = stages[i][stages[i].length - 1]
            newState.student.free_time[day].stages.push(newStage)
          }
        }
      }

      return newState;
    },
    clearFreeTimeReducer(state) {
      let newState = { ...state };
      for (let day in newState.student.free_time) {
        newState.student.free_time[day].list_time = [];
        newState.student.free_time[day].start_time = -1;
        newState.student.free_time[day].end_time = -1;
      }

      return newState;
    },
    clearFreeTimeByDayReducer(state, action) {
      let newState = { ...state };
      newState.student.free_time[action.payload].list_time = [];

      return newState;
    },
  },
};

export default Model;
