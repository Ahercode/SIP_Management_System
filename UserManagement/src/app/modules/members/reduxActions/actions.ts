import { Member } from "../_model";

export const ADD_MEMBER = 'ADD_MEMBER';
export const UPDATE_MEMBER = 'UPDATE_MEMBER';
export const DELETE_MEMBER = 'DELETE_MEMBER';

export const addMEMBER = (member: Member) => ({
  type: ADD_MEMBER,
  payload: member,
});

export const updateMEMBER = (member: Member) => ({
  type: UPDATE_MEMBER,
  payload: member,
});

export const deleteMEMBER = (memberId: Member) => ({
  type: DELETE_MEMBER,
  payload: memberId,
});