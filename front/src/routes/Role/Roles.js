import React, {PureComponent} from 'react';
import { connect } from 'dva';
import styles from './Roles.less';
import PageHeaderLayout from 'ant-design-pro/lib/PageHeader';
import { Table, Icon, Pagination, Card, Modal, Button } from 'antd';
import AddAndEdit from './AddAndEdit';
import AssignMenu from './AssignMenu';

const confirm = Modal.confirm;

@connect(state => ({
  data: state.roles.list,
  loading: state.roles.loading,
  total: state.roles.total,
  currentPage: state.roles.currentPage,
}))
export default class Roles extends PureComponent {

  constructor() {
    super();
    this.state = {
      type: "list",
      record: null,
      showModal: false,
      showAssignMenu: false,
      columns: [{
        title: 'role_name',
        dataIndex: 'role_name',
        key: 'role_name',
      },{
        title: 'description',
        dataIndex: 'description',
        key: 'description',
      },{
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={this.edit.bind(this, record)}>编辑</a>
            <span className={styles.splitLine} />
            <a onClick={this.delete.bind(this, record.id)}>删除</a>
            <span className={styles.splitLine} />
            <a onClick={this.assignMenu.bind(this, record)}>分配菜单</a>
          </span>
        ),
      }],
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'roles/fetch',
      query: {
        currentPage: 1
      }
    });
  }

  pageChangeHandler(currentPage) {
    this.props.dispatch({
      type: 'roles/fetch',
      query: { currentPage }
    });
  }

  add() {
    this.setState({
      showModal: true,
      record: {
        role_name: null,
        description: null,
      },
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
      showModal: true,
    });
  }

  assignMenu(record) {
    this.setState({
      showAssignMenu: true,
      record: record
    });
  }

  hideAssignMenu() {
    this.setState({
      showAssignMenu: false,
    });
  }

  render() {
    return (
      <div>
        <PageHeaderLayout />
        <Card bordered={true}>
          <div className={styles.normal}>
            <Button type="primary" onClick={this.add.bind(this)}>添加角色</Button>
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
        </Card>
        {this.state.showModal && 
          <AddAndEdit
            hideModel={this.hideModel.bind(this)}
            role={this.state.record}
          />
        }
        {this.state.showAssignMenu && 
          <AssignMenu
            hideModel={this.hideAssignMenu.bind(this)}
            role={this.state.record}
          />
        }
      </div>
    );
  }
}
