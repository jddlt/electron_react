import React from "react";
import ReactDom from "react-dom";
import App from "./App";
import 'core-js/es'  
import 'react-app-polyfill/ie9'  
import 'react-app-polyfill/stable'
import "./index.css";
import "antd/dist/antd.css";

ReactDom.render(<App />, document.getElementById("root"));
