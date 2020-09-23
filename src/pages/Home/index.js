/* eslint-disable */
import React, { useEffect, useState } from "react";
import { request, filterNoUseParams, Message } from "./../../utils/index";
import moment from "moment";
import "./index2.css";
import {
  Popconfirm,
  message,
  Form,
  Input,
  DatePicker,
  Modal,
  Radio,
  Row,
  Col,
} from "antd";
import { useHistory } from "react-router";

const { Group } = Radio;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const Home = () => {
  const [areaList, setAreaList] = useState([]);
  const [list, setList] = useState([]);
  const [areaId, setAreaId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState({});
  const [current, setCurrent] = useState({});
  const [form] = Form.useForm();
  const history = useHistory();

  const getAreaList = async () => {
    const res = await request("/areaList", {});
    setAreaList(res.data.data);
    getMudiList(res.data.data[0].id);
  };

  const getMudiList = async (id) => {
    setAreaId(id);
    const res = await request("/mudiList", { data: { id } });
    setList(res.data.data);
    // setBuyInfo({
    //   sell: res.data.data.filter(item => item.status != 0).length,
    //   noSell: res.data.data.filter(item => item.status == 0).length
    // })
    let maxCol = 0;
    let maxRow = 0;
    for (let i = 0; i < res.data.data.length; i++) {
      const item = res.data.data[i];
      if (Number(item.row) > maxRow) {
        maxRow = Number(item.row);
      }
      if (Number(item.columns) > maxCol) {
        maxCol = Number(item.columns);
      }
    }
    // setBox({ width: (maxCol * 58 + 12) + 'px', height: (maxRow * 52 + 12) + 'px' })
    setInfo({ maxRow, maxCol });
  };
  const handleOk = (item) => {
    setCurrent(item);
    if (item.status != "2") {
      setVisible(true);
    } else {
      history.push(`/addMudi?id=${item.id}`);
    }
  };
  const sureOk = async () => {
    const val = await form.validateFields();
    const res = await request("/updateMudi", {
      method: "POST",
      data: filterNoUseParams({
        ...val,
        status: current.status + 1,
        diedDay: val.diedDay && moment(val.diedDay).format("YYYY-MM-DD"),
        buyDay: val.buyDay && moment(val.buyDay).format("YYYY-MM-DD HH:mm:ss"),
        useDay: val.useDay && moment(val.useDay).format("YYYY-MM-DD"),
      }),
      query: { id: current.id },
    });
    setVisible(false);
    getMudiList(areaId);
    Message(res);
  };
  useEffect(() => {
    getAreaList();
  }, []);

  return (
    <div className="out-box">
      <div className="tips">
        <div className="really-use"></div>
        <span>已销售已入葬</span>
        <div className="use"></div>
        <span>已销售未入葬</span>
        <div className="no-buy"></div>
        <span>未出售</span>
      </div>
      <div
        className="main-home"
        style={{
          gridTemplateRows: `repeat(${info.maxRow}, 100px)`,
          gridTemplateColumns: `repeat(${info.maxCol}, 100px)`,
        }}
      >
        {new Array(info.maxRow * info.maxCol || 0).fill(null).map((item) => (
          <div className="mudi-box"></div>
        ))}
        {list.map((item) => (
          <Popconfirm
            title={
              !item.status
                ? "是否确认已出售?"
                : item.status == 1
                ? "是否确认已使用?"
                : "使用中, 查看信息?"
            }
            okText={item.status == 2 ? "查看" : "确定"}
            onConfirm={() => handleOk(item)}
            cancelText="取消"
          >
            <div
              className={
                "really-mudi cp " +
                (item.status == 0
                  ? "no-buy-bg"
                  : item.status == 1
                  ? "use-bg"
                  : "really-use-bg")
              }
              style={{
                transform: `translate(${
                  (item.columns - 1) * 115 + 15 + "px"
                }, ${(item.row - 1) * 115 + 15 + "px"})`,
              }}
            >
              <i
                className={
                  "iconfont fs30 " +
                  (item.status == 0 ? "n-b" : item.status == 1 ? "u" : "r-u")
                }
                style={{ marginTop: "-4px" }}
              >
                &#xf09d;
              </i>
              <span style={{ lineHeight: "15px" }}>
                {item.type == 0 ? "单" : "双"}
              </span>
              <span style={{ letterSpacing: "1px" }}>
                {item.row}排{item.columns}列
              </span>
            </div>
          </Popconfirm>
        ))}
      </div>
      <MyModal
        current={current}
        visible={visible}
        sureOk={sureOk}
        closeVisible={() => setVisible(false)}
        areaList={areaList}
        form={form}
      />
    </div>
  );
};

const MyModal = ({
  current,
  visible,
  sureOk,
  closeVisible,
  areaList,
  form,
}) => {
  return (
    <Modal
      title={current.status == 0 ? "编辑为已出售" : "编辑为已使用"}
      visible={visible}
      width={600}
      maskClosable={false}
      cancelText="取消"
      onOk={sureOk}
      okText="确定"
      // confirmLoading={confirmLoading}
      onCancel={closeVisible}
    >
      <Form form={form} labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
        <Row gutter={24}>
          <Col span={12} {...layout}>
            <Form.Item label="所在区域">
              {(areaList.find((item) => item.id === current.areaId) || {}).area}
            </Form.Item>
          </Col>
          <Col span={12} {...layout}>
            <Form.Item label="墓地位置">
              {current.row + "排" + current.columns + "列"}
            </Form.Item>
          </Col>
          <Col span={12} {...layout}>
            <Form.Item label="墓地类型">
              {current.type == 0 ? "单" : "双"}
            </Form.Item>
          </Col>
          <Col span={12} {...layout}>
            <Form.Item label="墓地价格">{current.basePrice + "元"}</Form.Item>
          </Col>

          {current.status == "0" ? (
            <>
              <Col span={12} {...layout}>
                <Form.Item
                  label="购买者"
                  rules={[{ required: true, message: "购买者不能为空" }]}
                  name="buyer"
                >
                  <Input placeholder="请输入购买者"></Input>
                </Form.Item>
              </Col>
              <Col span={12} {...layout}>
                <Form.Item
                  label="联系电话"
                  rules={[{ required: true, message: "联系电话不能为空" }]}
                  name="phone"
                >
                  <Input placeholder="请输入联系电话"></Input>
                </Form.Item>
              </Col>
              <Col span={12} {...layout}>
                <Form.Item
                  label="地址"
                  rules={[{ required: true, message: "地址不能为空" }]}
                  name="address"
                >
                  <Input placeholder="请输入地址"></Input>
                </Form.Item>
              </Col>
              <Col span={12} {...layout}>
                <Form.Item
                  label="购买日期"
                  rules={[{ required: true, message: "购买日期不能为空" }]}
                  name="buyDay"
                >
                  <DatePicker
                    placeholder="请输入购买日期"
                    showTime
                    style={{ width: "100%" }}
                  ></DatePicker>
                </Form.Item>
              </Col>
              <Col span={12} {...layout}>
                <Form.Item
                  label="销售经办人"
                  rules={[{ required: true, message: "销售经办人不能为空" }]}
                  name="manager"
                >
                  <Input placeholder="请输入销售经办人"></Input>
                </Form.Item>
              </Col>
            </>
          ) : (
            <>
              <Col span={12} {...layout}>
                <Form.Item
                  label="死者姓名"
                  rules={[{ required: true, message: "死者姓名不能为空" }]}
                  name="name"
                >
                  <Input placeholder="请输入死者姓名"></Input>
                </Form.Item>
              </Col>
              <Col span={12} {...layout}>
                <Form.Item
                  label="性别"
                  rules={[{ required: true, message: "性别不能为空" }]}
                  name="sex"
                >
                  <Group initialValue="0">
                    <Radio value="1">男</Radio>
                    <Radio value="0">女</Radio>
                  </Group>
                  {/* <Input placeholder='请输入性别'></Input> */}
                </Form.Item>
              </Col>
              <Col span={12} {...layout}>
                <Form.Item
                  label="身份证"
                  rules={[{ required: true, message: "身份证不能为空" }]}
                  name="card"
                >
                  <Input placeholder="请输入身份证"></Input>
                </Form.Item>
              </Col>
              <Col span={12} {...layout}>
                <Form.Item
                  label="村居"
                  rules={[{ required: true, message: "村居不能为空" }]}
                  name="village"
                >
                  <Input placeholder="请输入村居"></Input>
                </Form.Item>
              </Col>
              <Col span={12} {...layout}>
                <Form.Item
                  label="死亡日期"
                  rules={[{ required: true, message: "死完日期不能为空" }]}
                  name="diedDay"
                >
                  <DatePicker
                    placeholder="请输入死完日期"
                    style={{ width: "100%" }}
                  ></DatePicker>
                </Form.Item>
              </Col>
              <Col span={12} {...layout}>
                <Form.Item
                  label="使用日期"
                  rules={[{ required: true, message: "使用日期不能为空" }]}
                  name="useDay"
                >
                  <DatePicker
                    placeholder="请输入使用日期"
                    style={{ width: "100%" }}
                  ></DatePicker>
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
      </Form>
    </Modal>
  );
};

export default Home;
