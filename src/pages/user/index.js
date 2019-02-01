import React from 'react';
import { Card, Button } from 'antd';
import axios from '../../axios';
import Utils from '../../utils/utils';
import ETable from './../../components/ETable';
import BaseForm from '../../components/BaseForm';

export default class User extends React.Component {
  params = {
    page: 1
  };

  state = {};

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
  render() {
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
        title: '早起事件',
        dataIndex: 'time'
      }
    ];
    return (
      <div>
        <Card>
          <BaseForm formList={this.formList} filterSubmit={this.handleFilter} />
        </Card>
        <Card style={{ marginTop: 10 }}>
          <Button type="primary" onClick={this.openOrderDetail}>
            订单详情
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
      </div>
    );
  }
}
