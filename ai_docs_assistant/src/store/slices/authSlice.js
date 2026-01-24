// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Token management utilities
const tokenManager = {
  getToken: () => {
    try {
      return localStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting token from localStorage:', error);
      return null;
    }
  },
  
  setToken: (token) => {
    try {
      localStorage.setItem('auth_token', token);
      // Also store token expiry time (assuming token has exp field)
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.exp) {
            localStorage.setItem('token_expiry', payload.exp * 1000);
          }
        } catch (e) {
          // Token parsing failed, continue anyway
          console.warn('Could not parse token expiry:', e);
        }
      }
    } catch (error) {
      console.error('Error setting token in localStorage:', error);
    }
  },
  
  removeToken: () => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token_expiry');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    } catch (error) {
      console.error('Error removing tokens from localStorage:', error);
    }
  },
  
  getRefreshToken: () => {
    try {
      return localStorage.getItem('refresh_token');
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },
  
  setRefreshToken: (token) => {
    try {
      localStorage.setItem('refresh_token', token);
    } catch (error) {
      console.error('Error setting refresh token:', error);
    }
  },
  
  getUserData: () => {
    try {
      const data = localStorage.getItem('user_data');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },
  
  setUserData: (data) => {
    try {
      localStorage.setItem('user_data', JSON.stringify(data));
    } catch (error) {
      console.error('Error setting user data:', error);
    }
  },
  
  clearAll: () => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token_expiry');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('auth_timeout');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },
  
  isTokenValid: () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return false;
      
      const expiry = localStorage.getItem('token_expiry');
      if (!expiry) return true; // If no expiry stored, assume valid
      
      return Date.now() < parseInt(expiry);
    } catch (error) {
      console.error('Error checking token validity:', error);
      return false;
    }
  },
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // Simulate API call to your FastAPI backend
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Login failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Validate response structure
      if (!data.user || !data.token) {
        throw new Error('Invalid response from server');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue({
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Registration failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Validate response
      if (!data.user || !data.token) {
        throw new Error('Invalid response from server');
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return rejectWithValue({
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// Async thunk for token refresh
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('http://localhost:8000/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
      });

      if (!response.ok) {
        // If refresh fails, clear tokens and throw error
        tokenManager.clearAll();
        throw new Error('Token refresh failed. Please login again.');
      }

      const data = await response.json();
      
      if (!data.token) {
        throw new Error('Invalid refresh response');
      }
      
      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      return rejectWithValue({
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// Async thunk for logout (to handle server-side logout)
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      
      if (token) {
        // Call logout endpoint to invalidate token server-side
        await fetch('http://localhost:8000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Requested-With': 'XMLHttpRequest'
          },
        }).catch(() => {
          // Ignore errors on logout - we still want to clear local state
          console.log('Server logout failed, clearing local state anyway');
        });
      }
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return rejectWithValue({
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// Async thunk for password reset request
export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/password-reset/request', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Password reset request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Password reset request error:', error);
      return rejectWithValue({
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// Async thunk for verifying reset token
export const verifyResetToken = createAsyncThunk(
  'auth/verifyResetToken',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/password-reset/verify', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Password reset verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Password reset verification error:', error);
      return rejectWithValue({
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// Initialize state from localStorage
const loadInitialState = () => {
  const token = tokenManager.getToken();
  const userData = tokenManager.getUserData();
  const refreshToken = tokenManager.getRefreshToken();
  
  return {
    user: userData,
    isAuthenticated: !!token && tokenManager.isTokenValid(),
    token: token,
    refreshToken: refreshToken,
    loading: false,
    error: null,
    lastActivity: Date.now(),
    sessionTimeout: 30 * 60 * 1000, // 30 minutes in milliseconds
    authTimeout: null,
    loginAttempts: 0,
    lastLoginAttempt: null,
    twoFactorEnabled: false,
    twoFactorVerified: false,
    permissions: userData?.permissions || [],
    roles: userData?.roles || [],
    loginHistory: [],
    isRefreshingToken: false,
    registration: {
      loading: false,
      error: null,
      success: false,
    },
    passwordReset: {
      loading: false,
      error: null,
      success: false,
      emailSent: false,
    },
  };
};

const initialState = loadInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear authentication state
    logout: (state) => {
      // Clear any existing timeout
      if (state.authTimeout) {
        clearTimeout(state.authTimeout);
        state.authTimeout = null;
      }
      
      // Clear tokens from storage
      tokenManager.clearAll();
      
      // Reset state
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
      state.twoFactorVerified = false;
      state.lastActivity = Date.now();
      
      // Record logout in history
      state.loginHistory.push({
        type: 'logout',
        timestamp: new Date().toISOString(),
      });
    },
    
    // Clear error messages
    clearError: (state) => {
      state.error = null;
      state.registration.error = null;
      state.passwordReset.error = null;
    },
    
    // Update last activity timestamp
    updateActivity: (state) => {
      state.lastActivity = Date.now();
      
      // Reset session timeout
      if (state.authTimeout) {
        clearTimeout(state.authTimeout);
      }
      
      // Set new timeout
      state.authTimeout = setTimeout(() => {
        // This would be handled by middleware
      }, state.sessionTimeout);
    },
    
    // Set session timeout duration
    setSessionTimeout: (state, action) => {
      state.sessionTimeout = action.payload;
    },
    
    // Enable/disable two-factor authentication
    setTwoFactorEnabled: (state, action) => {
      state.twoFactorEnabled = action.payload;
    },
    
    // Verify two-factor code
    verifyTwoFactor: (state, action) => {
      state.twoFactorVerified = action.payload;
    },
    
    // Update user profile
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      tokenManager.setUserData(state.user);
    },
    
    // Update user permissions
    updatePermissions: (state, action) => {
      state.permissions = action.payload;
    },
    
    // Reset password reset state
    resetPasswordResetState: (state) => {
      state.passwordReset = {
        loading: false,
        error: null,
        success: false,
        emailSent: false,
      };
    },
    
    // Reset registration state
    resetRegistrationState: (state) => {
      state.registration = {
        loading: false,
        error: null,
        success: false,
      };
    },
    
    // Force token refresh (for manual refresh)
    forceTokenRefresh: (state) => {
      state.isRefreshingToken = true;
    },
    
    // Clear login attempts
    clearLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
    },
    
    // Record login attempt
    recordLoginAttempt: (state) => {
      state.loginAttempts += 1;
      state.lastLoginAttempt = Date.now();
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.loginAttempts += 1;
        state.lastLoginAttempt = Date.now();
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.twoFactorVerified = action.payload.twoFactorVerified || false;
        state.loginAttempts = 0;
        state.lastActivity = Date.now();
        state.permissions = action.payload.user.permissions || [];
        state.roles = action.payload.user.roles || [];
        
        // Store tokens and user data
        tokenManager.setToken(action.payload.token);
        if (action.payload.refreshToken) {
          tokenManager.setRefreshToken(action.payload.refreshToken);
        }
        tokenManager.setUserData(action.payload.user);
        
        // Record successful login
        state.loginHistory.push({
          type: 'login',
          timestamp: new Date().toISOString(),
          success: true,
        });
        
        // Set session timeout
        if (state.authTimeout) {
          clearTimeout(state.authTimeout);
        }
        
        // Set up auto-logout after session timeout
        state.authTimeout = setTimeout(() => {
          // This would be handled by middleware to dispatch logout
        }, state.sessionTimeout);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
        // Record failed login attempt
        state.loginHistory.push({
          type: 'login',
          timestamp: new Date().toISOString(),
          success: false,
          error: action.payload?.message,
        });
      });
    
    // Registration
    builder
      .addCase(registerUser.pending, (state) => {
        state.registration.loading = true;
        state.registration.error = null;
        state.registration.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registration.loading = false;
        state.registration.success = true;
        
        // Auto-login after registration if configured
        if (action.payload.autoLogin) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.lastActivity = Date.now();
          
          tokenManager.setToken(action.payload.token);
          tokenManager.setUserData(action.payload.user);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registration.loading = false;
        state.registration.error = action.payload;
      });
    
    // Token Refresh
    builder
      .addCase(refreshToken.pending, (state) => {
        state.isRefreshingToken = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isRefreshingToken = false;
        state.token = action.payload.token;
        state.lastActivity = Date.now();
        
        // Update stored token
        tokenManager.setToken(action.payload.token);
        
        // Record refresh in history
        state.loginHistory.push({
          type: 'token_refresh',
          timestamp: new Date().toISOString(),
          success: true,
        });
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isRefreshingToken = false;
        state.error = action.payload;
        
        // Clear tokens on refresh failure
        tokenManager.clearAll();
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
        
        // Record failed refresh
        state.loginHistory.push({
          type: 'token_refresh',
          timestamp: new Date().toISOString(),
          success: false,
          error: action.payload?.message,
        });
      });
    
    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        // Clear timeout
        if (state.authTimeout) {
          clearTimeout(state.authTimeout);
          state.authTimeout = null;
        }
        
        // Clear tokens
        tokenManager.clearAll();
        
        // Reset state
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
        state.twoFactorVerified = false;
        state.lastActivity = Date.now();
        
        // Record logout
        state.loginHistory.push({
          type: 'logout',
          timestamp: new Date().toISOString(),
          success: true,
        });
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
        // Still clear local state even if server logout failed
        tokenManager.clearAll();
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
      });
    
    // Password Reset Request
    builder
      .addCase(requestPasswordReset.pending, (state) => {
        state.passwordReset.loading = true;
        state.passwordReset.error = null;
        state.passwordReset.emailSent = false;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.passwordReset.loading = false;
        state.passwordReset.emailSent = true;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.passwordReset.loading = false;
        state.passwordReset.error = action.payload;
      });
    
    // Password Reset Verification
    builder
      .addCase(verifyResetToken.pending, (state) => {
        state.passwordReset.loading = true;
        state.passwordReset.error = null;
        state.passwordReset.success = false;
      })
      .addCase(verifyResetToken.fulfilled, (state) => {
        state.passwordReset.loading = false;
        state.passwordReset.success = true;
      })
      .addCase(verifyResetToken.rejected, (state, action) => {
        state.passwordReset.loading = false;
        state.passwordReset.error = action.payload;
      });
  },
});

// Export actions
export const {
  logout,
  clearError,
  updateActivity,
  setSessionTimeout,
  setTwoFactorEnabled,
  verifyTwoFactor,
  updateProfile,
  updatePermissions,
  resetPasswordResetState,
  resetRegistrationState,
  forceTokenRefresh,
  clearLoginAttempts,
  recordLoginAttempt,
} = authSlice.actions;

// Export selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectPermissions = (state) => state.auth.permissions;
export const selectRoles = (state) => state.auth.roles;
export const selectSessionTimeout = (state) => state.auth.sessionTimeout;
export const selectLoginAttempts = (state) => state.auth.loginAttempts;
export const selectIsRefreshingToken = (state) => state.auth.isRefreshingToken;

// Helper function to check specific permission
export const hasPermission = (state, permission) => {
  const permissions = selectPermissions(state);
  return permissions.includes(permission) || permissions.includes('*');
};

// Helper function to check if user has any of the given permissions
export const hasAnyPermission = (state, requiredPermissions) => {
  const userPermissions = selectPermissions(state);
  return requiredPermissions.some(permission => 
    userPermissions.includes(permission) || userPermissions.includes('*')
  );
};

// Helper function to check if user has all of the given permissions
export const hasAllPermissions = (state, requiredPermissions) => {
  const userPermissions = selectPermissions(state);
  return requiredPermissions.every(permission => 
    userPermissions.includes(permission) || userPermissions.includes('*')
  );
};

export default authSlice.reducer;

// Middleware for auto-logout and token refresh
export const authMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState().auth;
  
  // Check for session timeout on user activity
  if (action.type === 'auth/updateActivity') {
    // Reset the session timeout
    if (state.authTimeout) {
      clearTimeout(state.authTimeout);
    }
    
    // Set new timeout
    store.dispatch({
      type: 'auth/setAuthTimeout',
      payload: setTimeout(() => {
        store.dispatch(logout());
      }, state.sessionTimeout),
    });
  }
  
  // Auto-refresh token before expiry
  if (state.isAuthenticated && state.token) {
    try {
      const payload = JSON.parse(atob(state.token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      const currentTime = Date.now();
      const refreshThreshold = 5 * 60 * 1000; // 5 minutes before expiry
      
      if (expiryTime - currentTime < refreshThreshold && !state.isRefreshingToken) {
        // Refresh token if it's about to expire
        store.dispatch(refreshToken());
      }
    } catch (error) {
      console.warn('Could not parse token for auto-refresh:', error);
    }
  }
  
  return result;
};