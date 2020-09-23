/* eslint-disable */
import React, { useState } from "react";
import {
  HashRouter,
  Route,
  Switch,
  Redirect,
  Link,
  useHistory,
} from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Computed from "./pages/Computed";
import AddMudi from "./pages/Computed/AddMudi";
import Detail from "./pages/Detail/index3";
import Area from "./pages/Area";
import Login from "./pages/Login";
import SideBar from "./components/SideBar";
import "./app.css";

function App(props) {
console.log('LocationL', location.hash);
  return (
    <div className="app" style={{ overflowY: "hidden", padding: "60px 0" }}>
      <HashRouter>
        {/* { location.hash !== '#/login' && <Header /> } */}
        <Header />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100vw",
            height: "calc(100vh - 120px)",
          }}
        >
          <SideBar />
          <div
            style={{
              flex: 1,
              height: "100%",
              overflowY: "auto",
            }}
          >
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/detail" component={Detail} />
              <Route exact path="/home" component={Home} />
              <Route exact path="/area" component={Area} />
              <Route exact path="/addMudi" component={AddMudi} />
              <Route exact path="/computed" component={Computed}></Route>
              <Redirect exact from="/" to="/login"></Redirect>
            </Switch>
          </div>
        </div>
        {/* { location.hash !== '#/login' && <Footer /> } */}
        <Footer />
      </HashRouter>
    </div>
  );
}

export default App;
