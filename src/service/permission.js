import Vue from 'vue';
import _ from 'lodash';

import router from '@/router';
import store from '@/store';

import { storage } from '@/util/common-util';
import { KEY_USER_TOKEN } from '@/util/constants';

const vueInst = new Vue();

const publicUrls = ['/login', '/register','/forget','/404', '403'];

const isPublicRoute = path => {
  return publicUrls.indexOf(path) >= 0;
};

const isPermitted = (userRoles, routeRoles) => {
  if (routeRoles && routeRoles.length > 0) {
    return routeRoles.some(r => userRoles.indexOf(r) >= 0);
  }
  return true;
};

router.beforeEach((to, from, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('route to: ', to.matched);
  }
  const userToken = storage(KEY_USER_TOKEN);
  if (userToken) {
    if (to.name === 'login') {
      return next({ name: 'home' });
    } else {
      const userRoles = store.getters['admin/roles'];
      if (userRoles.length > 0) {
        if (to.matched.length === 0) {
          return next({ name: 'notFound', replace: true });
        }
        if (isPermitted(userRoles, _.get(to, 'meta.roles'))) {
          return next();
        } else {
          return next({ name: 'forbidden', replace: true });
        }
      } else {
        store
          .dispatch('admin/getAdminInfo')
          .then(() => {
            const roles = store.getters['admin/roles'];
            return store.dispatch('admin/generateRoutes', { roles });
          })
          .then(() => {
            router.addRoutes(store.getters['admin/authorizeRoutes']);
            next({ ...to, replace: true });
          })
          .catch(() => {
            //TODO: 登出
            next({ name: 'login' });
          });
      }
    }
  } else if (isPublicRoute(to.path)) {
    return next();
  } else {
    vueInst.$message('您还没有登录');
    return next({ name: 'login', query: { from: to.fullPath } });
  }
});
