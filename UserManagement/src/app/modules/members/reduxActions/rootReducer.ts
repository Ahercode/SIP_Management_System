import { combineReducers } from 'redux';
import memberReducer from './reducer';

const rootReducer = combineReducers({
  members: memberReducer,
});

export default rootReducer;