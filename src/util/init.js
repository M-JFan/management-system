import Vue from 'vue';
import axios from 'axios';
import $ from 'jquery'
import { baseUrl, appBaseUrl } from '@/config/env';
import {
  Upload,
  Table,
  TableColumn,
  Button,
  Row,
  Col,
  Pagination,
  Loading,
  Notification,
  MessageBox,
  Tooltip,
  Message,
  Dialog,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Tag,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Form,
  FormItem,
  Input,
  InputNumber,
  Select,
  Option,
  OptionGroup,
  Checkbox,
  CheckboxGroup,
  Switch,
  Radio,
  RadioGroup,
  RadioButton,
  DatePicker
} from 'element-ui';
Vue.use(Upload);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(Pagination);
Vue.use(Tooltip);
Vue.use(Loading.directive);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Dialog);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Tag);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(DatePicker);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$notify = Notification;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;
Vue.prototype.$http = axios;

axios.defaults.baseURL = baseUrl;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = appBaseUrl;

const promiseFinally = require('promise.prototype.finally');
promiseFinally.shim();