import React, {PureComponent} from 'react';
import { connect } from 'dva';
import styles from './Users.less';
import PageHeaderLayout from 'ant-design-pro/lib/PageHeader';
import { Table, Icon, Pagination, Card, Modal, Button } from 'antd';
import EditAndDetail from './EditAndDetail';
import Add from './Add';

const confirm = Modal.confirm;

@connect(state => ({
  data: state.users.list,
  loading: state.users.loading,
  total: state.users.total,
  currentPage: state.users.currentPage,
}))
export default class Users extends PureComponent {

  constructor() {
    super();
    this.state = {
      type: "list",
      record: null,
      showModal: false,
      roles: [],
      columns: [{
        title: 'user_account',
        dataIndex: 'user_account',
        key: 'user_account',
      },{
        title: 'user_name',
        dataIndex: 'user_name',
        key: 'user_name',
      },{
        title: 'email',
        dataIndex: 'email',
        key: 'email',
      },{
        title: 'phone',
        dataIndex: 'phone',
        key: 'phone',
      },{
        title: 'address',
        dataIndex: 'address',
        key: 'address',
      },{
        title: 'user_type',
        dataIndex: 'user_type',
        key: 'user_type',
      },{
        title: 'sex',
        dataIndex: 'sex',
        key: 'sex',
      },{
        title: 'birthday',
        dataIndex: 'birthday',
        key: 'birthday',
      },{
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={this.edit.bind(this, record)}>编辑</a>
            <span className={styles.splitLine} />
            <a onClick={this.delete.bind(this, record.id)}>删除</a>
            <span className={styles.splitLine} />
            <a onClick={this.detail.bind(this, record)}>详情</a>
          </span>
        ),
      }]
    }
  }
  
  componentDidMount() {
    this.props.dispatch({
      type: 'users/fetch',
      query: {
        currentPage: 1
      }
    });
    this.setState({
      roles: [{
        "id": 1,
        "name": "admin"
      },{
        "id": 2,
        "name": "user"
      }]
    });
  }

  pageChangeHandler(currentPage) {
    this.props.dispatch({
      type: 'users/fetch',
      query: { currentPage }
    });
  }

  add() {
    this.setState({
      showModal: true,
    });
  }

  hideModel() {
    this.setState({
      showModal: false,
    });
  }

  delete(id) {
    confirm({
      title: '确认删除这条记录?',
      content: '',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  edit(record) {
    this.setState({
      type: "edit",
      record: record,

    });
  }

  detail(record) {
    this.setState({
      type: "detail",
      record: record,
    });
  }

  return() {
    this.setState({
      type: "list",
    });
  }

  render() {
    // console.info(this.props);
    return (
      <div>
        <PageHeaderLayout />
        <Card bordered={true}>
          {this.state.type == 'list' &&
            <div>
              <Button type="primary" onClick={this.add.bind(this)}>添加用户</Button>
              <Table
                style={{marginTop: 10}}
                size="small"
                columns={this.state.columns} 
                dataSource={this.props.data} 
                loading={this.props.loading}
                pagination={false}
              />
              <Pagination
                style={{ marginTop: 10 }}
                className="ant-table-pagination"
                total={this.props.total}
                current={this.props.currentPage}
                pageSize={10}
                onChange={this.pageChangeHandler.bind(this)}
              />
            </div>
          }
          {this.state.type !== 'list' &&
            <EditAndDetail
              type={this.state.type}
              user={this.state.record}
              return={this.return.bind(this)}
              roles={this.state.roles}
            />
          }
          {this.state.showModal && 
            <Add 
              hideModel={this.hideModel.bind(this)}
              roles={this.state.roles}
            />
          }
        </Card>
      </div>
    );
  }
}
