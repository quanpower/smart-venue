import BasicLayout from './layouts/BasicLayout';
import UserLayout from './layouts/UserLayout';

import Test1 from './routes/Test/Test1';

import Login from './routes/User/Login';
import Register from './routes/User/Register';
import RegisterResult from './routes/User/RegisterResult';

import Users from './routes/Users/Users';
import Roles from './routes/Role/Roles';
import Menus from './routes/Menu/Menus';

const data = [{
  component: BasicLayout,
  layout: 'BasicLayout',
  name: '首页', // for breadcrumb
  path: '',
  children: [{
    name: '测试',             // 页面名称，会展示在菜单栏中
    icon: 'table',              // 页面图标，会展示在菜单栏中
    path: 'test',           // 匹配的路由
    children: [{
      name: '测试一',             // 页面名称，会展示在菜单栏中
      path: 'test1', 
      component: Test1, 
    }]             
  },{
    name: '系统管理',             // 页面名称，会展示在菜单栏中
    icon: 'table',              // 页面图标，会展示在菜单栏中
    path: 'system',           // 匹配的路由
    children: [{
      name: '用户管理',             // 页面名称，会展示在菜单栏中
      path: 'users', 
      component: Users, 
    }, {
      name: '角色管理',             // 页面名称，会展示在菜单栏中
      path: 'roles', 
      component: Roles, 
    },  {
      name: '菜单管理',             // 页面名称，会展示在菜单栏中
      path: 'menus', 
      component: Menus, 
    }, 
    // {
    //   name: '场地管理',
    //   path: 'test',
    //   component: Test1, 
    // }
  ]             
  }]
}, 
{
  component: UserLayout,
  layout: 'UserLayout',
  name: '登录',
  children: [{
    name: '帐户',
    icon: 'user',
    path: 'user',
    children: [{
      name: '登录',
      path: 'login',
      component: Login,
    }, {
      name: '注册',
      path: 'register',
      component: Register,
    }, {
      name: '注册结果',
      path: 'register-result',
      component: RegisterResult,
    }],
  }],
}
];

export function getNavData() {
  return data;
}

export default data;
