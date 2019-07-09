import React from 'react';
import { Select } from 'antd';

export  default {
    formateDate(time){
        if(!time) return '';
        let date = new Date(time);
        return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
    },
    pagination(data,callback){
        return {
            onChange:(current) => {
                callback(current)
            },
            current:data.result.page,
            pageSize: data.result.page_size,
            total: data.result.total,
            showTotal:()=>{
                return `共${data.result.total}条`
            },
            showQuickJumper: true
        }
    },
    getOptionList(data){
        if(!data){
            return 
        }
        let option = [];
        data.forEach(item => {
            option.push(<Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>);
        });
        return option;
    },
    updateSelectedItem(selectedRowKeys,selectedItem,selectedIds){
        if(selectedIds){
            this.setState({
                selectedRowKeys,
                selectedItem,
                selectedIds
            })
        }else {
            this.setState({
                selectedRowKeys,
                selectedItem
            })
        }
        
    }
}
