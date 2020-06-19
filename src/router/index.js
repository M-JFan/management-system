import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: require('@/views/Login').default,
      meta: {
        title: '上海烟草集团天津卷烟厂场内管理系统'
      }
    },
    {
      path: '/home',
      name: 'Home',
      redirect:'/main',
      component: require('@/views/Home').default,
      children:[
        /* 首页 */
        {
          path: '/main',
          name: 'main',
          component: require('@/components/Main').default,
          meta: {
            title: '首页'
          }
        },
        /* 管理员信息 */
        {
          path: '/adminInfo',
          name: 'adminInfo',
          component: require('@/components/baseInfo/adminInfo').default,
          meta: {
            title: '管理员信息'
          }
        },
        /* 供应商信息 */
        {
          path: '/supplierInfo',
          name: 'supplierInfo',
          component: require('@/components/baseInfo/supplierInfo').default,
          meta: {
            title: '供应商信息'
          }
        },
        /* 供应商人员管理信息 */
        {
          path: '/supplier-personnel',
          name: 'supplierPersonnel',
          component: require('@/components/baseInfo/supplierPersonnel').default,
          meta: {
            title: '供应商人员管理信息'
          }
        },
        /* 任务单 */
        {
          path: '/work-order',
          name: 'workOrder',
          component: require('@/components/operation/workOrder').default,
          meta: {
            title: '任务单'
          }
        },
        /* 新增任务单 */
        {
          path: '/add-work-order',
          name: 'addWorkOrder',
          component: require('@/components/operation/add-work-order').default,
          meta: {
            title: '新增任务单'
          }
        },
        /* 编辑任务单 */
        {
          path: '/edit-work-order',
          name: 'editWorkOrder',
          component: require('@/components/operation/edit-work-order').default,
          meta: {
            title: '编辑任务单'
          }
        },
        /* 合同管理 */
        {
          path: '/contract-management',
          name: 'contractManagement',
          component: require('@/components/operation/contract-management').default,
          meta: {
            title: '合同管理'
          }
        },
        /* 新增合同 */
        {
          path: '/add-contract',
          name: 'addContract',
          component: require('@/components/operation/add-contract').default,
          meta: {
            title: '新增合同'
          }
        },
        /* 编辑合同 */
        {
          path: '/edit-contract',
          name: 'editContract',
          component: require('@/components/operation/edit-contract').default,
          meta: {
            title: '编辑合同'
          }
        },
      ]
    }
  ]
})
