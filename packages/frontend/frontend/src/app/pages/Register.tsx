import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { register as registerUser } from '../slices/authSlice';

import type { AppDispatch, RootState } from '../store';

function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser({ email, password, name }));
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <p>{error}</p>}
      <label>
        Name
        <input value={name} onChange={e => setName(e.target.value)} aria-label="name" />
      </label>
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
        Register
      </button>
    </form>
  );
}

export default Register;
