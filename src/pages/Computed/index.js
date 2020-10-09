/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Button,
  Select,
  message,
  Input,
  Tag,
  Table,
  Divider,
  Upload,
  TreeSelect,
} from "antd";
import { Link } from "react-router-dom";
import ExportJsonExcel from "js-export-excel";
import ReactEcharts from "./Echarts";
// import { exportExcel } from 'xlsx-oc'
import "./index.css";
import { request, filterNoUseParams } from "./../../utils/index";

const { Option } = Select;

export default () => {
  const [list, setList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [showEcharts, setShowEcharts] = useState(false);

  const sellType = {
    0: '付费购买',
    1: '免费迁入',
    2: '免费无偿'
  }

  const downloadExcel = (myList = false, name) => {
    const option = {};
    const mylist = myList || list;
    console.log(mylist);
    let dataTable = mylist.map((val) => {
      let obj = {};
      for (let i = 0; i < columns.length - 1; i++) {
        const item = columns[i];
        if (item.title === "墓位编号") {
          obj[item.title] = val.row + "排" + val.columns + "号";
        } else if (item.title === "穴位类型") {
          obj[item.title] = val.type ? "双" : "单";
        } else if (item.title === "所属区域") {
          obj[item.title] =
            (areaList.find((item2) => item2.id === val.areaId) || {}).area ||
            "-";
        } else if (item.title === "墓穴当前销售状态") {
          obj[item.title] =
            val.status == 0
              ? "未出售"
              : val.status == 1
              ? "已出售未入葬"
              : "已销售已入葬";
        } else if (item.title === "性别") {
          obj[item.title] = val.sex ? "女" : "男";
        } else {
          obj[item.title] = val[item.dataIndex];
        }
      }
      return obj;
    });
    console.log(dataTable);
    option.fileName = name || "墓地列表";
    option.datas = [
      {
        sheetData: dataTable,
        sheetName: "sheet",
        sheetFilter: columns
          .slice(myList ? 1 : 0, -1)
          .map((item) => item.title),
        sheetHeader: columns
          .slice(myList ? 1 : 0, -1)
          .map((item) => item.title),
      },
    ];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };

  const preview = () => {
    const bdhtml = window.document.body.innerHTML; //获取当前页的html代码
    const sprnstr = "/* startprint */"; //设置打印开始区域
    const eprnstr = "<!--endprint-->"; //设置打印结束区域
    let prnhtml = bdhtml.substring(bdhtml.indexOf(sprnstr) + 18); //从开始代码向后取html
    prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr)); //从结束代码向前取html
    window.document.body.innerHTML = prnhtml;
    window.print();
    window.document.body.innerHTML = bdhtml;
  };

  useEffect(() => {
    getMudiList();
  }, []);

  const getMudiList = async () => {
    setLoading(true);
    const res = await request("/mudiList", {});
    setList(res.data.data);
    setLoading(false);
  };

  const getAreaList = async () => {
    const res = await request("/areaList", {});
    const newArr = [];
    res.data.data.forEach((item) => {
      if (!item.parentId)
        newArr.push({
          ...item,
          title: item.area,
          value: item.id,
          children: undefined,
          parentId: item.parentId,
          key: item.id,
        });
    });
    const formaterData = formatData(newArr, res.data.data);
    setAreaList(formaterData);
  };
  const formatData = (newArr, data) => {
    return newArr.map((i) => {
      const child = data
        .filter((_item) => _item.parentId && _item.parentId == i.id)
        .map((item) => ({
          ...item,
          title: item.area,
          value: item.id,
          children: undefined,
          parentId: item.parentId,
          key: item.id,
        }));
      console.log("child", child);
      return {
        ...i,
        children: child.length ? formatData(child, data) : undefined,
      };
    });
  };

  const importExcel = (e) => {
    const formData = new FormData();
    formData.append("files", e.file);
    request("/importExcel", { method: "POST", data: formData }).then((res) => {
      if (res.data.code === 200) {
        message.success("导入成功");
      } else if (res.data.code === 1000) {
        downloadExcel(res.data.data, "导入失败列表");
        message.error(res.data.msg);
      } else {
        message.error(res.data.msg);
      }
    });
  };

  useEffect(() => {
    getAreaList();
  }, []);

  const columns = [
    {
      title: "序号",
      dataIndex: "id",
      key: "id",
      width: 100,
      fixed: "left",
    },
    {
      title: "墓地名称",
      dataIndex: "mudiName",
      width: 150,
    },
    {
      title: "墓位编号",
      key: "row",
      width: 100,
      render: (_, record) => (
        <div>
          {record.row}排{record.columns}号
        </div>
      ),
    },
    {
      title: "墓碑材质",
      dataIndex: "material",
      width: 150,
    },
    {
      title: "主碑规格",
      dataIndex: "size",
      width: 150,
    },
    {
      title: "穴位类型",
      dataIndex: "type",
      width: 100,
      key: "穴位类型",
      render: (h) => <div>{h ? "双" : "单"}</div>,
    },
    {
      title: "购买性质",
      dataIndex: "sellType",
      width: 120,
      render: (h) => sellType[h],
    },
    {
      title: "购买价格",
      dataIndex: "sellPrice",
      width: 100,
      render: (h) => h || 0,
    },
    {
      title: "墓地单价",
      dataIndex: "basePrice",
      width: 100,
      key: "basePrice",
      render: (h) => h || "-",
    },
    {
      title: "维护管理费",
      dataIndex: "managePrice",
      width: 120,
      key: "managePrice",
      render: (h) => h || "-",
    },
    {
      title: "其它费用",
      dataIndex: "otherPrice",
      width: 100,
      key: "otherPrice",
      render: (h) => h || "-",
    },
    {
      title: "合计费用",
      dataIndex: "totalPrice",
      width: 100,
      key: "totalPrice",
      render: (h) => h || "-",
    },
    {
      title: "死者姓名",
      dataIndex: "name",
      key: "name",
      width: 100,
      render: (h) => h || "-",
    },
    {
      title: "性别",
      dataIndex: "sex",
      key: "sex",
      width: 100,
      render: (h) => (h || h ? "男" : "女"),
    },
    {
      title: "身份证",
      dataIndex: "card",
      key: "card",
      width: 200,
      render: (h) => h || "-",
    },
    {
      title: "村居",
      dataIndex: "village",
      key: "village",
      width: 200,
      render: (h) => h || "-",
    },
    {
      title: "死亡日期",
      dataIndex: "diedDay",
      key: "diedDay",
      width: 200,
      render: (h) => h || "-",
    },
    {
      title: "购买者",
      dataIndex: "buyer",
      key: "buyer",
      width: 100,
      render: (h) => h || "-",
    },
    {
      title: "联系电话",
      dataIndex: "phone",
      width: 150,
      key: "phone",
      render: (h) => h || "-",
    },
    {
      title: "地址",
      dataIndex: "address",
      width: 250,
      key: "address",
      render: (h) => h || "-",
    },
    {
      title: "购买日期",
      dataIndex: "buyDay",
      width: 200,
      key: "buyDay",
      render: (h) => h || "-",
    },
    {
      title: "售墓经办人",
      dataIndex: "manager",
      width: 120,
      key: "manager",
      render: (h) => h || "-",
    },
    {
      title: "所属区域",
      dataIndex: "areaId",
      width: 100,
      key: "areaId",
      render: (h) => (
        <div>{(areaList.find((item) => item.id === h) || {}).area || "-"}</div>
      ),
    },
    {
      title: "入葬日期",
      dataIndex: "useDay",
      width: 200,
      key: "useDay",
      render: (h) => h || "-",
    },
    {
      title: "墓穴当前销售状态",
      dataIndex: "status",
      width: 150,
      key: "status",
      fixed: "right",
      render: (h) =>
        [
          <Tag>未出售</Tag>,
          <Tag color="blue">已销售未入葬</Tag>,
          <Tag color="green">已销售已入葬</Tag>,
        ][h],
    },
    {
      title: "操作",
      dataIndex: "status",
      width: 100,
      fixed: "right",
      render: (_, r) => (
        <>
          {/* { h === 0 && <Button type='link' style={{ color: 'green', padding: 0 }} onClick={() => message.success('售出成功')}>售出</Button> }
          { h === 1 && <Button type='link' style={{ color: 'blue', padding: 0}} onClick={() => message.info('使用成功')}>使用</Button> }
          { h !== 2 && <Divider type="vertical" /> } */}
          <Link to={`/addMudi?id=${r.id}`}>
            <Button type="primary">编辑</Button>
          </Link>
        </>
      ),
    },
  ].map((item) => ({ ...item, align: "center" }));

  const extre = (
    <>
      <Button onClick={() => setShowEcharts(true)} type="primary">
        总览
      </Button>
      <Button
        type="info"
        style={{ marginLeft: "8px" }}
        onClick={() => downloadExcel("")}
      >
        导出Excel
      </Button>
      <Button
        type="info"
        style={{ marginLeft: "8px" }}
        onClick={() => downloadExcel([], "Excel模板")}
      >
        下载Excel模板
      </Button>
      <Upload
        beforeUpload={() => false}
        onChange={importExcel}
        showUploadList={false}
      >
        <Button type="info" style={{ marginLeft: "8px" }}>
          导入Excel
        </Button>
      </Upload>
    </>
  );
  const closeVisible = () => {
    setShowEcharts(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const val = await form.getFieldsValue();
    const res = await request("/searchMudiList", {
      method: "POST",
      data: filterNoUseParams({ ...val }),
    });
    setCurrent(1);
    setList(res.data.data);
    setLoading(false);
  };

  return (
    <Card className="computed" title="墓地列表" bordered={false} extra={extre}>
      {/* <div style={{ padding: "15px" }}> */}
      <Form style={{ margin: "3px 0 15px 0", padding: "10px 0" }} form={form}>
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item label="墓地状态" name="status">
              <Select placeholder="请选择状态" allowClear>
                <Option value="0">未出售</Option>
                <Option value="1">已出售未使用</Option>
                <Option value="2">已出售已使用</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="区域管理" name="areaId">
              {/* <Select placeholder="请选择区域" allowClear>
                {areaList.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.area}
                  </Option>
                ))}
              </Select> */}
              <TreeSelect
                allowClears
                style={{ width: "100%" }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                treeData={areaList}
                placeholder="请选择区域"
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="死者姓名" name="name">
              <Input placeholder="请输入死者姓名"></Input>
            </Form.Item>
          </Col>
          <Col span={9} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{ marginRight: "12px" }}
            >
              查询
            </Button>
            <Link to="/addMudi">
              <Button>添加</Button>
            </Link>
          </Col>
        </Row>
        {/* <Row gutter={24}>
          <Col span={24}>
            
          </Col>
        </Row> */}
      </Form>
      {/* startprint */}
      <Table
        columns={columns}
        loading={loading}
        dataSource={list}
        scroll={{ x: 'max-contant' }}
        bordered
        rowKey="id"
        pagination={{
          showTotal: (h) => `共计${h}条`,
          total: list.length,
          current: current,
          onChange: ({ current }) => setCurrent(current),
          pageSize: 5,
          showSizeChanger: false,
        }}
      />
      {/* endprint */}
      {/* <Link to='/home'><Button type='info' style={{position: 'relative', top: '-48px'}}>返回</Button></Link> */}
      <ReactEcharts visible={showEcharts} closeVisible={closeVisible} />
    </Card>
  );
};
