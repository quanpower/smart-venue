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
              { (this.props.menus.length > 0 && this.props.roleMenus.length > 0) &&
                <Tree
                  multiple={true}
                  checkable={true}
                  checkStrictly={true}
                  autoExpandParent={true}
                  defaultExpandAll={true}
                  defaultCheckedKeys={this.props.roleMenus.map(node => (node.id.toString()))}
                >
                  {loop(treeData)}
                </Tree>
              }
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false} title='分配的菜单'>
              { this.props.roleMenus.length > 0 &&
                <Tree
                  defaultExpandAll={true}
                  autoExpandParent={true}
                >
                  {loop(roleMenuData)}
                </Tree>
              }
            </Card>
          </Col>
        </Row>
      </Modal>
    );
  }
}
