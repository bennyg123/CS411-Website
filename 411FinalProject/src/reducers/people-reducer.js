import * as types from '../actions/action-types';

export default (state = [], action) => {
  switch (action.type) {
    case types.LOGGED_IN:
      return {
          uname: action.username,
          venue: action.venues,
          logged: action.status
      };
    default:
      return state;
  }
};
