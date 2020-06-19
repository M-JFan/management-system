import axios from 'axios';
import router from '../router';
import { Loading, Message } from "element-ui";

export const oXHRHeadrs = {
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
};

let loading;
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: "Loading...",
    target: document.querySelector('.tableContent')//设置加载动画区域
  });
}
function endLoading() {
  loading.close();
}

let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

/* 请求拦截器 */
axios.interceptors.request.use(
  config => {
    let token = localStorage.getItem('user_token');
    if (token) {
      config.headers['Authorization'] = "Bearer" + ` ${token}`;
    } else {
      window.location.pathname = '/'
    }
    showFullScreenLoading()
    return config;
  },
  err => {
    tryHideFullScreenLoading();
    Message.error({ message: '请求超时' });
    return Promise.reject(err);
  }
);
// 响应拦截器
axios.interceptors.response.use((response) => {
  tryHideFullScreenLoading()
  return response
}, (err) => {
  tryHideFullScreenLoading();
  if (err.response.status == 401) {
    Message.error({ message: '登录超时' });
    router.replace({
      path: '/'
    })
  } else {
    Message.error({ message: err.response.data.message });
  }

  return Promise.reject(err);
})
/**
 * fetch Get请求
 * @param {String} url 请求地址
 * @param {Obejct} params
 * @return {Promise}
 */
export function FetchGet(url, params = {}, headers) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        url, {
        params: params
      },
        headers
      )
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
}
/**
 * fetch Post请求
 * @param {String} url 请求地址
 * @param {Obejct} data
 * @return {Promise}
 */
export function FetchPost(url, data = { data: data }, headers, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, headers, params)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
}
/**
 * fetch Put请求
 * @param {String} url 请求地址
 * @param {Obejct} data
 * @return {Promise}
 */
export function FetchPut(url, data = { data: data }, headers, params) {
  return new Promise((resolve, reject) => {
    axios
      .put(url, data, headers, params)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/*  登录 */
export const LoginApi = params => {
  return FetchPost('/api/auth/login', params, oXHRHeadrs).then((response) => {
    return response;
  })
}
/*  登出 */
export const LogoutApi = params => {
  return FetchPost('/api/auth/logout', params, oXHRHeadrs).then((response) => {
    return response;
  })
}
/* 修改密码 */
export const ChangePasswordApi = params => {
  return FetchPost('/api/sys-admin/change-password', params, oXHRHeadrs).then((response) => {
    return response;
  })
}
/*  获取当前用户信息 */
export const GetUserInfoApi = params => {
  return FetchGet('/api/admin/me', params, oXHRHeadrs).then((response) => {
    return response;
  })
}
/*  获取供应商列表 */
export const SupplierListApi = params => {
  return FetchGet('/api/supplier', params, oXHRHeadrs).then((response) => {
    return response;
  })
}
/*  新增供应商 */
export const AddSupplierApi = params => {
  return FetchPost('/api/supplier', params, oXHRHeadrs).then((response) => {
    return response;
  })
}
/* 获取管理员列表 */
export const AdminListApi = params => {
  return FetchGet('/api/sys-admin', params, oXHRHeadrs).then((response) => {
    return response;
  })
}
/*  新增管理员 */
export const AddSysAdminApi = params => {
  return FetchPost('/api/sys-admin', params, oXHRHeadrs).then((response) => {
    return response;
  })
}
/* 获取合同列表 */
export const ContractListApi = params => {
  return FetchGet('/api/supplier-contract', params, oXHRHeadrs).then((response) => {
    return response;
  })
}
/* 新增合同 */
export const AddContractApi = params => {
  return FetchPost('/api/supplier-contract', params, oXHRHeadrs).then((response) => {
    return response;
  })
}
/* 获取供应商人员列表 */
export const SupplierOperatorListApi = params => {
  return FetchGet('/api/supplier-operator', params, oXHRHeadrs).then((response) => {
    return response;
  })
}
/* 新增合同 */
export const AddSupplierOperatorApi = params => {
  return FetchPost('/api/supplier-operator', params, oXHRHeadrs).then((response) => {
    return response;
  })
}
/* 获取任务单列表 */
export const WorkOderListApi = params => {
  return FetchGet('/api/work-order', params, oXHRHeadrs).then((response) => {
    return response;
  })
}
/* 新增任务单 */
export const AddWorkOderApi = params => {
  return FetchPost('/api/work-order', params, oXHRHeadrs).then((response) => {
    return response;
  })
}