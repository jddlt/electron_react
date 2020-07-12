import React, { useState, useEffect } from 'react'
import moment  from 'moment'
import { request } from './../../utils'
import './index.css'
import Login from '../../pages/Login'
import { ConsoleSqlOutlined } from '@ant-design/icons'

const Header = () => {
    const [date, setDate] = useState({ type: '', du: '' })
    const [time, setTime] = useState('')
    let timer = null
    useEffect(async() => {
        const res = await request(`http://wthrcdn.etouch.cn/weather_mini?city=${decodeURI('弋阳')}`, {})
        console.log(res)
        setDate({
            type: res.data.data.forecast[0].type,
            du: `${parseInt((res.data.data.forecast[0].low).replace(/(低温 |高温 )/, ''))}-${parseInt((res.data.data.forecast[0].high).replace(/(低温 |高温 )/, ''))}℃`
        })

    }, [])
    useEffect(() => {
        console.log('我应该执行一次')
        timer = setInterval(() => setTime(moment(new Date()).format('YYYY-MM-DD HH:mm:ss')), 1000)
        return () => clearInterval(timer)
    }, [])
    return (
        <div className='header'>
            <h1>
                弋阳县公墓管理
            </h1>
            <span>尊敬的管理员,现在是{time},天气 {date.type} {date.du}</span>
        </div>
    )
}

export default React.memo(Header)