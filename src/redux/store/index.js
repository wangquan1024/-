/**
 * 引入createStore创建仓库
 */

 import {createStore} from 'redux';
 import reducer from './../reducer';

 export default ()=> createStore(reducer);