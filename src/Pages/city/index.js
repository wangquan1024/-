import React from 'react';
import { Card, Button,Form, Select, Modal, message } from 'antd';
import axios from './../../axios';
import ETable from './../../components/Etable';
import BaseForm from './../../components/BaseForm';

export default class City extends React.Component {
    state = {
        list: [],
        isShowOpenCity: false
    }
    params = {
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
            type: 'SELECT',
            label: '营运模式',
            field: 'op_mode',
            placeholder: '',
            initialValue: '1',
            width: 100,
            list: [{id: "1", name: "加盟"},{id:"2",name:"自营"}]
        },
        {
            type: 'SELECT',
            label: '用车模式',
            field: 'mode',
            placeholder: '',
            initialValue: '1',
            width: 100,
            list: [{id: "1", name: "指定停车点"},{id:"2",name:"禁停区模式"}]
        }
    ]
    componentDidMount(){
        this.requestList();
    }
    // 默认请求接口数据
    requestList = ()=> {
        axios.requestList(this,'/open_city',this.params)
    }
    //开通城市
    handleOpenCity = ()=>{
        this.setState({
            isShowOpenCity: true
        })
    }
    // 开通城市提交
    handleSubmit = ()=>{
        let cityInfo = this.cityFrom.props.form.getFieldsValue();
        axios.ajax({
            url: '/open/city',
            data:{
                params: cityInfo
            }
        }).then((res)=>{
            if(res.code=== 0) {
                message.success('开通成功');
                this.setState({
                    isShowOpenCity: false
                })
                this.requestList()
            }
        })
    }

    filterSubmit= (params)=>{
        this.params = params;
        this.requestList();
    }
    render(){
        const columns = [
            {
                title: "城市ID",
                dataIndex: 'id'
            },
            {
                title: "城市名称",
                dataIndex: 'name'
            },
            {
                title: "用车模式",
                dataIndex: 'mode',
                render(mode){
                    return mode === "1"? "指定停车点模式":"禁停区模式"
                }
            },
            {
                title: "营运模式",
                dataIndex: 'op_mode',
                render(op_mode){
                    return op_mode === "1"? "自营":"加盟"
                }
            },
            {
                title: " 授权加盟商",
                dataIndex: 'franchisee_name'
            },
            {
                title: "城市管理员",
                dataIndex: 'city_admins',
                render(arr){
                    return arr.map((item)=>{
                        return item.user_name;
                    }).join(',')
                }
            },
            {
                title: "城市开通时间",
                dataIndex: 'open_time'
            },
            {
                title: "操作时间",
                dataIndex: 'update_time'
            },
            {
                title: "操作人",
                dataIndex: 'sys_user_name'
            }
        ]
        return (
            <div>
                <Card>
                    <BaseForm formList={ this.formList } filterSubmit={this.filterSubmit}></BaseForm>
                </Card>
                <Card style={{marginTop: 10}}>
                    <Button type="primary" onClick={this.handleOpenCity}>开通城市</Button>
                    <div className="content-wrap">
                        <ETable
                            columns={columns}
                            dataSource={this.state.list}
                            pagination={this.state.pagination}
                            rowSelection={false}
                        >  
                        </ETable>

                    </div>
                </Card>
                <Modal
                    title="开通城市"
                    visible={this.state.isShowOpenCity}
                    onCancel = {()=>this.setState({
                        isShowOpenCity: false
                    })}
                    onOk={this.handleSubmit}
                >
                    <OpentCityForm wrappedComponentRef={(inst)=>{this.cityFrom = inst}}></OpentCityForm>
                </Modal>
            </div>
        )
    }
}

class OpentCityForm extends React.Component {
    render(){
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 19
            }
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="horizontal">
                <Form.Item label="选择城市" {...formItemLayout}>
                    {
                        getFieldDecorator('city_id',{
                            initialValue: '1'
                        })(
                            <Select style={{width: 100}}>
                                <option value="">全部</option>
                                <option value="1">北京市</option>
                                <option value="2">天津市</option>
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item label="营运模式" {...formItemLayout}>
                    {
                        getFieldDecorator('op_mode',{
                            initialValue: '1'
                        })(
                            <Select style={{width: 100}}>
                                <option value="1">自营</option>
                                <option value="2">加盟</option>
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item label="用车模式" {...formItemLayout}>
                    {
                        getFieldDecorator('mode',{
                            initialValue: '1'
                        })(
                            <Select style={{width: 100}}>
                                <option value="1">指定停车点</option>
                                <option value="2">禁停区模式</option>
                            </Select>
                        )
                    }
                </Form.Item>
            </Form>
        )
    }
}
OpentCityForm = Form.create({})(OpentCityForm);