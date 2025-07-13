import { useContext } from 'react';
import { useAuthContext } from './AuthContext';

export const useAuth = () => {
  return useAuthContext();
};
