import React from 'react';
import { Card, Button, Table, Form, Select, Modal, message, DatePicker, Radio } from 'antd';
import axios from './../../axios';
import ETable from './../../components/Etable';
import BaseForm from './../../components/BaseForm';
import Utils from './../../utils';
export default class Order extends React.Component {
    state= {
        list: [],
        orderInfo: {},
        orderConfirmVisible: false,
        selectedRowKeys: [],
        selectedItem: [],
        selectedRowIds: []
    }
    params= {
        page: 1
    }
    formList = [
        {
            type: 'SELECT',
            label: '城市',
            field: 'city_id',
            placeholder: '全部',
            initialValue: '1',
            width: 100,
            list: [{id: '0', name: '全部'},{id: "1", name: "北京"},{id:"2",name:"天津"},{id:'3',name:'上海'}]
        },
        {
            type: '时间查询',
        },
        {
            type: 'SELECT',
            label: '订单状态',
            field: 'status',
            placeholder: '全部',
            initialValue: '1',
            width: 100,
            list: [{id: '0', name: '全部'},{id: "1", name: "进行中"},{id:"2",name:"行程结束"}]
        },
    ]   
    componentDidMount(){
        this.requestList();
    }

    handleSubmit =(params)=>{
        this.params = params;
        this.requestList();
    }
    requestList=()=>{
        axios.requestList(this, '/order/list',this.params);
    }
    handleConfirm=()=>{
        const id = this.state.selectedItem.id;
        if(!id){
            Modal.info({
                title: '信息',
                content: '请选择一条订单结束'
            })
            return ;
        }
        axios.ajax({
            url: '/order/ebike_info',
            data: {
                params: {
                    order_id: id
                }
            }
        }).then((res)=>{
            if(res.code===0){
                this.setState({
                    orderInfo: res.result,
                    orderConfirmVisible: true
                })
            }   
        })
    }
    handleFinishOrder=()=>{
        const id = this.state.selectedItem.id;
        axios.ajax({
            url: '/order/finish_order',
            data: {
                params: {
                    order_id: id
                }
            }
        }).then((res)=>{
            if(res.code===0){
                message.success('结束订单成功');
                this.setState({
                    orderConfirmVisible: false
                })
                this.requestList()
            }   
        })
    }
    OpenOrderDetail= ()=>{
        const id = this.state.selectedItem.id;
        if(!id){
            Modal.info({
                title: '信息',
                content: '请先选择一条订单'
            })
            return ;
        }
        window.open(`/#/common/order/detail/${id}`);
    }
    render(){
        const columns = [
            {
                title: "订单编号",
                dataIndex: 'order_sn'
            },
            {
                title: "车辆编号",
                dataIndex: 'bike_sn'
            },
            {
                title: " 用户名",
                dataIndex: 'user_name',
            },
            {
                title: "手机号码",
                dataIndex: 'mobile'
            },
            {
                title: " 里程",
                dataIndex: 'distance',
                render(distance){
                    return distance/1000 + 'Km';
                }
            },
            {
                title: "行驶时间",
                dataIndex: 'total_time'
            },
            {
                title: "状态",
                dataIndex: 'status'
            },
            {
                title: "开始时间",
                dataIndex: 'start_time'
            },
            {
                title: "结束时间",
                dataIndex: 'end_time'
            },
            {
                title: "订单金额",
                dataIndex: 'total_fee'
            },
            {
                title: "实际金额",
                dataIndex: 'user_pay'
            }
        ]
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 19
            }
        }
        return (
            <div>
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.handleSubmit}></BaseForm>
                </Card>
                <Card style={{marginTop: 10}}>
                    <Button type="primary" style={{marginRight: 10}} onClick={this.OpenOrderDetail}>订单详情</Button>
                    <Button type="primary" onClick={this.handleConfirm}>结束订单</Button>
                </Card>
                <div className="content-wrap">
                    <ETable
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        columns={columns}
                        dataSource = {this.state.list}
                        pagination = {this.state.pagination}
                        selectedItem = {this.state.selectedItem}
                        selectedRowKeys = {this.state.selectedRowKeys}
                    >
                    </ETable>
                </div>
                <Modal
                    title="订单详情"
                    visible={this.state.orderConfirmVisible}
                    onCancel={()=>{
                        this.setState({
                            orderConfirmVisible: false
                        })
                    }}
                    onOk={this.handleFinishOrder}
                    width={600}
                >
                    <Form layout="horizontal">
                        <Form.Item label="车辆编号" {...formItemLayout}>
                            {this.state.orderInfo.bike_sn}
                        </Form.Item>
                        <Form.Item label="剩余电量" {...formItemLayout}>
                            {this.state.orderInfo.battery + '%'}
                        </Form.Item>
                        <Form.Item label="行程开始时间" {...formItemLayout}>
                            {this.state.orderInfo.start_time}
                        </Form.Item>
                        <Form.Item label="当前位置" {...formItemLayout}>
                            {this.state.orderInfo.location}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}