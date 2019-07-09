import React from 'react';
import {Button, Card, Modal,Form,Input,Radio,DatePicker, Select} from 'antd';
import BaseForm from '../../components/BaseForm';
import Utils from './../../utils';
import axios from './../../axios';
import ETable from './../../components/Etable';
import moment from 'moment';
 
export default class User extends React.Component {
    state = {
        isShow: false
    }
    params = {
        page: 1
    }
    formList = [
        {
            type: 'INPUT',
            label: '用户名',
            field: 'user_name',
            placeholder: '请输入用户名',
            width: 100
        },
        {
            type: 'INPUT',
            label: '手机号',
            field: 'user_mobile',
            placeholder: '请输入用户手机号',
            width: 100
        },
        {
            type: 'DATE',
            label: '请选择入职日期',
            field: 'user_date',
            placeholder: '请输入日期',
            width: 100
        },
    ]
    componentDidMount(){
        this.requestList();
    }
    handleFilter=(params)=>{
        this.params= params;
        this.requestList();
    }
    // 创建新员工
    handleSubmit=()=>{
        let type = this.state.type;
        let data = this.userForm.props.form.getFieldsValue();
        axios.ajax({
            url:type==="create"?'/user/add':'/user/edit',
            data: {
                params: data
            }    
        }).then((res)=>{
            if(res.code === 0){
                this.setState({
                    isShow: false
                })
                this.userForm.props.form.resetFields()
                this.requestList()
            }
        })
    }
    requestList = ()=>{
        axios.requestList(this,'/user/list',this.params);
    }
    //  功能区操作
    handleOperate=(type)=>{
        let item = this.state.selectedItem;
        if(type==='create'){
            this.setState({
                type,
                isShow: true,
                titile: '创建员工'
            })
        }else if(type==='edit'){
            if(!item){
                Modal.info({
                    title: '提示',
                    content: '请选择一个用户'
                })
                return
            }
            this.setState({
                type,
                isShow: true,
                title: '编辑员工',
                userInfo: item
            })
        }else if(type==='detail'){
            if(!item){
                Modal.info({
                    title: '提示',
                    content: '请选择一个用户'
                })
                return
            }
            this.setState({
                type,
                isShow: true,
                title: '员工详情',
                userInfo: item
            })
        }else {
            let _this = this;
            if(!item){
                Modal.info({
                    title: '提示',
                    content: '请选择一个用户'
                })
                return
            }
            Modal.confirm({
                title:'确认删除',
                content: '是否删除当前选中员工?',
                onOk(){
                    axios.ajax({
                        url:'/user/delete',
                        data: {
                            params:{
                                id: item.id
                            }
                        }
                    }).then((res)=>{
                        if(res.code === 0){
                            _this.setState({
                                isShow: false
                            })
                            _this.requestList()
                        }
                    })
                }
            })
        }
    }
    render(){
        let footer = {}
        if(this.state.type==='detail'){
            footer = {
                footer: null
            }
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
                render(sex){
                    return sex ===1? '男': '女'
                }
            },
            {
                title: '状态',
                dataIndex: 'state',
                render(state){
                    return {
                        '1': '咸鱼一条',
                        '2': '风华浪子',
                        '3': '北大才子一枚',
                        '4': '百度FE',
                        '5': '创业者'
                    }[state]
                }
            },
            {
                title: '爱好',
                dataIndex: 'interest',
                render(interest){
                    return {
                        '1': '游泳',
                        '2': '打篮球',
                        '3': '踢足球',
                        '4': '跑步',
                        '5': '爬山',
                        '6': '骑行',
                        '7': '桌球',
                        '8': '麦霸',
                    }[interest]
                }
            },
            {
                title: '联系地址',
                dataIndex: 'address'
            },
            {
                title: '时间',
                dataIndex: 'time'
            },
        ]
        return (
            <div>
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.handleFilter}></BaseForm>
                </Card>
                <Card style={{marginTop: 10}} className="operate-wrap">
                    <Button type='primary' icon='plus' onClick={()=>{this.handleOperate('create')}}>创建员工</Button>
                    <Button type='primary' icon='edit' onClick={()=>{this.handleOperate('edit')}}>编辑员工</Button>
                    <Button type='primary'  onClick={()=>{this.handleOperate('detail')}}>员工详情</Button>
                    <Button type='primary' icon='delete' onClick={()=>{this.handleOperate('delete')}}>删除员工</Button>
                </Card>
                <Card>
                    <ETable
                         updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                         columns={columns}
                         dataSource = {this.state.list}
                         pagination = {false}
                         selectedItem = {this.state.selectedItem}
                         selectedRowKeys = {this.state.selectedRowKeys}
                    >

                    </ETable>
                </Card>
                <Modal
                    title={this.state.titile}
                    visible={this.state.isShow}
                    onOk={()=>{
                        this.handleSubmit();
                    }}
                    onCancel={()=>{
                        this.userForm.props.form.resetFields()
                        this.setState({
                            isShow: false
                        })
                    }}
                    width={600}
                    {...footer}
                >
                    <UserForm type={this.state.type} userInfo={this.state.userInfo} wrappedComponentRef={(inst)=>this.userForm = inst}></UserForm>
                </Modal>
            </div>
        )
    }
}

class UserForm extends React.Component {
    setUserState = (userState)=>{
        return {
            '1': '咸鱼一条',
            '2': '风华浪子',
            '3': '北大才子一枚',
            '4': '百度FE',
            '5': '创业者'
        }[userState]
    }
    render(){
        let type= this.props.type;
        let userInfo = this.props.userInfo || {};
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span:5},
            wrapperCol: {span:19}
        }
        return (
            <Form layout="horizontal">
                <Form.Item label="用户名" {...formItemLayout}>
                    {
                        type==="detail"?userInfo.username:getFieldDecorator('user_name',{
                            initialValue: userInfo.username
                        })(
                            <Input type='text' placeholder=" 请输入用户名"></Input>
                        )
                    }
                </Form.Item>
                <Form.Item label="性别" {...formItemLayout}>
                    {
                         type==="detail"?userInfo.sex===1?'男':"女":getFieldDecorator('sex',{
                            initialValue: userInfo.sex
                        })(
                            <Radio.Group>
                                <Radio value={1}>男</Radio>
                                <Radio value={2}>女</Radio>
                            </Radio.Group>
                        )
                    }
                </Form.Item>
                <Form.Item label="状态" {...formItemLayout}>
                    {
                        type==="detail"?this.setUserState(userInfo.state):getFieldDecorator('state',{
                            initialValue: userInfo.state
                        })(
                            <Select>
                                <Select.Option value={1}>咸鱼一条</Select.Option>
                                <Select.Option value={2}>风华浪子</Select.Option>
                                <Select.Option value={3}>北大才子一枚</Select.Option>
                                <Select.Option value={4}>百度FE</Select.Option>
                                <Select.Option value={5}>创业者</Select.Option>
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item label="生日" {...formItemLayout}>
                    {
                         type==="detail"?userInfo.birthday:getFieldDecorator('birthday',{
                            initialValue: moment(userInfo.birthday)
                        })(
                            <DatePicker showTime></DatePicker>
                        )
                    }
                </Form.Item>
                <Form.Item label="联系地址" {...formItemLayout}>
                    {
                        type==="detail"?userInfo.address:getFieldDecorator('address',{
                            initialValue: userInfo.address
                        })(
                            <Input.TextArea rows={3} placeholder=" 请输入联系地址"></Input.TextArea>
                        )
                    }
                </Form.Item>
            </Form>
        )
    }
}

UserForm = Form.create({})(UserForm);