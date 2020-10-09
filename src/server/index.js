const express = require("express");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");
const xlsx = require("node-xlsx");
const fs = require("fs");
// const bodyParser =require('body-parser') // 没用 很奇怪
const postParams = require("./postParams");
const { mySend, myError } = require("./send");

const app = express();
const upload = multer();

// app.use(bodyParser.urlencoded({ extended: false }))

//设置允许跨域访问该服务.  //wocao 放前面 md
app.all("*", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

const db = mysql.createConnection({
  host: "47.102.218.8",
  user: "root",
  password: "mrpzx",
  database: "mudi",
});

app.post("/addArea", async (req, res) => {
  const { area, parentId, layer } = await postParams(req);
  console.log("layer", layer);
  var SQL = `INSERT INTO area(area,parentId,layer) VALUES("${area}",${parentId},"${
    +layer + 1
  }")`;
  db.query(SQL, (err) => {
    if (err) {
      myError(res, err);
      return;
    }
    mySend(res, { msg: "添加成功" });
  });
});

app.get("/areaList", async (req, res) => {
  var SQL = `SELECT * FROM area`;
  db.query(SQL, (err, data) => {
    if (err) {
      myError(res, err);
      return;
    }
    mySend(res, { msg: "获取成功", data });
  });
});

app.get("/deleteArea", async (req, res) => {
  const { id } = req.query;
  var SQL = `DELETE FROM area WHERE id=${id} OR parentId=${id}`;
  db.query(SQL, (err) => {
    if (err) {
      myError(res, err);
      return;
    }
    mySend(res, { msg: "删除成功" });
  });
});

// app.get('/areaList', () => {
//     const SQL = 'SELECT * FROM mudi'
//     db.query(SQL, (err, res) => console.log(res))
// })
app.post("/addMudi", async (req, res) => {
  const params = await postParams(req);
  const repeatSQL = `SELECT * FROM mudi WHERE (row,columns,areaId) = (${params.row},${params.columns},${params.areaId})`;
  db.query(repeatSQL, (err, data) => {
    if (err) {
      myError(res, err);
      return;
    }
    if (data.length > 0) {
      mySend(res, {
        msg: `${params.row}排${params.columns}列已存在墓穴，重复添加失败`,
        code: 1000,
      });
    } else {
      const SQL = `INSERT INTO mudi(${Object.keys(params).join(
        ","
      )}) VALUES(${Object.values(params)
        .map((item) => `"${item}"`)
        .join(",")})`;
      db.query(SQL, (err) => {
        if (err) {
          myError(res, err);
          return;
        }
        mySend(res, { msg: "添加成功" });
      });
    }
  });
});

const formatExcelParama = (data, areaList) => {
  data.unshift("");
  const obj = {
    row: parseInt(data[1]),
    columns: parseInt(data[1].split("排")[1]),
    name: data[2],
    sex: data[3] === "男" ? 1 : 0,
    card: data[4],
    village: data[5],
    diedDay: data[6],
    buyer: data[7],
    phone: data[8],
    address: data[9],
    buyDay: data[10],
    type: data[11] === "双" ? 1 : 0,
    basePrice: data[12],
    managePrice: data[13],
    otherPrice: data[14],
    totalPrice: data[15],
    manager: data[16],
    areaId: areaList.find((item) => item.area === data[17]).id,
    useDay: data[18],
    status: data[19] === "未出售" ? 0 : data[19] === "已出售未入葬" ? 1 : 2,
  };
  return obj;
};

app.post("/importExcel", upload.any(), async (req, res) => {
  const exter = req.files[0].originalname.split(".").pop();
  if (
    exter !== "xlsx" &&
    exter !== "xls" &&
    exter !== "XLSX" &&
    exter !== "XLS"
  ) {
    mySend(res, { msg: `请上传.xlsx .xls文件`, code: 2000 });
  } else {
    fs.writeFile(
      path.resolve(__dirname, "./upload/temp.xlsx"),
      req.files[0].buffer,
      (err) => {
        if (err) {
          myError(res, err);
        }
        const obj = xlsx.parse(path.resolve(__dirname, "./upload/temp.xlsx"));
        try {
          if (
            JSON.stringify(obj[0].data[0]) !==
            JSON.stringify([
              "墓位编号",
              "死者姓名",
              "性别",
              "身份证",
              "村居",
              "死亡日期",
              "购买者",
              "联系电话",
              "地址",
              "购买日期",
              "穴位类型",
              "墓位基价",
              "维护管理费",
              "其它费用",
              "合计费用",
              "售墓经办人",
              "所属区域",
              "入葬日期",
              "墓穴当前销售状态",
            ])
          ) {
            // myError(res, '表头结构错误')
            mySend(res, { msg: `表头结构错误`, code: 2000 });
          } else {
            // 批量上传
            const data = obj[0].data.slice(1);
            db.query(`SELECT * FROM area`, (err, areaList) => {
              if (err) {
                myError(res, err);
                return;
              }
              const errList = [];
              const promiseArr = [];
              for (let i = 0; i < data.length; i++) {
                const params = formatExcelParama(data[i], areaList);
                const repeatSQL = `SELECT * FROM mudi WHERE (row,columns,areaId) = (${params.row},${params.columns},${params.areaId})`;
                promiseArr.push(
                  new Promise((resolve) => {
                    db.query(repeatSQL, (err, data) => {
                      if (err) {
                        myError(res, err);
                        return;
                      }
                      if (data.length > 0) {
                        errList.push(params);
                        resolve();
                      } else {
                        const SQL = `INSERT INTO mudi(${Object.keys(
                          params
                        ).join(",")}) VALUES(${Object.values(params)
                          .map((item) => `"${item}"`)
                          .join(",")})`;
                        db.query(SQL, (err) => {
                          if (err) {
                            myError(res, err);
                            return;
                          }
                          resolve();
                        });
                      }
                    });
                  })
                );
              }
              Promise.all(promiseArr).then(() => {
                if (errList.length) {
                  mySend(res, {
                    msg: `${errList.length}条数据导入失败,可能该位置已存在墓地`,
                    code: 1000,
                    data: errList,
                  });
                } else {
                  mySend(res, { msg: "导入成功" });
                }
              });
            });
          }
        } catch (err) {
          myError(res, err);
        }
      }
    );
  }
});

app.post("/updateMudi", async (req, res) => {
  const params = await postParams(req);
  const { id } = req.query;
  const repeatSQL = `SELECT * FROM mudi WHERE (row,columns,areaId) = (${params.row},${params.columns},${params.areaId}) AND id != ${id}`;
  db.query(repeatSQL, (err, data) => {
    if (err) {
      myError(res, err);
      return;
    }
    if (data.length > 0) {
      mySend(res, {
        msg: `${params.row}排${params.columns}列已存在墓穴，编辑失败`,
        code: 1000,
      });
    } else {
      const SQL = `UPDATE mudi set ${Object.keys(params)
        .map((key) => `${key}="${params[key]}"`)
        .join(",")} WHERE id = ${id}`;
      db.query(SQL, (err, data) => {
        if (err) {
          myError(res, err);
          return;
        }
        mySend(res, { msg: "修改成功" });
      });
    }
  });
});

app.get("/detailById", async (req, res) => {
  const { id } = req.query;
  const SQL = `SELECT * FROM mudi WHERE id=${id}`;
  db.query(SQL, (err, data) => {
    if (err) {
      myError(res, err);
      return;
    }
    mySend(res, { msg: "修改成功", data });
  });
});

app.get("/mudiList", (req, res) => {
  const { id } = req.query;
  const SQL = !id
    ? "SELECT * FROM mudi"
    : Array.isArray(id)
    ? `SELECT * FROM mudi WHERE areaId in (${id.join(",")})`
    : `SELECT * FROM mudi WHERE areaId=${id}`;
  db.query(SQL, (err, data) => {
    if (err) {
      myError(res, err);
      return;
    }
    mySend(res, { msg: "获取成功", data });
  });
});

app.post("/searchMudiList", async (req, res) => {
  const params = await postParams(req);
  const SQL = Object.keys(params).length
    ? `SELECT * FROM mudi WHERE (${Object.keys(params).join(
        ","
      )}) = (${Object.values(params)
        .map((item) => `"${item}"`)
        .join(",")})`
    : "SELECT * FROM mudi";
  db.query(SQL, (err, data) => {
    if (err) {
      myError(res, err);
      return;
    }
    mySend(res, { msg: "获取成功", data });
  });
});

db.connect((err) => {
  if (err) throw err;
  console.log("数据库链接成功");
});

app.listen(3030);
