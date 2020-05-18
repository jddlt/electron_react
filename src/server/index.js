const express = require('express')
const mysql = require('mysql')
// const bodyParser =require('body-parser') // 没用 很奇怪
const postParams = require('./postParams')
const { mySend, myError } = require('./send')


const app = express()

// app.use(bodyParser.urlencoded({ extended: false }))

//设置允许跨域访问该服务.  //wocao 放前面 md
app.all('*', async function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
  
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '19961023',
    database: 'mudimanage'
})

app.post('/addArea', async(req, res) => {
    const { area } = await postParams(req)
    var SQL = `INSERT INTO area(area) VALUES("${area}")`;
    db.query(SQL, (err) => {
        if (err) {
            myError(res, err)
            return
        }
        mySend(res, { msg: '添加成功' })
        
    })
})

app.get('/areaList', async(req, res) => {
    var SQL = `SELECT * FROM area`;
    db.query(SQL, (err, data) => {
        if (err) {
            myError(res, err)
            return
        }
        mySend(res, { msg: '获取成功', data })
        
    })
})

app.get('/deleteArea', async(req, res) => {
    const { id } = req.query
    var SQL = `DELETE FROM area WHERE id=${id}`;
    db.query(SQL, (err) => {
        if (err) {
            myError(res, err)
            return
        }
        mySend(res, { msg: '删除成功'})
        
    })
})

// app.get('/areaList', () => {
//     const SQL = 'SELECT * FROM mudi'
//     db.query(SQL, (err, res) => console.log(res))
// })
app.post('/addMudi', async(req, res) => {
    const params = await postParams(req)
    const repeatSQL = `SELECT * FROM mudi WHERE (row,columns) = (${params.row},${params.columns})`
    db.query(repeatSQL, (err, data) => {
        if (err) {
            myError(res, err)
            return
        }
        if (data.length > 0) {
            mySend(res, { msg: `${params.row}排${params.columns}列已存在墓穴，重复添加失败`, code: 1000 })
        } else {
            const SQL = `INSERT INTO mudi(${Object.keys(params).join(',')}) VALUES(${Object.values(params).map(item => String(item)).join(',')})`;
            db.query(SQL, (err) => {
                if (err) {
                    myError(res, err)
                    return
                }
                mySend(res, { msg: '添加成功' })
            })
        }
    })
})

app.get('/mudiList', (req, res) => {
    const SQL = 'SELECT * FROM mudi'
    db.query(SQL, (err, data) => {
        if (err) {
            myError(res, err)
            return
        }
        mySend(res, { msg: '获取成功', data })
    })
})

db.connect((err) => {
    if(err) throw err
    console.log('数据库链接成功');
    
})

app.listen(3030)