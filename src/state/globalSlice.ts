import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface GlobalState {
  storageInitiated: boolean,
  userRegistered: boolean,
}

const initialState: GlobalState = {
  storageInitiated: false,
  userRegistered: false,
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setInit: (state) => {
        state.storageInitiated = true;
    },
    setIsRegistered: (state) => {
        state.userRegistered = true;
    },
  },
})

export const { setInit, setIsRegistered } = globalSlice.actions

export default globalSlice.reducer