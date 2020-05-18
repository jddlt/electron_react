import React, { useState, useEffect } from 'react';
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
} from 'antd'
import { Link } from 'react-router-dom'
// import { exportExcel } from 'xlsx-oc'
import './index.css';
import { request } from './../../utils/index';

const { Option } = Select


export default () => {
  const [list, setList] = useState([])
  const [areaList, setAreaList] = useState([])

  const downloadExcel = () => {
    // //列标题，逗号隔开，每一个逗号就是隔开一个单元格
    // let str = `名称,地址,出售日期,家属电话,所属区域,状态\n`;
    // //增加\t为了不让表格显示科学计数法或者其他格式
    // for(let i = 0 ; i < dataSource.length ; i++ ){
    //   for(let item in dataSource[i]){
    //     if (item === 'status') {
    //       str+=`${['未出售', '未使用', '使用中'][(dataSource[i][item])] + '\t'},`;   
    //     } else {
    //       str+=`${dataSource[i][item] + '\t'},`;     
    //     }
    //   }
    //   str+='\n';
    // }
    // //encodeURIComponent解决中文乱码
    // let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
    // //通过创建a标签实现
    // var link = document.createElement("a");
    // link.href = uri;
    // //对下载的文件命名
    // link.download = "墓地列表.xlsx";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // // exportExcel(
    // //   columns.slice(0, 5).map(item => ({ k: item.dataIndex, v: item.title })),
    // //   dataSource,
    // //   '列表.xlsx'
    // // )
  }
  useEffect(() => {getMudiList()}, [])

  const getMudiList = async() => {
    const res = await request('/mudiList', {})
    console.log(res);
    
    setList(res.data.data)
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: '100',
      // fixed: 'left'
    },
    {
      title: '墓位编号',
      key: 'row',
      // fixed: 'left',
      render: (_, record) => (
        <div>{record.row}排{record.columns}号</div>
      )
    },
    {
      title: '死者姓名',
      dataIndex: 'name',
      key: 'name',
      render: h => h || '-'
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render: h => h || '-'
    },
    {
      title: '身份证',
      dataIndex: 'card',
      key: 'card',
      render: h => h || '-'
    },
    {
      title: '村居',
      dataIndex: 'village',
      key: 'village',
      render: h => h || '-'
    },
    {
      title: '死亡日期',
      dataIndex: 'diedDay',
      key: 'diedDay',
      render: h => h || '-'
    },
    {
      title: '购买者',
      dataIndex: 'buyPeople',
      key: 'buyPeople',
      render: h => h || '-'
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      render: h => h || '-'
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      render: h => h || '-'
    },
    {
      title: '购买日期',
      dataIndex: 'buyDay',
      key: 'buyDay',
      render: h => h || '-'
    },
    {
      title: '穴位类型',
      dataIndex: 'type',
      key: '穴位类型',
      render: h => (<div>{ h ? '双' : '单'}</div>)
    },
    {
      title: '墓位基价',
      dataIndex: 'basePrice',
      key: 'basePrice',
      render: h => h || '-'
    },
    {
      title: '维护管理费',
      dataIndex: 'managePrice',
      key: 'managePrice',
      render: h => h || '-'
    },
    {
      title: '其它费用',
      dataIndex: 'otherPrice',
      key: 'otherPrice',
      render: h => h || '-'
    },
    {
      title: '合计费用',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: h => h || '-'
    },
    {
      title: '售墓经办人',
      dataIndex: 'manager',
      key: 'manager',
      render: h => h || '-'
    },
    {
      title: '所属区域',
      dataIndex: 'areaId',
      key: 'areaId',
      render: h => (
        <div>{ (areaList.find(item => item.id === h) || {}).area || '-' }</div>
      )
    },
    {
      title: '入葬日期',
      dataIndex: 'useDay',
      key: 'useDay',
      render: h => h || '-'
    },
    {
      title: '墓穴当前销售状态',
      dataIndex: 'status',
      key: 'status',
      // fixed: 'right',
      render: h => (
        [
          <Tag>未出售</Tag>,
          <Tag color="blue">已销售未入葬</Tag>,
          <Tag color="green">已销售已入葬</Tag>,
        ][h]
      )
    },
    {
      title: '操作',
      dataIndex: 'status',
      // fixed: 'right',
      render: h => (
        <>
          {/* { h === 0 && <Button type='link' style={{ color: 'green', padding: 0 }} onClick={() => message.success('售出成功')}>售出</Button> }
          { h === 1 && <Button type='link' style={{ color: 'blue', padding: 0}} onClick={() => message.info('使用成功')}>使用</Button> }
          { h !== 2 && <Divider type="vertical" /> } */}
          <a href="javascript:;" onClick={() => {}}>编辑</a>
        </>
      )
    }
  ].map(item => ({...item, align: 'center'}))

  const extre = (
    <>
        <Link to='/addMudi'><Button type="primary">添加</Button></Link>
        <Link to='/home'><Button type='info' style={{ marginLeft: '10px' }}>返回</Button></Link>
    </>
  )

  return (
    <Card className='computed' title="列表统计" bordered={false} extra={ extre }>
      <Form style={{margin: '15px 0 20px 0', padding: '15px 0'}}>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="墓地状态">
              <Select placeholder='请选择状态'>
                <Option>未出售</Option>
                <Option>已出售</Option>
                <Option>未使用</Option>
                <Option>使用中</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="区域管理">
              <Select placeholder="请选择区域">
                <Option>区一</Option>
                <Option>区二</Option>
                <Option>区三</Option>
                <Option>区四</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="家属电话">
              <Input placeholder='请输入电话'></Input>
            </Form.Item>
          </Col>
          <Col span={6} style={{textAlign: 'right'}}>
            <Button type="primary" onClick={() => message.info('查不到啊')}>查询</Button>
            <Button type="info" style={{ marginLeft: '16px' }} onClick={ downloadExcel }>导出Excel</Button>
          </Col>
        </Row>
        {/* <Row gutter={24}>
        </Row> */}
      </Form>

      <Table columns={columns} dataSource={list} scroll={{x: 'max-content'}} bordered/>
      {/* <Link to='/home'><Button type='info' style={{position: 'relative', top: '-48px'}}>返回</Button></Link> */}
    </Card>
  )
}