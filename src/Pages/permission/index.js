import React from 'react';
import { Card, Button, Modal, Form, Input, Select, Tree, Transfer } from 'antd';
import ETable from './../../components/Etable';
import menuConfig from './../../config/menuConfig';
import axios from './../../axios';
import Utils from './../../utils';
const TreeNode = Tree.TreeNode;
export default class User extends React.Component {
    state = {

    }
    handleCreateRole = () => {
        this.setState({
            isRoleVisible: true
        })
    }
    handleRoleSubmit = () => {
        let data = this.roleForm.props.form.getFieldsValue();
        axios.ajax({
            url: '/role/create',
            data: {
                params: data
            }
        }).then((res) => {
            if (res.code === 0) {
                this.setState({
                    isRoleVisible: false
                })
                this.roleForm.props.form.resetFields();
                axios.requestList(this, '/role/list', {});
            }
        })
    }
    handlePermission = () => {
        let item = this.state.selectedItem;
        if (!item) {
            Modal.info({
                title: '提示',
                content: '请选择一个角色'
            })
            return
        }
        this.setState({
            isPermissionVisible: true,
            detailInfo: item,
            menuInfo: item.menus
        })
    }
    handlePermissionSubmit = () => {
        let data = this.permissionForm.props.form.getFieldsValue();
        data.role_id = this.state.selectedItem.id;
        data.menus = this.state.menuInfo;
        axios.ajax({
            url: '/permission/edit',
            data: {
                params: {
                    ...data
                }
            }
        }).then(res => {
            if (res.code === 0) {
                this.setState({
                    isPermissionVisible: false
                })
                axios.requestList(this, '/role/list', {});
            }
        })
    }
    handleUserAuth = () => {
        let item = this.state.selectedItem;
        if (!item) {
            Modal.info({
                title: '提示',
                content: '请选择一个角色'
            })
            return
        }
        this.setState({
            isUserVisible: true,
            detailInfo: item
        })
        this.getRoleList(item);
    }

    getRoleList = (item) => {
        axios.ajax({
            url: '/role/user_list',
            data: {
                params: {
                    id: item.id
                }
            }
        }).then(res => {
            if (res.code === 0) {
                this.getAuthUserList(res.result);
            }
        })
    }
    // 筛选目标用户
    getAuthUserList = (dataSource) => {
        const mockData = [];
        const targetKeys = [];
        if (dataSource && dataSource.length > 0) {
            dataSource.forEach(item => {
                const data = {
                    key: item.user_id,
                    title: item.user_name,
                    status: item.status
                }
                if (data.status === 1) {
                    targetKeys.push(data.key);
                }
                mockData.push(data)

            })
            this.setState({
                mockData, targetKeys
            })
        }
    }
    handleUserSubmit = ()=>{
        let data = {};
        data.user_ids = this.state.targetKeys;
        data.role_id = this.state.selectedItem.id;
        axios.ajax({
            url: '/role/user_role_edit',
            data: {
                params:{
                    ...data
                }
            }
        }).then(res=>{
            if(res.code===0){
                this.setState({
                    isUserVisible: false
                })
                axios.requestList(this, '/role/list', {});
            }
        })
    }
    componentWillMount() {
        axios.requestList(this, '/role/list', {});
    }
    render() {
        const columns = [
            {
                title: '用户Id',
                dataIndex: 'id'
            },
            {
                title: '角色名称',
                dataIndex: 'role_name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time'
            },
            {
                title: '使用状态',
                dataIndex: 'status',
                render(status) {
                    return status === 1 ? '启用' : '停用'
                }
            },
            {
                title: '授权时间',
                dataIndex: 'authorize_time'
            },
            {
                title: '授权人',
                dataIndex: 'authorize_user_name'
            },
        ]
        return (
            <div>
                <Card>
                    <Button type="primary" style={{ marginRight: 10 }} onClick={this.handleCreateRole}>创建角色</Button>
                    <Button type="primary" style={{ marginRight: 10 }} onClick={this.handlePermission}>设置权限</Button>
                    <Button type="primary" onClick={this.handleUserAuth}>用户授权</Button>
                </Card>
                <div className="content-wrap">
                    <ETable
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        selectedRowKeys={this.state.selectedRowKeys}
                        columns={columns}
                        dataSource={this.state.list}
                    >

                    </ETable>
                    <Modal
                        title="创建角色"
                        visible={this.state.isRoleVisible}
                        onOk={this.handleRoleSubmit}
                        onCancel={() => {
                            this.roleForm.props.form.resetFields()
                            this.setState({
                                isRoleVisible: false
                            })
                        }}
                    >
                        <RoleForm wrappedComponentRef={(inst) => this.roleForm = inst}></RoleForm>
                    </Modal>
                    <Modal
                        title="设置权限"
                        visible={this.state.isPermissionVisible}
                        onOk={this.handlePermissionSubmit}
                        onCancel={() => {
                            this.permissionForm.props.form.resetFields()
                            this.setState({
                                isPermissionVisible: false
                            })
                        }}
                    >
                        <PermissionForm detailInfo={this.state.detailInfo}
                            wrappedComponentRef={(inst) => this.permissionForm = inst}
                            menuInfo={this.state.menuInfo}
                            patchMenuInfo={(checkedKeys) => {
                                this.setState({
                                    menuInfo: checkedKeys
                                })
                            }}>
                        </PermissionForm>
                    </Modal>
                    <Modal
                        title="用户授权"
                        visible={this.state.isUserVisible}
                        onOk={this.handleUserSubmit}
                        onCancel={() => {
                            this.userAuthForm.props.form.resetFields()
                            this.setState({
                                isUserVisible: false
                            })
                        }}
                        width={700}
                    >
                        <AuthUserForm detailInfo={this.state.detailInfo}
                            wrappedComponentRef={(inst) => this.userAuthForm = inst}
                            targetKeys={this.state.targetKeys}
                            mockData={this.state.mockData}
                            patchInfo={(targetKeys)=>{
                                this.setState({
                                    targetKeys
                                })
                            }}
                        >
                        </AuthUserForm>
                    </Modal>
                </div>
            </div>
        )
    }
}

class RoleForm extends React.Component {
    render() {
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
                        getFieldDecorator('role_name')(
                            <Input type='text' placeholder="请输入角色名称"></Input>
                        )
                    }
                </Form.Item>
                <Form.Item label="状态" {...formItemLayout}>
                    {
                        getFieldDecorator('state')(
                            <Select style={{ width: 100 }} placeholder="全部">
                                <Select.Option value={1}>启用</Select.Option>
                                <Select.Option value={0}>禁用</Select.Option>
                            </Select>
                        )
                    }
                </Form.Item>
            </Form>
        )
    }
}
RoleForm = Form.create({})(RoleForm);

class PermissionForm extends React.Component {
    onCheck = (checkedKeys) => {
        this.props.patchMenuInfo(checkedKeys);
    }
    renderTreeNode = (data) => {
        return data.map((item) => {
            if (item.children) {
                return <TreeNode title={item.title} key={item.key}>
                    {this.renderTreeNode(item.children)}
                </TreeNode>
            } else {
                return <TreeNode title={item.title} key={item.key}> </TreeNode>
            }
        })
    }
    render() {
        let detailInfo = this.props.detailInfo;
        let menuInfo = this.props.menuInfo;
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
                <Form.Item label="角色名称" {...formItemLayout}>
                    {
                        getFieldDecorator('role_name', {
                            initialValue: detailInfo.role_name
                        })(
                            <Input type='text' placeholder="请输入角色名称" disabled></Input>
                        )
                    }
                </Form.Item>
                <Form.Item label="状态" {...formItemLayout}>
                    {
                        getFieldDecorator('state', {
                            initialValue: 1
                        })(
                            <Select style={{ width: 100 }} placeholder="全部">
                                <Select.Option value={1}>启用</Select.Option>
                                <Select.Option value={0}>禁用</Select.Option>
                            </Select>
                        )
                    }
                </Form.Item>
                <Tree
                    checkable
                    defaultExpandAll
                    onCheck={(checkedKeys) => {
                        this.onCheck(checkedKeys)
                    }}
                    checkedKeys={menuInfo}
                >
                    <TreeNode title="平台权限" key="platform_all">
                        {this.renderTreeNode(menuConfig)}
                    </TreeNode>
                </Tree>
            </Form>
        )
    }
}
PermissionForm = Form.create({})(PermissionForm);

class AuthUserForm extends React.Component {
    filterOption = (inputValue, option) => option.title.indexOf(inputValue) > -1;
    handleChange = (targetKeys)=>{
        this.props.patchInfo(targetKeys);
    }
    render() {
        let detailInfo = this.props.detailInfo;
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
                <Form.Item label="角色名称" {...formItemLayout}>
                    {
                        getFieldDecorator('role_name', {
                            initialValue: detailInfo.role_name
                        })(
                            <Input type='text' placeholder="请输入角色名称" disabled></Input>
                        )
                    }
                </Form.Item>
                <Form.Item label="选择用户" {...formItemLayout}>
                    <Transfer
                        listStyle={{width: 200, height: 400}}
                        dataSource={this.props.mockData}
                        titles={['待选用户', '已选用户']}
                        showSearch
                        searchPlaceholder="请输入用户名"
                        filterOption={this.filterOption}
                        targetKeys={this.props.targetKeys}
                        onChange={this.handleChange}
                        render={item => item.title}
                    >
                    </Transfer>
                </Form.Item>

            </Form>
        )
    }
}
AuthUserForm = Form.create({})(AuthUserForm);