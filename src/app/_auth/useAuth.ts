"use client";

import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};



// TODO: ログイン周りと、ログインのローディングに関してゴリ押し実装してしまったので理解する。
