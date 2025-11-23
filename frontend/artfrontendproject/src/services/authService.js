import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8888/api/v1/auth/';

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + 'login', {
        username,
        password
      })
      .then(response => {
        if (response.data.token) {
          // Store just the token string to be consistent with VerifyOTP
          localStorage.setItem('user', response.data.token);
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(username, password) {
    return axios.post(API_URL + 'register', {
      username,
      password
    });
  }

  getCurrentUser() {
    return localStorage.getItem('user');
  }

  getAuthHeader() {
    const user = this.getCurrentUser();
    if (user) {
      return { Authorization: 'Bearer ' + user };
    } else {
      return {};
    }
  }

  isLoggedIn = () => {
    return (!!this.getCurrentUser() && !this.isTokenExpired());
  }

  getUserRole() {
    const user = this.getCurrentUser();
    if (user) {
      try {
        const decodedToken = jwtDecode(user);
        // Return the full array of roles
        return decodedToken.roles || [];
      } catch (error) {
        return [];
      }
    }
    return [];
  }

  isTokenExpired() {
    const user = this.getCurrentUser();
    if (!user) {
      return true;
    }

    try {
      const decodedToken = jwtDecode(user);
      const expirationTime = decodedToken.exp;
      const currentTime = Date.now() / 1000;
      return expirationTime < currentTime;
    } catch (error) {
      return true;
    }
  }
}

export default new AuthService();