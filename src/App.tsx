import React from 'react'
import { connect } from 'dva'
import "./index.less";
import logo from '../public/img/logo512.png';

// const aaaa = function( ) {
//   console.log('aaaa')
// }

const App = function(props) {
    return (
      <div className="page"> 
      sss33
        <img src={logo} className="App-logo" alt="logo" />
        <div className='title'><span>test page1</span></div>
        <h2>{ props.count }</h2>
        {/* <button key="add" onClick={() => { props.dispatch({type: 'count/add'})}}>+</button>
        <button key="minus" onClick={() => { props.dispatch({type: 'count/minus'})}}>-</button> */}
      </div>
    );
};

export default connect(({ count }) => ({ count }))(App)

