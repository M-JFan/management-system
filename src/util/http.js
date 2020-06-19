import axios from 'axios';
import { baseUrl, httpTimeout, appBaseUrl } from '@/config/env';
import Auth from '@/service/auth';

const axiosInst = axios.create({
  baseUrl,
  timeout: httpTimeout,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': appBaseUrl
  }
});

axiosInst.interceptors.request.use(
  config => {
    let token = Auth.getToken() || '';
    if (token !== '') {
      config.headers.authorization = `BearerLandlord ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

/* Axios.interceptors.response.use(
  res => {
    //对响应数据做些事
    if (!res.data.success) {
      alert(res.error_msg);
      return Promise.reject(res);
    }
    return res;
  },
  error => {
    if (error.response.status === 401) {
      // 401 说明 token 验证失败
      // 可以直接跳转到登录页面，重新登录获取 token
      location.href = '/login';
    } else if (error.response.status === 500) {
      // 服务器错误
      // do something
      return Promise.reject(error.response.data);
    }
    // 返回 response 里的错误信息
    return Promise.reject(error.response.data);
  }
);
 */

export default axiosInst;
