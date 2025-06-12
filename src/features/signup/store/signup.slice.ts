// signup/store/signup.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SignupState } from '../types/signup.types';

interface DefaultSignupState {

}

const initialState: DefaultSignupState = {

};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {

  },
});

export const { } = signupSlice.actions;
export default signupSlice.reducer;
