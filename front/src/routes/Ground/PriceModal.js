import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Button, Modal, Table } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(state => ({
  currentGroundPrice: state.grounds.currentGroundPrice,
}))
@Form.create()
export default class PriceModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      groundId: props.ground.id,
    }
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'grounds/getPrice',
      groundId: this.state.groundId,
    });
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

  getFormItem() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      // labelCol: { span: 5 },
      wrapperCol: { span: 20 },
    };

    const items = [];
    for (let i = 7; i < 23; i ++) {
      items.push(
        <Col span={8} key={i}>
          <FormItem
            {...formItemLayout}
            label={`${i}:00——${i+1}:00`}
            key={i}
          >
            {getFieldDecorator('price' + i, {
              initialValue: this.props.currentGroundPrice[i-7].price,
              rules: [{
                required: true, message: '请输入价格',
              }],
            })(
              <Input type='number' placeholder="请输入价格" />
              )}
          </FormItem>
        </Col>
      );
    } 
    return items;
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    // console.info(this.props.currentGroundPrice);

    const columns = this.columns;
    return (
      <Modal
        title="设置价格"
        visible={true}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        {this.props.currentGroundPrice.length > 0 &&
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
          >
            <Row>
              {this.getFormItem()}
            </Row>
          </Form>
        }
      </Modal>
    );
  }
}
