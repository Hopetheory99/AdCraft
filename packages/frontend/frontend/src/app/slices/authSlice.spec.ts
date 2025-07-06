import reducer, { login, clearError, User, Tokens } from './authSlice';

describe('authSlice reducer', () => {
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      tokens: null,
      loading: false,
      error: null,
    });
  });

  it('should handle login lifecycle', () => {
    let state = reducer(undefined, login.pending('', { email: 'a', password: 'b' }));
    expect(state.loading).toBe(true);
    const payload = {
      user: {
        id: '1',
        email: 'a',
        name: 'A',
        role: 'admin',
        teams: [],
        preferences: { theme: 'light', notifications: true },
        createdAt: new Date(),
      } as User,
      tokens: { accessToken: 'x', refreshToken: 'y' } as Tokens,
    };
    state = reducer(state, login.fulfilled(payload, '', { email: 'a', password: 'b' }));
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(payload.user);
    expect(state.tokens).toEqual(payload.tokens);
  });

  it('should clear error', () => {
    let state = reducer(undefined, login.rejected(new Error(), '', { email: 'a', password: 'b' }));
    expect(state.error).toBe('Login failed');
    state = reducer(state, clearError());
    expect(state.error).toBeNull();
  });
});
