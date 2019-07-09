import React from 'react';
import { Menu} from 'antd';
import { NavLink } from "react-router-dom";
import menulist from '../../config/menuConfig';
import { switchMenu } from './../../redux/action';
import {connect} from 'react-redux';
import './index.less'
const { SubMenu } = Menu;

class NavLeft extends React.Component {
    state={
        currentKey: ''
    }
    handleClick=({item,key})=>{
        const {dispatch} = this.props;
        dispatch(switchMenu(item.props.title));
         this.setState({
            currentKey: key
         })

    }
    componentWillMount(){
        const menuTreeNode = this.renderMenu(menulist);
        let currentKey = window.location.hash.replace(/#|\?.*$/g,'')
        this.setState({
            menuTreeNode,
            currentKey
        })
    }
    renderMenu=(data)=>{
        return data.map((item)=>{
            if(item.children){
                return (
                <SubMenu key={item.key} title={item.title}>
                    {this.renderMenu(item.children)}
                </SubMenu>
            )}
            return <Menu.Item key={item.key} title={item.title}>
                <NavLink to={item.key}>{item.title}</NavLink>
            </Menu.Item>
        })
    }
    render(){
        return (
            <div>
                <div className="logo">
                    <img src="./assets/logo-ant.svg"></img>
                    <span className="title">Imooc MS</span>
                </div>
                <div>
                    <Menu theme="dark"
                        onClick={this.handleClick}
                        selectedKeys={[this.state.currentKey]}
                    >
                        { this.state.menuTreeNode }
                    </Menu>
                </div>
            </div>
        )
    }
}

export default connect()(NavLeft);