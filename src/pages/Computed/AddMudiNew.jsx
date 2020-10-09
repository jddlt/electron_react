/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Row,
  Col,
  TreeSelect,
  Radio,
  Button,
  InputNumber,
} from "antd";
import {useHistory } from "react-router-dom";
import moment from "moment";
import { Message, request, filterNoUseParams } from "./../../utils/index";

import "./index.css";
const { Group } = Radio;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export default function () {
  const [areaList, setAreaList] = useState([]);
  const [Default, setDefault] = useState({status: '0'});
  const [hasId, setHasId] = useState(0);
  const handleSubmit = async () => {
    const val = await form.validateFields();
    if (hasId) {
      const res = await request("/updateMudi", {
        method: "POST",
        data: filterNoUseParams({
          ...val,
          diedDay: val.diedDay && moment(val.diedDay).format("YYYY-MM-DD"),
          buyDay:
            val.buyDay && moment(val.buyDay).format("YYYY-MM-DD HH:mm:ss"),
          useDay: val.useDay && moment(val.useDay).format("YYYY-MM-DD"),
          status:
            val.status === "未出售" ? 0 : val.status === "已出售未使用" ? 1 : 2,
        }),
        query: { id: hasId },
      });
      Message(res);
      history.goBack();
    } else {
      const res = await request("/addMudi", {
        method: "POST",
        data: filterNoUseParams({
          ...val,
          diedDay: val.diedDay && moment(val.diedDay).format("YYYY-MM-DD"),
          buyDay:
            val.buyDay && moment(val.buyDay).format("YYYY-MM-DD HH:mm:ss"),
          useDay: val.useDay && moment(val.useDay).format("YYYY-MM-DD"),
        }),
      });
      Message(res);
      history.goBack();
    }
  };
  const extre = (
    <>
      <Button type="primary" onClick={handleSubmit}>
        保存
      </Button>
      <Button onClick={() => history.go(-1)} style={{ marginLeft: "12px" }}>
        返回
      </Button>
    </>
  );
  const [form] = Form.useForm();
  const history = useHistory();

  useEffect(() => {
    const init = async () => {
      const hash = window.location.hash;
      if (hash.includes("#/addMudi?id=")) {
        const id = hash.replace("#/addMudi?id=", "");
        setHasId(id);
        const res = await request("/detailById", { data: { id } });
        const data = res.data.data[0];
        // form.resetFields(res.data.data)
        setDefault({
          ...data,
          buyDay: data.buyDay && moment(data.buyDay),
          diedDay: data.buyDay && moment(data.diedDay),
          useDay: data.buyDay && moment(data.useDay),
          status:
            data.status == 0
              ? "未出售"
              : data.status == 1
              ? "已出售未使用"
              : "已出售已使用",
          type: String(data.type),
          sex: String(data.sex),
        });
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (Default.id) {
      form.resetFields();
    }
  }, [Default]);
  const formatData = (newArr, data) => {
    return newArr.map(i => {
      const child = data.filter(_item => _item.parentId && _item.parentId == i.id).map(item => ({ ...item, title: item.area, value: item.id, children: undefined, parentId: item.parentId, key: item.id }))
      console.log('child', child);
      return {
        ...i,
        children: child.length ? formatData(child, data) : undefined
      }
    })
  }

  const getAreaList = async () => {
    const res = await request("/areaList", {});
    const newArr = []
    res.data.data.forEach(item => {
      if (!item.parentId) newArr.push({...item,  title: item.area, value: item.id, children: undefined, parentId: item.parentId, key: item.id })
    });
    const formaterData = formatData(newArr, res.data.data)
    setAreaList(formaterData);
  };
  const handleFormChange = (e) => {
    console.log(e);
  };

  const handleChange = () => {
    setAreaList([...areaList]);
  };

  useEffect(() => {
    getAreaList();
  }, []);

  return (
    <Card
      className="computed"
      title={
        <span style={{ fontWeight: "bold", overflowY: "hidden" }}>
          添加墓地
        </span>
      }
      bordered={false}
      extra={extre}
    >
      <Form
        form={form}
        initialValues={Default}
        style={{ width: "94%", margin: "0 auto" }}
        onValuesChange={(e) => handleFormChange(e)}
      >
        <Row gutter={24}>
          {/* <Col span={8}>
            <Form.Item
              {...layout}
              label="当前状态"
              initialValues={0}
              rules={[{ required: true, message: "当前状态不能为空" }]}
              name="status"
            >
              <Select placeholder="请选择当前状态" onChange={handleChange}>
                <Select.Option value="0">未出售</Select.Option>
                <Select.Option value="1">已出售未使用</Select.Option>
                <Select.Option value="2">已出售已使用</Select.Option>
              </Select>
            </Form.Item>
          </Col> */}
          <Col span={8}>
            <Form.Item {...layout} label="墓位编号" required>
              <Form.Item
                rules={[{ required: true, message: "排数不能为空" }]}
                name="row"
                style={{
                  display: "inline-block",
                  width: "50%",
                  marginBottom: 0,
                }}
                {...layout}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) => `${value}排`}
                  parser={(value) => value.replace("排", "")}
                />
              </Form.Item>
              <Form.Item
                {...layout}
                rules={[{ required: true, message: "列数不能为空" }]}
                name="columns"
                style={{
                  display: "inline-block",
                  width: "50%",
                  marginBottom: 0,
                }}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) => `${value}列`}
                  parser={(value) => value.replace("列", "")}
                />
              </Form.Item>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...layout}
              label="穴位类型"
              rules={[{ required: true, message: "穴位类型不能为空" }]}
              name="type"
            >
              <Group defaultValue={Default.type}>
                <Radio value="0">单</Radio>
                <Radio value="1">双</Radio>
              </Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...layout}
              label="所在区域"
              rules={[{ required: true, message: "所在区域不能为空" }]}
              name="areaId"
            >
              <TreeSelect
          allowClears
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={areaList}
            placeholder="请选择所在区域"
          />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...layout}
              label="基本价格"
              rules={[{ required: true, message: "基本价格不能为空" }]}
              name="basePrice"
            >
              <Input placeholder="请输入基本价格"></Input>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...layout}
              label="管理费用"
              rules={[{ required: true, message: "管理费用不能为空" }]}
              name="managePrice"
            >
              <Input placeholder="请输入管理费用"></Input>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...layout}
              label="其他费用"
              rules={[{ required: true, message: "其他费用不能为空" }]}
              name="otherPrice"
            >
              <Input placeholder="请输入其他费用"></Input>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...layout}
              label="合计费用"
              rules={[{ required: true, message: "合计费用不能为空" }]}
              name="totalPrice"
            >
              <Input placeholder="请输入合计费用"></Input>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}