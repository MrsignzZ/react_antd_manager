import React from 'react';
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Radio,
  DatePicker,
  Select
} from 'antd';
import axios from '../../axios';
import Utils from '../../utils/utils';
import ETable from './../../components/ETable';
import BaseForm from '../../components/BaseForm';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const Option = Select.Option;
export default class User extends React.Component {
  params = {
    page: 1
  };

  state = {
    isVisible: false
  };

  formList = [
    {
      type: 'INPUT',
      label: '用户名',
      field: 'user_name',
      placeholder: '请输入用户名称',
      width: 150
    },
    {
      type: 'INPUT',
      label: '用户手机号',
      field: 'user_mobile',
      placeholder: '请输入用户手机号',
      width: 150
    },
    {
      type: 'DATE',
      label: '请选择入职日期',
      field: 'user_date',
      placeholder: '请输入日期'
    }
  ];

  componentDidMount() {
    this.requestList();
  }

  handleFilter = params => {
    this.params = params;
    this.requestList();
  };
  requestList = () => {
    axios.requestList(this, '/table/list', this.params);
  };

  // 功能操作区
  handleOperator = type => {
    let item = this.state.selectedItem;
    if (type == 'create') {
      this.setState({
        type,
        title: '创建员工',
        isVisible: true
      });
    } else if (type == 'edit') {
      if (!item) {
        Modal.info({
          title: '提示',
          content: '请选择一个用户'
        });
        return;
      }
      this.setState({
        type,
        isVisible: true,
        title: '编辑员工',
        userInfo: item
      });
    } else if (type == 'detail') {
      if (!item) {
        Modal.info({
          title: '提示',
          content: '请选择一个用户'
        });
        return;
      }
      this.setState({
        type,
        isVisible: true,
        title: '员工详情',
        userInfo: item
      });
    } else {
      if (!item) {
        Modal.info({
          title: '提示',
          content: '请选择一个用户'
        });
        return;
      }
      let _this = this;
      Modal.confirm({
        title: '确认删除',
        content: '是否要删除当前选中的员工',
        onOk() {
          axios
            .ajax({
              url: '/user/delete',
              data: {
                params: {
                  id: item.id
                }
              }
            })
            .then(res => {
              if (res.code == 0) {
                _this.setState({
                  isVisible: false
                });
                _this.requestList();
              }
            });
        }
      });
    }
  };

  // 创建员工提交
  handleSubmit = () => {
    let type = this.state.type;
    let data = this.userForm.props.form.getFieldsValue();
    axios.ajax({
      url: type == 'create' ? '/user/add' : '/user/edit',
      data: {
        params: {
          ...data
        }
      }
    }).then((res) => {
      if (res.code == 0) {
        this.setState({
          isVisible: false
        })
        this.requestList();
      }
    })
  }

  render() {
    let footer = {};
    if (this.state.type == 'detail') {
      footer = {
        footer: null
      };
    }
    const columns = [
      {
        title: 'id',
        dataIndex: 'id'
      },
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render(sex) {
          return sex == 1 ? '男' : '女';
        }
      },
      {
        title: '状态',
        dataIndex: 'state',
        render(state) {
          return {
            '1': '咸鱼一条',
            '2': '风华浪子',
            '3': '北大才子',
            '4': '百度FE',
            '5': '创业者'
          }[state];
        }
      },
      {
        title: '爱好',
        dataIndex: 'interest',
        render(interest) {
          return {
            '1': '游泳',
            '2': '打篮球',
            '3': '踢足球',
            '4': '跑步',
            '5': '爬山',
            '6': '骑行',
            '7': '桌球',
            '8': '麦霸'
          }[interest];
        }
      },
      {
        title: '生日',
        dataIndex: 'birthday'
      },
      {
        title: '联系地址',
        dataIndex: 'address'
      },
      {
        title: '早起时间',
        dataIndex: 'time'
      }
    ];
    return (
      <div>
        <Card>
          <BaseForm formList={this.formList} filterSubmit={this.handleFilter} />
        </Card>
        <Card style={{ marginTop: 10 }} className="operate-wrap">
          <Button
            type="primary"
            icon="plus"
            onClick={() => this.handleOperator('create')}
          >
            创建员工
          </Button>
          <Button
            type="primary"
            icon="edit"
            onClick={() => this.handleOperator('edit')}
          >
            编辑员工
          </Button>
          <Button type="primary" onClick={() => this.handleOperator('detail')}>
            员工详情
          </Button>
          <Button
            type="primary"
            icon="delete"
            onClick={() => this.handleOperator('delete')}
          >
            删除员工
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: 10 }}
            onClick={this.handleConfirm}
          >
            结束订单
          </Button>
        </Card>
        <div className="content-wrap">
          <ETable
            updateSelectedItem={Utils.updateSelectedItem.bind(this)}
            columns={columns}
            dataSource={this.state.list}
            selectedRowKeys={this.state.selectedRowKeys}
            selectedItem={this.state.selectedItem}
            pagination={false}
          />
        </div>
        <Modal
          title={this.state.title}
          visible={this.state.isVisible}
          onOk={this.handleSubmit}
          onCancel={() => {
            this.userForm.props.form.resetFields();
            this.setState({
              isVisible: false,
              userInfo: ''
            });
          }}
          width={600}
          {...footer}
        >
          <UserForm
            type={this.state.type}
            userInfo={this.state.userInfo}
            wrappedComponentRef={inst => (this.userForm = inst)}
          />
        </Modal>
      </div>
    );
  }
}

class UserForm extends React.Component {
  getState = state => {
    return {
      '1': '咸鱼一条',
      '2': '风华浪子',
      '3': '北大才子',
      '4': '百度FE',
      '5': '创业者'
    }[state];
  };

  render() {
    let type = this.props.type;
    let userInfo = this.props.userInfo;

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 }
    };
    return (
      <Form layout="horizontal">
        <FormItem label="用户名" {...formItemLayout}>
          {type == 'detail'
            ? userInfo.username
            : getFieldDecorator('user_name', {
                initialValue: userInfo.username
              })(<Input type="text" placeholder="请输入姓名" />)}
        </FormItem>
        <FormItem label="性别" {...formItemLayout}>
          {type == 'detail'
            ? userInfo.sex == 1
              ? '男'
              : '女'
            : getFieldDecorator('sex', {
                initialValue: userInfo.sex
              })(
                <RadioGroup>
                  <Radio value={1}>男</Radio>
                  <Radio value={2}>女</Radio>
                </RadioGroup>
              )}
        </FormItem>
        <FormItem label="状态" {...formItemLayout}>
          {type == 'detail'
            ? this.getState(userInfo.state)
            : getFieldDecorator('state', {
                initialValue: userInfo.state
              })(
                <Select>
                  <Option value={1}>咸鱼一条</Option>
                  <Option value={2}>风华浪子</Option>
                  <Option value={3}>北大才子</Option>
                  <Option value={4}>百度FE</Option>
                  <Option value={5}>创业者</Option>
                </Select>
              )}
        </FormItem>
        <FormItem label="生日" {...formItemLayout}>
          {type == 'detail'
            ? userInfo.birthday
            : getFieldDecorator('birthday', {
                initialValue: moment(userInfo.birthday)
              })(<DatePicker />)}
        </FormItem>
        <FormItem label="联系地址" {...formItemLayout}>
          {type == 'detail'
            ? userInfo.address
            : getFieldDecorator('address', {
                initialValue: userInfo.address
              })(<TextArea rows={3} placeholder="请输入联系地址" />)}
        </FormItem>
      </Form>
    );
  }
}
UserForm = Form.create({})(UserForm);
