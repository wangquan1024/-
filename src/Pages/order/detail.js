import React from 'react';
import { Card } from 'antd';
import axios from './../../axios';
import Utils from './../../utils';
import './detail.less';
export default class OrderDetail extends React.Component {
    state = {
        orderInfo: {},
    }
    componentDidMount(){
        let orderId = this.props.match.params.orderId;
        if(orderId){
            this.getDetailInfo(orderId);
        }
    }
    getDetailInfo=(orderId)=>{
        axios.ajax({
            url: '/order/detail',
            data: {
                params: {
                    orderId: orderId
                }
            }
        }).then((res)=>{
            if(res.code=== 0){
                this.setState({
                    orderInfo: res.result
                })
                this.renderMap(res.result);
            }
        })
    }
    // 初始化地图控件
    renderMap(result){
        this.map = new window.BMap.Map("orderDetailMap");

        // 添加地图控件
        this.addMapControl();
        // 绘制行驶轨迹
        this.drawBikeRouter(result.position_list);
        // 绘制服务区
        this.drawServerArea(result.area);
    }

    addMapControl=()=>{
        let map = this.map;
        map.addControl(new window.BMap.ScaleControl({anchor: window.BMAP_ANCHOR_TOP_RIGHT})); 
        map.addControl(new window.BMap.NavigationControl({anchor: window.BMAP_ANCHOR_TOP_RIGHT}));
    }
    // 绘制用户行驶路线
    drawBikeRouter=(positionList)=>{
        let map  = this.map;
        let start_point = '';
        let end_point = '';
        if(positionList.length>0){
            let first = positionList[0];
            let last = positionList[positionList.length - 1];
            start_point = new window.BMap.Point(first.lon,first.lat);
            let startIcon = new window.BMap.Icon('/assets/start_point.png',new window.BMap.Size(36,42),{
                imageSize:new window.BMap.Size(36,42),
                anchor: new window.BMap.Size(18, 42)
            })

            let startMarker = new window.BMap.Marker(start_point, { icon: startIcon});
            this.map.addOverlay(startMarker); 

            end_point = new window.BMap.Point(last.lon,last.lat);
            // 替换标注为自己的图标
            let endIcon = new window.BMap.Icon('/assets/end_point.png',
                new window.BMap.Size(36,42),{
                    imageSize: new window.BMap.Size(36,42),
                    anchor: new window.BMap.Size(36,42)
                }
            )
            let lastMarker = new window.BMap.Marker(end_point,{icon: endIcon});
            this.map.addOverlay(lastMarker); 

            // 连接路线图
            let tracePoint= [];
            positionList.forEach((item)=>{
                tracePoint.push(new window.BMap.Point(item.lon,item.lat))
            })
            let polyline =new window.BMap.Polyline(tracePoint, {
                strokeColor: '#1869AD',
                strokeWeight: 3,
                strokeOpacity: 1
            })
            map.addOverlay(polyline);

            this.map.centerAndZoom(end_point, 11); 
        }
        
    }

    // 绘制服务区
    drawServerArea = (positionList)=>{
        let tracePoint= [];
        positionList.forEach((item)=>{
            tracePoint.push(new window.BMap.Point(item.lon,item.lat))
        })
        let polygon =new window.BMap.Polygon(tracePoint, {
            strokeColor: '#CE0000',
            strokeWeight: 4,
            strokeOpacity: 1,
            fillColor: '#ff8605',
            fillOpacity: 0.4
        })
        this.map.addOverlay(polygon);
    }
    render(){
        const info = this.state.orderInfo || {};
        return (
            <div>
                <Card  bordered={false} style={{margin: 30, border: '1px solid #e5e5e5'}}>
                    <div id="orderDetailMap" className="order-map"></div>
                    <div className="detail-items">
                        <div className="item-title">基础信息</div>
                        <ul className="detail-form">
                            <li>
                                <div className="detail-form-left">用车模式</div>
                                <div className="detail-form-content">{info.mode ===1?'服务区':'停车点'}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">订单编号</div>
                                <div className="detail-form-content">{info.order_sn}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">车辆编号</div>
                                <div className="detail-form-content">{info.bike_sn}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">用户姓名</div>
                                <div className="detail-form-content">{info.user_name}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">手机号码</div>
                                <div className="detail-form-content">{info.mobile}</div>
                            </li>
                        </ul>
                    </div>
                    <div className="detail-items">
                        <div className="item-title">行驶轨迹</div>
                        <ul className="detail-form">
                            <li>
                                <div className="detail-form-left">行程起点</div>
                                <div className="detail-form-content">{info.start_location}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">行程终点</div>
                                <div className="detail-form-content">{info.end_location}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">行驶里程</div>
                                <div className="detail-form-content">{info.distance}</div>
                            </li>
                        </ul>
                    </div>
                </Card>
            </div>
        )
    }
}