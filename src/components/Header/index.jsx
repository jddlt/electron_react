import React, { useState, useEffect } from "react";
import moment from "moment";
import { request } from "./../../utils";
import "./index.css";
import Login from "../../pages/Login";
import { ConsoleSqlOutlined } from "@ant-design/icons";

let timer = null;

const Header = () => {
  const [date, setDate] = useState({ type: "", du: "" });
  const [time, setTime] = useState("");
  useEffect(() => {
    (async () => {
      const res = await request(
        `http://wthrcdn.etouch.cn/weather_mini?city=${decodeURI("弋阳")}`,
        {}
      );
      console.log(res);
      setDate({
        type: res.data.data.forecast[0].type,
        du: `${parseInt(
          res.data.data.forecast[0].low.replace(/(低温 |高温 )/, "")
        )}~${parseInt(
          res.data.data.forecast[0].high.replace(/(低温 |高温 )/, "")
        )}℃`,
      });
    })();
  }, []);
  useEffect(() => {
    console.log("我应该执行一次");
    timer = setInterval(
      () => setTime(moment(new Date()).format("YYYY年MM月DD日 HH:mm:ss")),
      1000
    );
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="header">
      <h1 className="main-title">弋阳县公墓管理</h1>
      <div className="flex-sb">
        {/* <div
          style={{ fontSize: "20px", color: "#3a97b2", marginRight: "12px" }}
        >
          管理员
        </div> */}
        <div
          style={{
            color: "#2e2e2e",
            fontSize: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <span
          //   style={{ fontSize: "20px", color: "#3a97b2", marginRight: "12px" }}
          >
            {time || "2020年01月01日 00:00:00"}
          </span>
          <div>
            {/* <span style={{ color: "#1890ff" }}> */}
            {date.type} {date.du}
            {/* </span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Header);
