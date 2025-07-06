import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { login } from '../slices/authSlice';

import type { AppDispatch, RootState } from '../store';

function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <p>{error}</p>}
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          aria-label="email"
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          aria-label="password"
        />
      </label>
      <button type="submit" disabled={loading}>
        Login
      </button>
    </form>
  );
}

export default Login;
