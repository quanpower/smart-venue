import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Modal, Select } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(state => ({
  currentPage: state.users.currentPage,
}))
@Form.create()
export default class AddAndEdit extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      menu: this.props.menu
    }
  }

  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  handleCancel = (e) => {
    e.preventDefault();
    this.props.hideModel();
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const {menu} = this.props;
    // console.info(menu);
    const parentMenu = 
      [{"id": "0", "name": "无"}, {"id": "1", "name": "系统菜单"},{"id": "2", "name": "用户菜单"}]
      .map(menu => (<Option key={menu.id}>{menu.name}</Option>));

    return (
      <Modal
        title="添加菜单"
        visible={true}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form
          onSubmit={this.handleSubmit}
          hideRequiredMark
        >
          <FormItem
            {...formItemLayout}
            label="菜单名称"
          >
            {getFieldDecorator('name', {
              initialValue: menu.name,
              rules: [{
                required: true, message: '请输入菜单名称',
              }],
            })(
              <Input placeholder="请输入菜单名称" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="父菜单"
          >
            {getFieldDecorator('parent_id', {
              initialValue: menu.parent_id,
              rules: [{
                required: true, message: '请输入父菜单',
              }],
            })(
              <Select placeholder="请输入父菜单">
               {parentMenu}
              </Select>
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="图标"
          >
            {getFieldDecorator('icon_name', {
              initialValue: menu.icon_name,
              rules: [{
                required: true, message: '请输入图标',
              }],
            })(
              <Input placeholder="请输入图标" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="排序"
          >
            {getFieldDecorator('sort_index', {
              initialValue: menu.sort_index,
              rules: [{
                required: true, message: '请输入菜单排序',
              }],
            })(
              <Input type="number" placeholder="请输入菜单排序" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="组件"
          >
            {getFieldDecorator('component', {
              initialValue: menu.component,
              rules: [{ required: true, message: '请输入组件名称' }],
            })(
              <Input placeholder="请输入组件名称" />
              )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
