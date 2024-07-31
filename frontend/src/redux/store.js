// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";

const preloadedState = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (token && user) {
    return {
      useruserLoginReducer: {
        token,
        currentUser: JSON.parse(user),
        loginUserStatus: true,
        errorOccurred: false,
        errMsg: '',
        isPending: false
      }
    };
  }
  return undefined;
};

export const store = configureStore({
  reducer: {
    useruserLoginReducer: userReducer
  },
  preloadedState: preloadedState()
});
