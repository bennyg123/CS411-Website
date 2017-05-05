import * as types from './action-types';

//Username, Venues, Status

export const loggedIN = (person) => {
  return {
    type: types.LOGGED_IN,
    username: person.uname,
    venues: person.venues,
    status: person.logged
  };
}
