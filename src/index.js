import React from "react";
import ReactDom from "react-dom";
import App from "./App";
import "core-js/es6/map";
import "core-js/es6/set";
import "raf/polyfill";
import "core-js/es6/promise";
import "./index.css";
import "antd/dist/antd.css";

ReactDom.render(<App />, document.getElementById("root"));
