/* eslint-disable */
import React, { useState, useEffect } from "react";
import moment from "moment";
import { request } from "./../../utils";
import "./index.css";
import Login from "../../pages/Login";
import Img from "./../../static/imgs/icp.png";
import { ConsoleSqlOutlined } from "@ant-design/icons";

let timer = null;

const Footer = () => {
  return (
    <div className="main-footer">
      <span style={{ fontSize: "15px" }}>©2019-2020</span>
      <span>
        <img
          src={Img}
          alt="国徽"
          style={{
            width: "24px",
            marginRight: "4px",
            verticalAlign: "middle",
            letterSpacing: "1px",
          }}
        />
        弋阳县公墓管理
      </span>
    </div>
  );
};

export default React.memo(Footer);
