import React, { useState } from "react";
import { Form, Button, Input, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
// import { browserHistory } from 'react-router'
import { Redirect } from "react-router-dom";
import "./index.css";

export default () => {
  const [form, setForm] = useState({ name: "", pwd: "" });
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = () => {
    if (form.name === "admin" && form.pwd === "123456") {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsLogin(true);
      }, 1200);
    } else {
      message.error("账号或密码不正确");
      return;
    }
  };
  return (
    <div className="login">
      {isLogin && <Redirect to="/home" />}
      {/* <div className='title'>弋阳县公墓管理</div> */}
      <div className="modle">
        <Form>
          <Form.Item>
            <Input
              defaultValue={form.name}
              placeholder="账号"
              prefix={<UserOutlined />}
              style={{ width: "230px", borderRadius: "6px" }}
              onInput={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <Input
              type="password"
              defaultValue={form.pwd}
              placeholder="密码"
              prefix={<LockOutlined />}
              style={{ width: "230px", borderRadius: "6px" }}
              onInput={(e) => setForm({ ...form, pwd: e.target.value })}
              onKeyUp={(e) => {
                if (e.keyCode === 13) {
                  login();
                }
              }}
            />
          </Form.Item>
        </Form>
        <Button
          type="primary"
          style={{ width: "230px", borderRadius: "6px", marginTop: "20px" }}
          onClick={login}
          loading={isLoading}
        >
          登陆
        </Button>
      </div>
    </div>
  );
};
