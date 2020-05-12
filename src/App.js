import React from 'react';
import {HashRouter,Route,Switch } from 'react-router-dom';
import Home from './pages/Home'
import Computed from './pages/Computed'
import './app.css'


function App() {
  return <div className='app'>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/computed" component={Computed}></Route>
      </Switch>
    </HashRouter>
  </div>
}

export default App;
