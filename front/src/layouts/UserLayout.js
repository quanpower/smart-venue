import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from 'ant-design-pro/lib/GlobalFooter';
import styles from './UserLayout.less';
import { getRouteData } from '../utils/utils';

import Login from '../routes/User/Login';
import Register from '../routes/User/Register';
import RegisterResult from '../routes/User/RegisterResult';

const items = [{
  name: '登录',
  path: '/user/login',
  component: Login,
  exact: true,
}, {
  name: '注册',
  path: '/user/register',
  component: Register,
  exact: true,
}, {
  name: '注册结果',
  path: '/user/register-result',
  component: RegisterResult,
  exact: true,
}];

const links = [{
  title: '帮助',
  href: '',
}, {
  title: '隐私',
  href: '',
}, {
  title: '条款',
  href: '',
}];

const copyright = <div>Copyright <Icon type="copyright" /> 2017 蚂蚁金服体验技术部出品</div>;

class UserLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
  }
  getChildContext() {
    const { location } = this.props;
    return { location };
  }
  getPageTitle() {
    const { location } = this.props;
    const { pathname } = location;
    let title = 'smart-venue';
    // getRouteData('UserLayout').forEach((item) => {
    items.forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name} - smart-venue`;
      }
    });
    return title;
  }
  render() {
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="" className={styles.logo} src="https://gw.alipayobjects.com/zos/rmsportal/NGCCBOENpgTXpBWUIPnI.svg" />
                <span className={styles.title}>smart-venue</span>
              </Link>
            </div>
            <p className={styles.desc}>smart-venue 智能体育馆</p>
          </div>
          {
            // getRouteData('UserLayout').map(item =>
            items.map(item =>
              (
                <Route
                  exact={item.exact}
                  key={item.path}
                  path={item.path}
                  component={item.component}
                />
              )
            )
          }
          <GlobalFooter className={styles.footer} links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
