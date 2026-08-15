import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'admin' | 'manager' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface LoginPayload {
  user: AuthUser;
  token?: string;
  refreshToken?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: AuthUser | null;
  token: string | null;
}

// Load initial state from localStorage if exists
const savedUser = localStorage.getItem('tc_admin_session');
const savedToken = localStorage.getItem('tc_admin_token');
let initialUser: AuthUser | null = null;
try {
  initialUser = savedUser ? JSON.parse(savedUser) : null;
} catch {
  initialUser = null;
}

const initialState: AuthState = {
  isLoggedIn: !!initialUser,
  user: initialUser,
  token: savedToken || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthUser | LoginPayload>) => {
      state.isLoggedIn = true;
      if ('user' in action.payload) {
        state.user = action.payload.user;
        state.token = action.payload.token || null;
        localStorage.setItem('tc_admin_session', JSON.stringify(action.payload.user));
        if (action.payload.token) {
          localStorage.setItem('tc_admin_token', action.payload.token);
        }
        if (action.payload.refreshToken) {
          localStorage.setItem('tc_admin_refresh_token', action.payload.refreshToken);
        }
      } else {
        state.user = action.payload;
        localStorage.setItem('tc_admin_session', JSON.stringify(action.payload));
      }
    },
    logout: state => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('tc_admin_session');
      localStorage.removeItem('tc_admin_token');
      localStorage.removeItem('tc_admin_refresh_token');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
