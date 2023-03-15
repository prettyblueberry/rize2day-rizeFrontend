import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export interface NotifyState {
  notify_list?: any;
}

const initialState: NotifyState = {
  notify_list: [],
};

export const Notify = createSlice({
  name: "notify",
  initialState,
  reducers: {
    changeNotifyList: (
      state,
      action: PayloadAction<NotifyState["notify_list"]>
    ) => {
      console.log("[changeNotifyList action ] action  = ", action);
      return {
        ...state,
        notify_list: action.payload,
      };
    },
  },
});

export const { changeNotifyList } = Notify.actions;

export const selectNotifyList = (state: RootState) => state.notify.notify_list;

export default Notify.reducer;
