import React, {PureComponent} from 'react';
import { connect } from 'dva';
import { Row, Col, Table, Icon, Pagination, Card, Modal, Button, Tree } from 'antd';
import toTreeData from '../../utils/transformData';

const TreeNode = Tree.TreeNode;

@connect(state => ({
  menus: state.menus.list,
  roleMenus: state.menus.roleMenus,
}))
export default class AssignMenu extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      allKeys: [],
      checkKeys: [],
    }
  }

  componentDidMount() { 
    this.props.dispatch({
      type: 'menus/fetch',
    });
    this.props.dispatch({
      type: 'menus/fetchByRole',
      roleId: this.props.role.id
    });
    this.setState({
      allKeys: this.props.menus.map(node => (node.id.toString())),
      checkKeys: this.props.roleMenus.map(node => (node.id.toString())),
    });
  }

  handleOk = (e) => {
    e.preventDefault();
    
  }

  handleCancel = (e) => {
    e.preventDefault();
    this.props.hideModel();
  }

  render() {
    const treeData = toTreeData(this.props.menus);
    const roleMenuData = toTreeData(this.props.roleMenus);

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
      <Modal
        title="分配菜单"
        width={800}
        min
        visible={true}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Row>
          <Col span={12}>
            <Card bordered={false} title='总菜单'>
              <Tree
                multiple={true}
                checkable={true}
                checkStrictly={true}
                autoExpandParent={true}
                // defaultExpandAll={true}
                defaultExpandedKeys={this.state.allKeys}
                defaultCheckedKeys={this.state.checkKeys}
              >
                {loop(treeData)}
              </Tree>
            </Card>
          </Col>
          {/* <Col span={2}>
            <i className="anticon anticon-double-right" style={{marginTop: 200}}></i>
          </Col> */}
          <Col span={12}>
            <Card bordered={false} title='分配的菜单'>
              <Tree
                // defaultExpandAll={true}
                defaultExpandedKeys={this.state.allKeys}
                autoExpandParent={true}
              >
                {loop(roleMenuData)}
              </Tree>
            </Card>
          </Col>
        </Row>
      </Modal>
    );
  }
}
