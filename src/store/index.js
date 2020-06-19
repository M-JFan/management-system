import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    token:localStorage.getItem('user_token'),
    supplierList:[],
    contractList:[]
  },
  getters:{
    getToken:state=>{
      return state.token
    },
    getSupplierList:state=>{
      return state.supplierList
    },
    getContractList:state=>{
      return state.contractList
    }
  },
  mutations:{
    setToken:(state,token)=>{
      state.token = token
      localStorage.setItem('user_token', token)
    },
    delTokent:(state)=>{
      state.token = ''
      localStorage.removeItem('user_token')
    },
    setSupplierList:(state,list)=>{
      state.supplierList = list
    },
    setContractList:(state,list)=>{
      state.contractList = list
    }
  }
})