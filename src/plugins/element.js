import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  MenuItem,
  Submenu,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Carousel,
  CarouselItem,
  // Calendar,
  Timeline,
  TimelineItem,
  Tag,
  Tree,
  Select,
  Option
} from 'element-ui' // 按需导入组件
Vue.prototype.$message = Message // 使用prototype挂载Message组件
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(Tooltip)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Carousel)
Vue.use(CarouselItem)
// Vue.use(Calendar)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
