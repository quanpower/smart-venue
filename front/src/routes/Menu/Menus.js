import React, {PureComponent} from 'react';
import { connect } from 'dva';
import styles from './Menus.less';
import PageHeaderLayout from 'ant-design-pro/lib/PageHeader';
import { Row, Col, Table, Icon, Pagination, Card, Modal, Button, Tree } from 'antd';
import AddAndEdit from './AddAndEdit';
import toTreeData from '../../utils/transformData';

const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;

@connect(state => ({
  data: state.menus.list,
  loading: state.menus.loading,
}))
export default class Roles extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      type: "list",
      record: null,
      showModal: false,
      columns: [{
        title: 'name',
        dataIndex: 'name',
        key: 'name',
      },{
        title: 'parent_name',
        dataIndex: 'parent_name',
        key: 'parent_name',
      },{
        title: 'icon_name',
        dataIndex: 'icon_name',
        key: 'icon_name',
      },{
        title: 'sort_index',
        dataIndex: 'sort_index',
        key: 'sort_index',
      },{
        title: 'component',
        dataIndex: 'component',
        key: 'component',
      },{
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={this.edit.bind(this, record)}>编辑</a>
            <span className={styles.splitLine} />
            <a onClick={this.delete.bind(this, record.id)}>删除</a>
          </span>
        ),
      }],
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'menus/fetch',
    });
  }

  add() {
    this.setState({
      showModal: true,
      record: {
        name: null,
        parent_id: null,
        icon_name: null,
        sort_index: 1,
        component: null,
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

  render() {
    const treeData = toTreeData(this.props.data);

    const loop = data => data.map((item) => {
      if (item.children.length > 0) {
        return (
          <TreeNode key={item.id} title={item.name}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.name} />;
    });

    return (
      <div>
        <PageHeaderLayout />
        <Card bordered={true}>
          <Row>
            <Col span={6}>
              <Card bordered={false}>
                <Tree
                  defaultExpandAll={true}
                  autoExpandParent={true}
                >
                  {loop(treeData)}
                </Tree>
              </Card>
            </Col>
            <Col span={18}>
                <Card bordered={false}>
                <Button type="primary" onClick={this.add.bind(this)}>添加目录</Button>
                <Table
                  style={{marginTop: 10}}
                  size="small"
                  columns={this.state.columns} 
                  dataSource={this.props.data} 
                  loading={this.props.loading}
                  pagination={true}
                />
              </Card>
            </Col>
          </Row>
        </Card>
        {this.state.showModal && 
          <AddAndEdit
            hideModel={this.hideModel.bind(this)}
            menu={this.state.record}
          />
        }
      </div>
    );
  }
}
