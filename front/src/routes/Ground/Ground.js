import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './Ground.less';
import PageHeaderLayout from 'ant-design-pro/lib/PageHeader';
import { Row, Col, Table, Icon, Pagination, Card, Modal, Button } from 'antd';
import AddAndEdit from './AddAndEdit';
import PriceModal from './PriceModal';
import image from '../../assets/ground.jpg';

const confirm = Modal.confirm;

@connect(state => ({
  grounds: state.grounds.list,
  total: state.grounds.total,
  currentPage: state.grounds.currentPage,
}))
export default class Ground extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      type: "list",
      record: null,
      showModal: false,
      showPriceModal: false,
      columns: [{
        title: 'name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => ('第' + text + '场地') 
      }, {
        title: 'description',
        dataIndex: 'description',
        key: 'description',
      },{
        title: 'config',
        dataIndex: 'config',
        key: 'config',
      },{
        title: 'picture',
        dataIndex: 'picture',
        key: 'picture',
        render: (text, record) => {
          return <img src={image} alt={record.picture} />;
        }
      },{
        title: 'type',
        dataIndex: 'type',
        key: 'type',
        render: (text) => (text === '1' ? '羽毛球场' : '乒乓球场')
      },{
        title: 'status',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          if (text === 'true') {
            return (
              <div>
                <p style={{color: 'green', marginLeft: 3}}>已启用</p>
                <Button size="small" type="danger" 
                  onClick={this.changeStatus.bind(this, record.id, 0)}>停用</Button>
              </div>
            )
          } 
          return (
            <div>
              <p style={{color: 'red', marginLeft: 3}}>已停用</p>
              <Button size="small" type="primary"
                onClick={this.changeStatus.bind(this, record.id, 1)}>启用</Button>
            </div>
          )
        }
      },{
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={this.edit.bind(this, record)}>编辑</a>
            <span className={styles.splitLine} />
            <a onClick={this.delete.bind(this, record.id)}>删除</a>
            <span className={styles.splitLine} />
            <a onClick={this.setPrice.bind(this, record)}>设置价格</a>
          </span>
        ),
      }],
    }
  }

  changeStatus(id, value) {
    // alert(id)
    console.info(id)
    if (value == 0) {
      confirm({
        title: '确认停用改场地?',
        content: '',
        onOk() {
          console.log('OK');
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      confirm({
        title: '确认启用该场地',
        content: '',
        onOk() {
          console.log('OK');
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  }

  pageChangeHandler(currentPage) {
    this.props.dispatch({
      type: 'grounds/fetch',
      query: { currentPage }
    });
  }

  add() {
    this.setState({
      showModal: true,
      record: {
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

  setPrice(record) {
    this.setState({
      record: record,
      showPriceModal: true,
    });
  }

  hidePriceModel() {
    this.setState({
      showPriceModal: false,
    });
  }

  render() {
    return (
      <div>
        <PageHeaderLayout />
        <Card bordered={false}>
          <Button type="primary" onClick={this.add.bind(this)}>添加场地</Button>
          <Table
            style={{ marginTop: 10 }}
            size="small"
            columns={this.state.columns}
            dataSource={this.props.grounds}
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
        </Card>
        {this.state.showModal && 
          <AddAndEdit
            hideModel={this.hideModel.bind(this)}
            type={this.state.type}
            ground={this.state.record}
          />
        }
        {this.state.showPriceModal && 
          <PriceModal
            hideModel={this.hidePriceModel.bind(this)}
            ground={this.state.record}
          />
        }
      </div>
    );
  }
}
