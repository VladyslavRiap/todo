import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import instance from "../../api/axios";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

export const loginApi = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: LoginPayload, thunkAPI) => {
    try {
      const response = await instance.post("/auth/login", { email, password });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      return { token, user };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const registerApi = createAsyncThunk(
  "auth/registerApi",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await instance.post("/auth/register", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const checkToken = createAsyncThunk(
  "auth/checkToken",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await instance.get("/auth/verify");
      return response.data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Invalid token"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      console.log("Logout action triggered");
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginApi.fulfilled, (state, { payload }) => {
        console.log("Login successful, token saved:", payload.token);
        state.loading = false;
        state.token = payload.token;
        state.user = payload.user;
      })
      .addCase(loginApi.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      // Register
      .addCase(registerApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerApi.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerApi.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      // Check token
      .addCase(checkToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkToken.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
      })
      .addCase(checkToken.rejected, (state, { payload }) => {
        console.error("checkToken failed:", payload); // Лог ошибки
        state.loading = false;
        state.token = null;
        state.user = null;
        state.error = payload as string;
        localStorage.removeItem("token");
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
