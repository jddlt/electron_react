import React from 'react';
import {HashRouter,Route,Switch,Redirect } from 'react-router-dom';
import Home from './pages/Home'
import Computed from './pages/Computed'
import Login from './pages/Login'
// import List from './pages/List'
import './app.css'


function App() {
  return <div className='app'>
    <HashRouter>
      <Switch>
        <Redirect exact from='/' to='/login'></Redirect>
        {/* <Route exact path="/list" component={List}/> */}
        <Route exact path="/login" component={Login}/>
        <Route exact path="/home" component={Home}/>
        <Route exact path="/computed" component={Computed}></Route>
      </Switch>
    </HashRouter>
  </div>
}

export default App;
