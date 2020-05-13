import React from 'react';
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

const { Option } = Select
// const { Col } = Row

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '所属区域',
    dataIndex: 'area',
    key: 'area'
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '出售日期',
    dataIndex: 'data',
    key: 'data'
  },
  {
    title: '家属电话',
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: h => (
      [
        <Tag>未出售</Tag>,
        <Tag color="blue">未使用</Tag>,
        <Tag color="green">使用中</Tag>,
      ][h]
    )
  },
  {
    title: '操作',
    dataIndex: 'status',
    render: h => (
      <>
        { h === 0 && <Button type='link' style={{ color: 'green', padding: 0 }} onClick={() => message.success('售出成功')}>售出</Button> }
        { h === 1 && <Button type='link' style={{ color: 'blue', padding: 0}} onClick={() => message.success('使用成功')}>使用</Button> }
        { h !== 2 && <Divider type="vertical" /> }
        <Button type='link' style={{ color: 'red', padding: 0}} onClick={() => message.success('删除成功')}>删除</Button>
      </>
    )
  }
].map(item => ({...item, align: 'center'}))

const dataSource = [
  {
    name: '景泰院',
    address: '上海市闵行区银都路',
    data: '2020-10-23 12:23:35',
    phone: '134790237897',
    area: '区一',
    status: 0
  },
  {
    name: '梅院一居',
    address: '上海市闵行区靖江乐园',
    data: '2019-10-01 12:23:35',
    phone: '18720172556',
    area: '区四',
    status: 1
  },
  {
    name: '花好月圆',
    address: '上海市闵行区银都路',
    data: '2020-10-23 12:23:35',
    phone: '134790237897',
    area: '区一',
    status: 1
  },
  {
    name: '花好月圆',
    address: '上海市闵行区银都路',
    data: '2020-10-23 12:23:35',
    phone: '134790237897',
    area: '区三',
    status: 2
  }
]


export default () => {
  const downloadExcel = () => {
    //列标题，逗号隔开，每一个逗号就是隔开一个单元格
    let str = `名称,地址,出售日期,家属电话,所属区域,状态\n`;
    //增加\t为了不让表格显示科学计数法或者其他格式
    for(let i = 0 ; i < dataSource.length ; i++ ){
      for(let item in dataSource[i]){
        if (item === 'status') {
          str+=`${['未出售', '未使用', '使用中'][(dataSource[i][item])] + '\t'},`;   
        } else {
          str+=`${dataSource[i][item] + '\t'},`;     
        }
      }
      str+='\n';
    }
    //encodeURIComponent解决中文乱码
    let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
    //通过创建a标签实现
    var link = document.createElement("a");
    link.href = uri;
    //对下载的文件命名
    link.download = "墓地列表.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // exportExcel(
    //   columns.slice(0, 5).map(item => ({ k: item.dataIndex, v: item.title })),
    //   dataSource,
    //   '列表.xlsx'
    // )
  }

  return (
    <Card className='computed' title="列表统计" bordered={false}>
      <Form style={{margin: '15px 0 20px 0', padding: '15px 0'}}>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="状态">
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

      <Table columns={columns} dataSource={dataSource} />
      <Link to='/home'><Button type='info' style={{position: 'relative', top: '-48px'}}>返回</Button></Link>
    </Card>
  )
}