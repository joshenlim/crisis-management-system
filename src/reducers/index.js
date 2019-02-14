import { combineReducers } from 'redux';
import user from './user';
import runtime from './runtime';
import header from './header';

export default combineReducers({
  user,
  runtime,
  header,
});
