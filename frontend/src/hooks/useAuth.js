import { useEffect } from 'react';
import { useAppDispatch, useAuth } from '../redux/hooks.js';
import { loadUserFromStorage, loginSuccess, logout } from '../redux/slices/authSlice.js';
import { authService } from '../services/authService.js';

export const useAuthHook = () => {
  const dispatch = useAppDispatch();
  const auth = useAuth();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      dispatch(loginSuccess(data));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await authService.register(name, email, password);
      dispatch(loginSuccess(data));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    ...auth,
    login,
    register,
    logoutUser,
  };
};