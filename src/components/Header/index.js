import React from 'react';
import { Row, Col } from 'antd';
import Utils from '../../utils';
import {connect} from 'react-redux';
import './index.less'

class Header extends React.Component {
    componentWillMount(){
        this.setState({
            userName: 'wangquan'
        })
        setInterval(()=>{
            let sysTime = Utils.formateDate(new Date().getTime());
            this.setState({
                sysTime
            })
        },1000)  
    }
    render(){
        const menuType = this.props.menuType;
        return (
            <div className="header">
                <Row className="header-top">
                    {
                         menuType === "second" ? (
                             <Col span={6} className="title">
                                <img src="./assets/logo-ant.svg"></img>
                                <span style={{fontSize: 18}}>Imooc MS通用管理系统</span>
                             </Col>
                         ): ''
                    }
                    <Col span={menuType === "second" ? 18: 24}>
                        <span>欢迎，{this.state.userName}</span>
                        <a href="#">退出</a>
                    </Col>
                </Row>
                {
                    menuType !== "second" ? (
                    <Row className="breadcrumb">
                        <Col span={4} className="breadcrumb-title">
                            {this.props.menuName}
                        </Col>
                        <Col span={20} className="weather">
                            <span className="date">{this.state.sysTime}</span>
                            <span className="weather-datail">晴</span>
                        </Col>
                    </Row>
                    ): ''
                }
                
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        menuName: state.menuName
    }
}
export default  connect(mapStateToProps)(Header);