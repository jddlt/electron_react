/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import { Card, Form, Button, message, Input, Table, Modal, Select, TreeSelect  } from "antd";
import { Link } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { request } from "./../../utils/index";
// import { exportExcel } from 'xlsx-oc'
import "./index.css";

const { Option } = Select

export default () => {
  const [show, setShow] = useState(false);
  const [list, setList] = useState([]);
  const originListRef = useRef([])
  const [form] = Form.useForm();

  const columns = [
    {
      title: "区域名称",
      dataIndex: "area",
      width: 300,
      align: 'left'
    },
    {
      title: "区域id",
      dataIndex: "id",
    },
    {
      title: "层级",
      dataIndex: "layer",
    },
    {
      title: "操作",
      dataIndex: "id",
      render: (h) => (
        <>
          {/* <a href='javascript:;' onClick={() => message.error('删除成功')}>编辑</a>
            <Divider type="vertical" /> */}
          <a
            href="javascript:;"
            style={{ color: "red" }}
            onClick={() => deleteArea(h)}
          >
            删除
          </a>
        </>
      ),
    },
  ].map((item) => ({ ...item, align: item.align || "center" }));

  const getAreaList = async () => {
    const res = await request("/areaList", {});
    const newArr = []
    res.data.data.forEach(item => {
      if (!item.parentId) newArr.push({...item,  title: item.area, value: item.id, children: undefined, parentId: item.parentId, key: item.id })
    });
    originListRef.current = res.data.data
    const formaterData = formatData(newArr, res.data.data)
    console.log('formaterData', formaterData);
    setList(formaterData);
  };

  const deleteArea = async (id) => {
    Modal.confirm({
      title: "警告",
      content: "是否确认删除改区域",
      icon: <ExclamationCircleOutlined />,
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        console.log('2333', originListRef.current.filter(i => i.parentId == id).map(i => i.id).concat(id));
        const list = await request("/mudiList", { data: { id: originListRef.current.filter(i => i.parentId == id).map(i => i.id).concat(id) } });
        if (list.data.data && list.data.data.length) {
          message.error(`删除失败,该区域下拥有${list.data.data.length}块墓地`);
        } else {
          const res = await request("/deleteArea", { params: { id } });
          message.success(res.data.msg);
          getAreaList();
        }
      },
    });
  };
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


  // const findChild = (newArr, data) => {
  //   for (let i = 0; i < newArr.length; i++) {
  //     const item = newArr[i]
  //     const child = data.filter(_item => _item.parentId == item.id).map(item => ({ title: item.area, value: item.id, children: [] }))
  //     item.children.concat(child)
  //     return findChild(child, data)
  //   }
  // }

  useEffect(() => {
    getAreaList();
  }, []);

  const extre = (
    <>
      <Button onClick={() => {
        form.resetFields()
        setShow(true)
      }} type="primary">
        添加
      </Button>
    </>
  );
  const handleOk = async () => {
    const val = await form.validateFields();
    console.log('val', val);
    const res = await request("/addArea", {
      method: "POST",
      data: { area: val.area, parentId: val.parentId || null, layer: originListRef.current.find(i => i.id == val.parentId).layer || 0 },
    });
    getAreaList();
    setShow(false);
    message.success(res.data.msg);
  };
  const MyModal = () => (
    <Modal
      title={`添加区域`}
      visible={show}
      onOk={handleOk}
      onCancel={() => setShow(false)}
      cancelText="取消"
      okText="确定"
      width="350px"
    >
      <Form form={form}>
        <Form.Item
          label="区域名"
          rules={[{ required: true, message: "区域名称不能为空" }]}
          name="area"
        >
          <Input placeholder="请输入区域名称"></Input>
        </Form.Item>
      </Form>
      <Form form={form}>
        <Form.Item
          label="上级区域"
          // rules={[{ required: true, message: "区域名称不能为空" }]}
          name="parentId"
        >
          <TreeSelect
          allowClears
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={list}
            placeholder="选择上级区域"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
  return (
    <Card
      className="computed"
      title={<span style={{ fontWeight: "bold" }}>列表统计</span>}
      bordered={false}
      extra={extre}
    >
      <Table columns={columns} dataSource={list} bordered pagination={false} />
      <MyModal />
    </Card>
  );
};
