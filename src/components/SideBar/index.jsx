/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link, withRouter, useHistory } from "react-router-dom";

const { Item } = Menu;

const SideBar = (props) => {
  const history = useHistory();
  console.log("history", history);

  return history.location.pathname !== "/login" ? (
    <Menu
      style={{ width: 150 }}
      // defaultSelectedKeys={[history.location.pathname]}
      // defaultOpenKeys={["sub1"]}
      selectedKeys={[history.location.pathname]}
      mode="inline"
    >
      <Item className="tac fs15" key="/detail">
        <Link to="detail">
          <i className="iconfont fs18 mr4 pt1">&#xe603;</i>
          弋阳公墓
        </Link>
      </Item>
      <Item className="tac fs15" key="/home">
        <Link to="/home">
          <i className="iconfont fs18 mr4 pt1">&#xe76e;</i>
          公墓选择
        </Link>
      </Item>
      <Item className="tac fs15" key="/computed">
        <Link to="/computed">
          <i className="iconfont fs18 mr4 pt1">&#xe604;</i>
          墓地管理
        </Link>
      </Item>
      <Item className="tac fs15" key="/area">
        <Link to="/area">
          <i className="iconfont fs18 mr4 pt1">&#xe613;</i>
          区域管理
        </Link>
      </Item>
      <Item className="tac fs15" key="/addMudi">
        <Link to="/addMudi">
          <i className="iconfont fs18 mr4 pt1">&#xe713;</i>
          添加墓地
        </Link>
      </Item>
    </Menu>
  ) : null;
};

export default withRouter(SideBar);
