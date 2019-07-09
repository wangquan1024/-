import axios from 'axios';
import { Modal } from 'antd';
import Utils from './../utils';
export default class Axios {
    static ajax(options){
        return new Promise((resolve,reject)=> {
            let baseApi = "https://www.easy-mock.com/mock/5d0f3330395fc11f441ec1c0/background";
            axios({
                url: options.url,
                method: 'get',
                baseURL: baseApi,
                timeout: 5000,
                params:(options.data && options.data.params) || ''
            }).then((response)=>{
                if(response.status === 200){
                    let res = response.data;
                    if(res.code === 0) {
                        resolve(res);
                    } else {
                        Modal.info({
                            title: "提示",
                            content: res.msg
                        })
                    }
                } else {
                    reject(response.data);
                }
            })
        })  
    }
    // 列表请求的封装
    static requestList(_this,url,params){
        let data = {
            params: params
        }
        this.ajax({
            url,
            data
        }).then((data)=>{
            if(data&&data.result){
                let list = data.result.item_list.map((item,index)=>{
                    item.key = index;
                    return item;
                })
                _this.setState({
                    list,
                    pagination: Utils.pagination(data,(current)=>{
                        _this.params.page = current;
                        _this.requestList();
                    })
                })
            } 
        })
    }
}