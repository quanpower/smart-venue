import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Radio, Select, Button, Modal} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

@connect(state => ({
  currentPage: state.users.currentPage,
}))
@Form.create()
export default class Add extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
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
    const roleOptions = this.props.roles.map(role => (<Option key={role.id}>{role.name}</Option>));
    return (
      <Modal 
        title="添加用户"
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
            label="注："
          >
            <span>初始密码为123123</span>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="用户名"
          >
            {getFieldDecorator('user_account', {
              rules: [{
                required: true, message: '请输入用户名',
              }],
            })(
              <Input placeholder="请输入用户名" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="用户类型"
          >
            {getFieldDecorator('user_type', {
              rules: [{ required: true, message: '请选择管理员' }],
            })(
              <Select placeholder="请选择用户类型">
                {roleOptions}
              </Select>
              )}
          </FormItem>
          
        </Form>
      </Modal>
    );
  }
}
