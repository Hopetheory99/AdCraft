# FE-004 Authentication Slice and Service

## Task

Create authentication slice with async actions and build supporting AuthService and Axios client.

## Plan

Implement thunks for login, register, and logout using Redux Toolkit. Add AuthService to manage API calls and apiClient with token refresh logic.

## Action

Added `authSlice` with createAsyncThunk, created `authService.ts`, `apiClient.ts`, and `config.ts`. Updated tests to cover new reducer logic.

## Outcome

Authentication state now supports async actions with persisted tokens. Axios client handles automatic token refresh.
