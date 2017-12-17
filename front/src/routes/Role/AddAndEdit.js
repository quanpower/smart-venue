import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Modal } from 'antd';

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
      role: this.props.role
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
    const {role} = this.props;
    // console.info(role);
    return (
      <Modal
        title="添加角色"
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
            label="角色名称"
          >
            {getFieldDecorator('role_name', {
              initialValue: role.role_name,
              rules: [{
                required: true, message: '请输入角色名',
              }],
            })(
              <Input placeholder="请输入角色名" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="描述"
          >
            {getFieldDecorator('description', {
              initialValue: role.description,
              rules: [{ required: true, message: '请输入角色描述' }],
            })(
              <TextArea style={{ minHeight: 32 }} placeholder="请输入角色描述" rows={4} />
              )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
