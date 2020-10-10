/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  DatePicker,
  Select,
  Row,
  Col,
  //   RadioGroup,
  TreeSelect,
  Radio,
  Button,
  InputNumber,
  message,
} from "antd";
import { Link, HashRouter, Redirect, useHistory } from "react-router-dom";
// import { history } from 'react-router'
import locale from "antd/es/date-picker/locale/zh_CN";
import moment from "moment";
import { Message, request, filterNoUseParams } from "./../../utils/index";

// import { exportExcel } from 'xlsx-oc'
import "./index.css";
const { Group } = Radio;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export default function () {
  const [show, setShow] = useState(false);
  const [list, setList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  // const [Default, setDefault] = useState({status: '0'});
  const [count , setCount] = useState(0)
  const [hasId, setHasId] = useState(0);
  const handleSubmit = async () => {
    const val = await form.validateFields();
    const vall = await form.getFieldsValue();

    // const val = await form.getFieldsValue()
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
        console.log('data', data);
        // form.resetFields(res.data.data)
        form.resetFields()
        form.setFieldsValue({
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
        // form.setFieldsValue({ status: data.status == 0
        //   ? "未出售"
        //   : data.status == 1
        //   ? "已出售未使用"
        //   : "已出售已使用", })
      }
    };
    init();
  }, [history]);

  // useEffect(() => {
  //   if (Default.id) {
  //     form.resetFields();
  //   }
  // }, [Default]);
  const formatData = (newArr, data) => {
    return newArr.map(i => {
      const child = data.filter(_item => _item.parentId && _item.parentId == i.id).map(item => ({ ...item, title: item.area, value: item.id, children: undefined, parentId: item.parentId, key: item.id }))
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
    setTimeout(() => {
      setCount(count + 1)
      console.log('form.getFieldValue("status")', form.getFieldValue("status"));
    }, 1000)
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
        initialValues={{ status: '0' }}
        style={{ width: "94%", margin: "0 auto" }}
        onValuesChange={(e) => handleFormChange(e)}
      >
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              {...layout}
              label="当前状态"
              // initialvalues='0'
              rules={[{ required: true, message: "当前状态不能为空" }]}
              name="status"
            >
              <Select placeholder="请选择当前状态" onChange={handleChange}>
                <Select.Option value="0">未出售</Select.Option>
                <Select.Option value="1">已出售未使用</Select.Option>
                <Select.Option value="2">已出售已使用</Select.Option>
              </Select>
            </Form.Item>
          </Col>
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
              label="墓地名称"
              rules={[{ required: true, message: "请输入墓地名称" }]}
              name="mudiName"
            >
              <Input placeholder='请输入墓地名称' />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...layout}
              label="墓碑材质"
              rules={[{ required: true, message: "请输入墓碑材质" }]}
              name="material"
            >
              <Input placeholder='请输入墓碑材质' />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...layout}
              label="主碑规格"
              rules={[{ required: true, message: "请输入主碑规格" }]}
              name="size"
            >
              <Input placeholder='请输入主碑规格(大小)' />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...layout}
              label="单价"
              rules={[{ required: true, message: "请输入单价" }]}
              name="basePrice"
            >
              <Input placeholder='请输入单价' />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...layout}
              label="穴位类型"
              rules={[{ required: true, message: "穴位类型不能为空" }]}
              name="type"
            >
              <Group defaultValue={0}>
                <Radio value="0">单</Radio>
                <Radio value="1">双</Radio>
              </Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...layout}
              label="所属区域"
              rules={[{ required: true, message: "所属区域不能为空" }]}
              name="areaId"
            >
              <TreeSelect
              allowClear
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={areaList}
                placeholder="请选择所属区域"
              />
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
          {form.getFieldValue("status") != 0 &&
            form.getFieldValue("status") !== "未出售" && (
              <>
                <Col span={8}>
                  <Form.Item
                    {...layout}
                    label="死者姓名"
                    rules={[{ required: true, message: "死者姓名不能为空" }]}
                    name="name"
                  >
                    <Input placeholder="请输入死者姓名"></Input>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...layout}
                    label="性别"
                    rules={[{ required: true, message: "性别不能为空" }]}
                    name="sex"
                  >
                    <Group defaultValue={1}>
                      <Radio value="1">男</Radio>
                      <Radio value="0">女</Radio>
                    </Group>
                    {/* <Input placeholder='请输入性别'></Input> */}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...layout}
                    label="身份证"
                    rules={[{ required: true, message: "身份证不能为空" }]}
                    name="card"
                  >
                    <Input placeholder="请输入身份证"></Input>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...layout}
                    label="村居"
                    rules={[{ required: true, message: "村居不能为空" }]}
                    name="village"
                  >
                    <Input placeholder="请输入村居"></Input>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...layout}
                    label="死亡日期"
                    rules={[{ required: true, message: "死亡日期不能为空" }]}
                    name="diedDay"
                  >
                    <DatePicker
                      locale={locale}
                      placeholder="请输入死亡日期"
                      style={{ width: "100%" }}
                    ></DatePicker>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...layout}
                    label="购买者"
                    rules={[{ required: true, message: "购买者不能为空" }]}
                    name="buyer"
                  >
                    <Input placeholder="请输入购买者"></Input>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...layout}
                    label="联系电话"
                    rules={[{ required: true, message: "联系电话不能为空" }]}
                    name="phone"
                  >
                    <Input placeholder="请输入联系电话"></Input>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...layout}
                    label="地址"
                    rules={[{ required: true, message: "地址不能为空" }]}
                    name="address"
                  >
                    <Input placeholder="请输入地址"></Input>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...layout}
                    label="购买日期"
                    rules={[{ required: true, message: "购买日期不能为空" }]}
                    name="buyDay"
                  >
                    <DatePicker
                      locale={locale}
                      placeholder="请输入购买日期"
                      showTime
                      style={{ width: "100%" }}
                    ></DatePicker>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...layout}
                    label="销售经办人"
                    rules={[{ required: true, message: "销售经办人不能为空" }]}
                    name="manager"
                  >
                    <Input placeholder="请输入销售经办人"></Input>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...layout}
                    label="使用日期"
                    rules={[{ required: true, message: "使用日期不能为空" }]}
                    name="useDay"
                  >
                    <DatePicker
                      locale={locale}
                      placeholder="请输入使用日期"
                      style={{ width: "100%" }}
                    ></DatePicker>
                  </Form.Item>
                </Col>
              </>
            )}
        </Row>
      </Form>
    </Card>
  );
}

// 直接添加已使用的墓地, 暂时不用
// {form.getFieldValue("status") != 0 &&
//             form.getFieldValue("status") !== "未出售" && (
//               <>
//                 <Col span={8}>
//                   <Form.Item
//                     {...layout}
//                     label="死者姓名"
//                     rules={[{ required: true, message: "死者姓名不能为空" }]}
//                     name="name"
//                   >
//                     <Input placeholder="请输入死者姓名"></Input>
//                   </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                   <Form.Item
//                     {...layout}
//                     label="性别"
//                     rules={[{ required: true, message: "性别不能为空" }]}
//                     name="sex"
//                   >
//                     <Group defaultValue={Default.sex}>
//                       <Radio value="1">男</Radio>
//                       <Radio value="0">女</Radio>
//                     </Group>
//                     {/* <Input placeholder='请输入性别'></Input> */}
//                   </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                   <Form.Item
//                     {...layout}
//                     label="身份证"
//                     rules={[{ required: true, message: "身份证不能为空" }]}
//                     name="card"
//                   >
//                     <Input placeholder="请输入身份证"></Input>
//                   </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                   <Form.Item
//                     {...layout}
//                     label="村居"
//                     rules={[{ required: true, message: "村居不能为空" }]}
//                     name="village"
//                   >
//                     <Input placeholder="请输入村居"></Input>
//                   </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                   <Form.Item
//                     {...layout}
//                     label="死亡日期"
//                     rules={[{ required: true, message: "死亡日期不能为空" }]}
//                     name="diedDay"
//                   >
//                     <DatePicker
//                       locale={locale}
//                       placeholder="请输入死亡日期"
//                       style={{ width: "100%" }}
//                     ></DatePicker>
//                   </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                   <Form.Item
//                     {...layout}
//                     label="购买者"
//                     rules={[{ required: true, message: "购买者不能为空" }]}
//                     name="buyer"
//                   >
//                     <Input placeholder="请输入购买者"></Input>
//                   </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                   <Form.Item
//                     {...layout}
//                     label="联系电话"
//                     rules={[{ required: true, message: "联系电话不能为空" }]}
//                     name="phone"
//                   >
//                     <Input placeholder="请输入联系电话"></Input>
//                   </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                   <Form.Item
//                     {...layout}
//                     label="地址"
//                     rules={[{ required: true, message: "地址不能为空" }]}
//                     name="address"
//                   >
//                     <Input placeholder="请输入地址"></Input>
//                   </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                   <Form.Item
//                     {...layout}
//                     label="购买日期"
//                     rules={[{ required: true, message: "购买日期不能为空" }]}
//                     name="buyDay"
//                   >
//                     <DatePicker
//                       locale={locale}
//                       placeholder="请输入购买日期"
//                       showTime
//                       style={{ width: "100%" }}
//                     ></DatePicker>
//                   </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                   <Form.Item
//                     {...layout}
//                     label="销售经办人"
//                     rules={[{ required: true, message: "销售经办人不能为空" }]}
//                     name="manager"
//                   >
//                     <Input placeholder="请输入销售经办人"></Input>
//                   </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                   <Form.Item
//                     {...layout}
//                     label="使用日期"
//                     rules={[{ required: true, message: "使用日期不能为空" }]}
//                     name="useDay"
//                   >
//                     <DatePicker
//                       locale={locale}
//                       placeholder="请输入使用日期"
//                       style={{ width: "100%" }}
//                     ></DatePicker>
//                   </Form.Item>
//                 </Col>
//               </>
//             )}