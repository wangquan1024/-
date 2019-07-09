import React from 'react';
import { Button,  Form, Select, Input, Checkbox,DatePicker } from 'antd';
import Utils from './../../utils';

class FilterForm extends React.Component {
    handleFilterSubmit=()=>{
        let filterValue = this.props.form.getFieldsValue();
        this.props.filterSubmit(filterValue);
    }
    reset=()=>{
        this.props.form.resetFields();
    }
    initFormList=()=>{
        const { getFieldDecorator } = this.props.form;
        let formList = this.props.formList;
        let fiterItem = [];
        if(formList&&formList.length>0){
            formList.forEach(item => {
                let label = item.label;
                let field = item.field;
                let placeholder = item.placeholder;
                let initialValue = item.initialValue;
                let width = item.width;
                if(item.type === '时间查询'){
                    const start_time = (<Form.Item label={'订单时间'} key={'start_time'}>
                        {
                            getFieldDecorator('start_time')(
                                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"></DatePicker>
                            )
                        }
                    </Form.Item>);
                    fiterItem.push(start_time);
                    const end_time = (<Form.Item label={'~'} colon={false} key={'end_time'}>
                        {
                            getFieldDecorator('end_time')(
                                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"></DatePicker>
                            )
                        }
                    </Form.Item>);
                    fiterItem.push(end_time);
                } else if(item.type === 'SELECT'){
                    const SELECT = <Form.Item label={label} key={field}>
                        {
                            getFieldDecorator(field,{
                                initialValue: initialValue
                            })(
                                <Select placeholder={placeholder} style={{width: width}}>
                                    {
                                        Utils.getOptionList(item.list)
                                    }
                                </Select>
                            )
                        }
                    </Form.Item>
                    fiterItem.push(SELECT);
                }else if(item.type === 'INPUT') {
                    const INPUT = <Form.Item label={label} key={field}>
                        {
                            getFieldDecorator(field,{
                                initialValue: initialValue
                            })(
                               <Input type="text" placeholder={placeholder}></Input>
                            )
                        }
                    </Form.Item>
                    fiterItem.push(INPUT);
                } else if(item.type === 'CHECKBOX') {
                    const CHECKBOX = <Form.Item label={label} key={field}>
                        {
                            getFieldDecorator(field,{
                                valuePropName: 'checked',
                                initialValue: initialValue
                            })(
                               <Checkbox>
                                   {label}
                               </Checkbox>
                            )
                        }
                    </Form.Item>
                    fiterItem.push(CHECKBOX);
                } else if(item.type === 'DATE') {
                    const date = <Form.Item label={label} key={field}>
                        {
                            getFieldDecorator(field)(
                            <DatePicker showTime placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss"></DatePicker>
                            )
                        }
                    </Form.Item>
                    fiterItem.push(date);
                }

            });
        }
        return fiterItem;
    }
    render(){
        return (
            <Form layout="inline">
                {this.initFormList()}
                <Form.Item>
                   <Button type="primary" style={{margin: '0 20px'}} onClick={this.handleFilterSubmit}>查询</Button>
                   <Button onClick={this.reset}>重置</Button>
                </Form.Item>
            </Form>
        )
    }
}

export default  Form.create({})(FilterForm);