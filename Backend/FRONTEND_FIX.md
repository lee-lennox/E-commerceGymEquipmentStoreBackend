# Fix for 403 Forbidden Error

## The Issue
The API requires JWT authentication for creating products. You need to send the JWT token in the Authorization header.

## Solution

### 1. Update your `api.js` file to include the JWT token:

```javascript
// In your api.js file, update the createProduct function:

export const createProduct = async (formData) => {
  // Get the token from localStorage (or wherever you store it)
  const token = localStorage.getItem('token'); // or sessionStorage.getItem('token')
  
  const response = await axios.post(`${API_URL}/products`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}` // Add this line
    }
  });
  return response.data;
};
```

### 2. Ensure you're logged in as ADMIN

Make sure you log in with the admin account first:
- Email: `admin@gymstore.com`
- Password: `admin123`

After login, the token should be stored in localStorage/sessionStorage.

### 3. Alternative: Create an axios interceptor (Recommended)

Add this to your `api.js` file to automatically attach the token to all requests:

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Now use 'api' instead of 'axios' for all requests
export const createProduct = async (formData) => {
  const response = await api.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

// ... other API calls
```

### 4. Check your login response

Make sure your login API stores the token:

```javascript
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/users/login`, credentials);
  
  // Store the token
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};
```

### 5. Verify the token in browser console

Before creating a product, check if the token exists:

```javascript
console.log('Token:', localStorage.getItem('token'));
```

## Testing

1. Login as admin: `admin@gymstore.com` / `admin123`
2. Check browser console for token
3. Try creating a product again

The 403 error should be resolved once the Authorization header with valid JWT token is included in the request.
