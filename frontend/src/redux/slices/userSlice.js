// slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// slices/userSlice.js
export const userLoginThunk = createAsyncThunk("user-login", async (userCredObj, thunkApi) => {
  try {
    const res = await axios.post("http://localhost:4000/login", userCredObj);
    if (res.data.message === "Login Success") {
      // Store token and user in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data;
    } else {
      return thunkApi.rejectWithValue(res.data.message);
    }
  } catch (err) {
    return thunkApi.rejectWithValue(err);
  }
});

// Action to update user image
export const updateUserImage = createAsyncThunk("update-user-image", async (imageUrl, thunkApi) => {
    try {
      // Get current user from the state
      const { currentUser } = thunkApi.getState().user;
  
      // Assuming you have an endpoint to update the user image
      const res = await axios.patch(`http://localhost:4000/updateimage/${currentUser.username}`, { imageUrl });
  
      if (res.data.message === "Image Updated") {
        return { imageUrl };
      } else {
        return thunkApi.rejectWithValue(res.data.message);
      }
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  });

export const userSlice = createSlice({
  name: "user-login",
  initialState: {
    isPending: false,
    loginUserStatus: false,
    currentUser: {},
    errorOccurred: false,
    errMsg: ''
  },
  reducers: {
    resetState: (state, action) => {
      state.isPending = false;
      state.currentUser = {};
      state.loginUserStatus = false;
      state.errorOccurred = false;
      state.errMsg = '';
    }
  },
  extraReducers: builder => builder
    .addCase(userLoginThunk.pending, (state, action) => {
      state.isPending = true;
    })
    .addCase(userLoginThunk.fulfilled, (state, action) => {
      state.isPending = false;
      state.currentUser = action.payload.user;
      state.loginUserStatus = true;
      state.errMsg = '';
      state.errorOccurred = false;
    })
    .addCase(userLoginThunk.rejected, (state, action) => {
      state.isPending = false;
      state.currentUser = {};
      state.loginUserStatus = false;
      state.errMsg = action.payload;
      state.errorOccurred = true;
    })
});

export const { resetState } = userSlice.actions;
export default userSlice.reducer;
