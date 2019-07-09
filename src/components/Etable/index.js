import React from 'react';
import { Table } from 'antd';

export default class Etable extends React.Component {
    onRowClick= (record,index)=>{
        let row_selection = this.props.rowSelection;
        if (row_selection === 'checkbox'){
            let selectedRowKeys = this.props.selectedRowKeys;
            let selectedItem = this.props.selectedItem;
            let selectedRowIds = this.props.selectedRowIds;
            if(selectedRowIds){
                const i = selectedRowIds.indexOf(record.id);
                if(i === -1) {
                    selectedRowKeys.push(index);
                    selectedItem.push(record);
                    selectedRowIds.push(record.id);
                }else {
                    selectedRowKeys.splice(i,1);
                    selectedItem.splice(i,1);
                    selectedRowIds.splice(i,1);
                }  
            }else {
                selectedRowKeys = [index];
                selectedItem = [record];
                selectedRowIds = [record.id];
            }
            this.props.updateSelectedItem(selectedRowKeys,selectedItem,selectedRowIds);
        }else {
            let selectedRowKeys = [index];
            let selectedItem = record;
            this.props.updateSelectedItem(selectedRowKeys,selectedItem);
        }
    }
    tableInit=()=>{
        let row_selection = this.props.rowSelection;
        let selectedRowKeys = this.props.selectedRowKeys;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys,
        }
        if(row_selection === false || row_selection === null) {
            row_selection = false;
        } else if(row_selection === 'checkbox') {
            rowSelection.type = 'checkbox';
        } else {
            row_selection = 'radio';
        }
        return (
            <Table
                bordered
                {...this.props}
                rowSelection = {row_selection?rowSelection:null}
                onRow={(record,index)=>{
                    return {
                        onClick: ()=>{
                            if(!row_selection){
                                return 
                            }
                            this.onRowClick(record, index)
                        }
                    }
                    
                }}
            >

            </Table>
        )
    }
    render(){
        return (
            <div>
                {this.tableInit()}
            </div>
        )
    }
}