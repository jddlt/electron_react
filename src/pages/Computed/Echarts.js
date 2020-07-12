import React, { useState, useEffect, useRef } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import { 
    Modal,
    Button
} from 'antd'
import { request } from './../../utils/index';


export default (props) => {
  const [option, setOption] = useState({})
  const [list, setList] = useState([])
  const option_1 = {
    title: {
        text: '墓地状态一览',
        x: 'center',
        itemGap: 30,
        // backgroundColor: '#EEE',
        textStyle: {
          fontSize: 26,
          fontWeight: 'bolder',
          color: '#000080'
        },
    },
    series : [
        {
            name: '墓地状态一览',
            type: 'pie',    
            radius: ['30%', '60%'],  
            data:[          
                {value: list[0], name:'未出售'},
                {value: list[1], name:'已出售未使用'},
                {value: list[2], name:'已出售已使用'},
            ],
            itemStyle: {
                // emphasis：英文意思是 强调;着重;（轮廓、图形等的）鲜明;突出，重读
                // emphasis：设置鼠标放到哪一块扇形上面的时候，扇形样式、阴影
                emphasis: {
                  shadowBlur: 5,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(30, 144, 255，0.5)'
                },
                normal:{ 
                  label:{ 
                      show: true, 
                      formatter: '{b} : {c}' 
                  }, 
                  fontSize: 16,
                  labelLine :{show:true} 
              } 
              },
        }
    ],
    color: ['#7EC0EE', '#FF9F7F', '#FFD700', '#C9C9C9', '#E066FF', '#C0FF3E'],
    legend: {
        orient: 'horizontal',
        x: 'center',
        y: 'bottom',
        itemWidth: 24,   // 设置图例图形的宽
        itemHeight: 18,  // 设置图例图形的高
        textStyle: {
          color: '#666'  // 图例文字颜色
        },
        itemGap: 30,
        backgroundColor: '#eee',  // 设置整个图例区域背景颜色
        data: ['未出售','已出售未使用','已出售已使用']
      },
    tooltip: {
        trigger: 'item',
        backgroundColor: '#40a9ff',  // 提示框背景颜色
        textStyle: {
          fontSize: '16px',
          color: '#fff'  // 设置文本颜色 默认#FFF
        },
        formatter: '{a} <br/>{b} : {c}个 ({d}%)'
      }
  }
  const option_2 = {

  }
    useEffect(() => {
        request('/mudiList', {}).then(res => {
            setList([
                res.data.data.filter(item => item.status === 0).length,
                res.data.data.filter(item => item.status === 1).length,
                res.data.data.filter(item => item.status === 2).length
            ])
        })
    }, [])

    useEffect(() => {
        setOption(option_1)
    }, [list])
  const { visible, closeVisible } = props
  const title = (
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <span>统览</span>
        <div>
            <Button type='primary' onClick={closeVisible}>关闭</Button>
            {/* <Button type='primary' style={{marginLeft: '12px'}}  onClick={() => {setOption(option_2)}}>近期出售</Button> */}
        </div>
      </div>
  )
  return (
    <Modal
        title={title}
        visible={visible}
        width={548}
        closable={false}
        style={{textAlign: 'center'}}
        okText='确定'
        cancelText='关闭'
        onCancel={closeVisible}
        footer={() => null}
        maskClosable={false}
    >
        <ReactEcharts option={option} style={{width: '500px', height: '500px'}}/>
        {/* <div ref={echartref}></div> */}
    </Modal>
  )
}