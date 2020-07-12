import React, { useState } from 'react';
import {HashRouter,Route,Switch,Redirect, Link, withRouter } from 'react-router-dom';
import a from 'react-router';
import Home from './pages/Home'
import Header from './components/Header'
import Computed from './pages/Computed'
import AddMudi from './pages/Computed/AddMudi'
import Area from './pages/Area'
import { Button } from 'antd'
import Login from './pages/Login'
// import List from './pages/List'
import './app.css'
import { PrinterFilled } from '@ant-design/icons';


function App(props) {
 const [where, setWhere] = useState(0)
  console.log('props', this);
  
  return <div className='app' style={{overflowY: 'hidden'}}>
    <HashRouter>
      <Header></Header>
      <Switch>
        {/* <Route exact path="/list" component={List}/> */}
        {/* { where === 1 && <Redirect to='/area'></Redirect>}
        { where === 2 && <Redirect to='/computed'></Redirect>} */}
        <Route exact path="/login" component={Login}/>
        <Route exact path="/home" component={Home}/>
        <Route exact path="/area" component={Area}/>
        <Route exact path="/addMudi" component={AddMudi}/>
        <Route exact path="/computed" component={Computed}></Route>
        <Redirect exact from='/' to='/login'></Redirect>
      </Switch>
    </HashRouter>
  </div>
}

export default App;