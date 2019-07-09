import React from 'react';
import { Card } from 'antd';
import axios from './../../axios';
import BaseForm from './../../components/BaseForm';

export default class BikeMsp extends React.Component {
    state = {

    }
    map = ''
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
            list: [{ id: '0', name: '全部' }, { id: "1", name: "北京" }, { id: "2", name: "天津" }, { id: '3', name: '上海' }]
        },
        {
            type: '时间查询'
        },
        {
            type: 'SELECT',
            label: '订单状态',
            field: 'order_status',
            placeholder: '全部',
            initialValue: '0',
            width: 100,
            list: [{ id: '0', name: '全部' }, { id: "1", name: "进行中" }, { id: "2", name: "行程结束" }]
        },

    ]
    componentWillMount() {
        this.requestList();
    }
    renderMap = (res) => {
        let list = res.result.route_list;
        this.map = new window.BMap.Map("container");
        let start_point = '';
        let end_point = '';
        let gps1 = list[0].split(',');
        let gps2 = list[list.length-1].split(',');
        start_point = new window.BMap.Point(gps1[0], gps1[1]);
        let startIcon = new window.BMap.Icon('/assets/start_point.png', new window.BMap.Size(36, 42), {
            imageSize: new window.BMap.Size(36, 42),
            anchor: new window.BMap.Size(18, 42)
        })

        let startMarker = new window.BMap.Marker(start_point, { icon: startIcon });
        this.map.addOverlay(startMarker);

        end_point = new window.BMap.Point(gps2[0], gps2[1]);
        // 替换标注为自己的图标
        let endIcon = new window.BMap.Icon('/assets/end_point.png',
            new window.BMap.Size(36, 42), {
                imageSize: new window.BMap.Size(36, 42),
                anchor: new window.BMap.Size(18, 42)
            }
        )
        let lastMarker = new window.BMap.Marker(end_point, { icon: endIcon });
        this.map.addOverlay(lastMarker);

        // 连接路线图
        let tracePoint = [];
        list.forEach((item) => {
            let p = item.split(',')
            tracePoint.push(new window.BMap.Point(p[0], p[1]))
        })
        let polyline = new window.BMap.Polyline(tracePoint, {
            strokeColor: '#1869AD',
            strokeWeight: 2,
            strokeOpacity: 1
        })
        this.map.addOverlay(polyline);
        // 绘制服务区
        let servicePoint = [];
        let serviceList = res.result.service_list;
        serviceList.forEach((item) => {
            servicePoint.push(new window.BMap.Point(item.lon,item.lat))
        })
        let serviceArea= new window.BMap.Polyline(servicePoint, {
            strokeColor: '#ef4136',
            strokeWeight: 3,
            strokeOpacity: 1
        })
        this.map.addOverlay(serviceArea);

        //绘制地图上的自行车所在的位置
        let bike_list = res.result.bike_list;
        let bikeIcon = new window.BMap.Icon('/assets/bike.jpg',
        new window.BMap.Size(36, 42), {
            imageSize: new window.BMap.Size(36, 42),
            anchor: new window.BMap.Size(18, 42)
        })
        bike_list.forEach(item=>{
           let p = item.split(',');
           let point = new window.BMap.Point(p[0],p[1])
           let marker = new window.BMap.Marker(point, { icon: bikeIcon });
           this.map.addOverlay(marker);
        })
       

        this.map.centerAndZoom(end_point, 11);
    }
    // 默认请求接口数据
    requestList = () => {
        axios.ajax({
            url: '/map/bike_list',
            data: {
                params: this.params
            }
        }).then(res => {
            if (res.code === 0) {
                this.setState({
                    total_count: res.result.total_count
                })
                this.renderMap(res)
            }
        })
    }

    filterSubmit = (params) => {
        this.params = params;
        this.requestList();
    }
    render() {
        return (
            <div>
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.filterSubmit}></BaseForm>
                </Card>
                <Card style={{ marginTop: 10 }}>
                    <div>共{this.state.total_count}辆车</div>
                    <div id="container" style={{ height: 500 }}></div>
                </Card>
            </div>
        )
    }
}

