import { storage } from '@/util/common-util';
import { KEY_USER_TOKEN } from '@/util/constants';

const TOKEN_TTL = 86400000;

const Auth = {
  saveToken(token) {
    storage(KEY_USER_TOKEN, token, TOKEN_TTL);
  },
  clearToken() {
    storage(KEY_USER_TOKEN, null);
  },
  getToken() {
    return storage(KEY_USER_TOKEN);
  }
};

export default Auth;
