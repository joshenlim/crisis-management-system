import { combineReducers } from 'redux';
import user from './user';
import runtime from './runtime';
import flash from './flash';

export default combineReducers({
  user,
  runtime,
  flash,
});
