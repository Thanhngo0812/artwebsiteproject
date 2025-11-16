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
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      })
      // .catch(error=>{return error});

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
    if (user && user.token) {
      return { Authorization: 'Bearer ' + user };
    } else {
      return {};
    }
  }

  // SỬA LỖI Ở ĐÂY: Dùng arrow function để `this` luôn đúng
  isLoggedIn = () => {
    return (!!this.getCurrentUser&&!this.isTokenExpired());
  }

  // SỬA LỖI Ở ĐÂY: Dùng arrow function
  getUserRole() {
    const user = this.getCurrentUser(); // getCurrentUser lấy từ localStorage
    if (user) {
      try {
        const decodedToken = jwtDecode(user);
        // Backend Spring Security thường trả về roles trong một mảng
        return decodedToken.roles[0] || null;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  isTokenExpired() {
    const user = this.getCurrentUser();
    if (!user ) {
      return true; // Coi như hết hạn nếu không có token
    }

    try {
      const decodedToken = jwtDecode(user);
   
      // Lấy thời gian hết hạn (exp) từ token (đơn vị là giây)
      const expirationTime = decodedToken.exp; 
     
      // Lấy thời gian hiện tại (đơn vị là giây)
      const currentTime = Date.now() / 1000;
     
      // So sánh: nếu thời gian hết hạn nhỏ hơn thời gian hiện tại, token đã hết hạn
      return expirationTime < currentTime;

    } catch (error) {
      // Token không hợp lệ cũng coi như đã hết hạn
      return true;
    }
  }

}

export default new AuthService();