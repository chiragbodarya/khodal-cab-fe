import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'admin' | 'manager' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: AuthUser | null;
}

// Load initial state from localStorage if exists
const savedUser = localStorage.getItem('tc_admin_session');
const initialUser = savedUser ? JSON.parse(savedUser) : null;

const initialState: AuthState = {
  isLoggedIn: !!initialUser,
  user: initialUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthUser>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      localStorage.setItem('tc_admin_session', JSON.stringify(action.payload));
    },
    logout: state => {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem('tc_admin_session');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
