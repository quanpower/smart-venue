import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Modal, Select, Upload, message, Icon } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

@Form.create()
export default class AddAndEdit extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  handleChange = (info) => {
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({ imageUrl }));
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
    const { ground } = this.props;
    const imageUrl = this.state.imageUrl;
    const typeOptions = [{key: '1', name: '两人场'}, {key: '2', name: '四人场'}]
                        .map(type => (<Option key={type.key}>{type.name}</Option>));
    const statusOptions = [{key: 'true', name: '已启用'}, {key: 'false', name: '已停用'}]
                        .map(status => (<Option key={status.key}>{status.name}</Option>));

    return (
      <Modal
        title="添加场地"
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
            label="场地名称"
          >
            {getFieldDecorator('name', {
              initialValue: ground.name,
              rules: [{
                required: true, message: '请输入场地名',
              }],
            })(
              <Input placeholder="请输入场地名" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="描述"
          >
            {getFieldDecorator('description', {
              initialValue: ground.description,
              rules: [{ required: true, message: '请输入场地描述' }],
            })(
              <TextArea style={{ minHeight: 32 }} placeholder="请输入场地描述" rows={2} />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="配置说明"
          >
            {getFieldDecorator('config', {
              initialValue: ground.config,
              rules: [{ required: true, message: '请输入配置' }],
            })(
              <TextArea style={{ minHeight: 32 }} placeholder="请输入配置" rows={2} />
              )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="类型"
          >
            {getFieldDecorator('type', {
              initialValue: ground.type,
              rules: [{ required: true, message: '请选择场地类型' }],
            })(
              <Select placeholder="请选择场地类型">
                {typeOptions}
              </Select>
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="图片"
          >
            {getFieldDecorator('picture', {
              initialValue: ground.type,
              rules: [{ required: true, message: '请选择场地类型' }],
            })(
              <Upload
                className="avatar-uploader"
                name="avatar"
                showUploadList={true}
                action="//jsonplaceholder.typicode.com/posts/"
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
              >
                {
                  imageUrl ?
                    <img src={imageUrl} alt="" className="avatar" /> :
                    <Icon type="plus" className="avatar-uploader-trigger" />
                }
              </Upload>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="状态"
          >
            {getFieldDecorator('status', {
              initialValue: ground.status,
              rules: [{ required: true, message: '请选择场地状态' }],
            })(
              <Select placeholder="请选择场地状态">
                {statusOptions}
              </Select>
              )}
          </FormItem>

        </Form>
      </Modal>
    );
  }
}
