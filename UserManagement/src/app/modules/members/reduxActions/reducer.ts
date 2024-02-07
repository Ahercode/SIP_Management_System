import { Member } from "../_model";
import { ADD_MEMBER, DELETE_MEMBER, UPDATE_MEMBER } from "./actions";


const initialState: Member[] = [];

const memberReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_MEMBER:
      return [...state, action.payload];
    case UPDATE_MEMBER:
      return state.map(member => (member.Id === action.payload.Id ? action.payload : member));
    case DELETE_MEMBER:
      return state.filter(member => member.Id !== action.payload);
    default:
      return state;
  }
};

export default memberReducer;