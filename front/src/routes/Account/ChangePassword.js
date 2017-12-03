import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, DatePicker, Select, Button, Card } from 'antd';
import PageHeaderLayout from 'ant-design-pro/lib/PageHeader';

const FormItem = Form.Item;

@connect(state => ({
  userId: state.login.account.userId,
  username: state.login.account.username
}))
@Form.create()
class ChangePasword extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.info(values);
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('两次密码输入不一致！');
    } else {
      callback();
    }
  }

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { submitting } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <div>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 24 }}>
            <FormItem
              {...formItemLayout}
              label="用户名"
              hasFeedback
            >
              {getFieldDecorator('username', {
                initialValue: this.props.username,
              })(
                <Input placeholder="username" disabled/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="原始密码"
              hasFeedback
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '请输入当前密码!',
                  min: 6, message: "至少6位字符或数字"
                }],
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="新密码"
              hasFeedback
            >
              {getFieldDecorator('newPassword', {
                rules: [{
                  required: true, message: '请输入新密码',
                  min: 6, message: "至少6位字符或数字"
                }, {
                  validator: this.checkConfirm,
                }],
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="请确认密码"
              hasFeedback
            >
              {getFieldDecorator('confirmPassword', {
                rules: [{
                  required: true, message: '请确认新密码!',
                  min: 6, message: "至少6位字符或数字"
                }, {
                  validator: this.checkPassword,
                }],
              })(
                <Input type="password" onBlur={this.handleConfirmBlur} />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 40 }}>
              <Button type="primary" htmlType="submit">
                修改
              </Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}

export default ChangePasword;
