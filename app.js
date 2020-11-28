const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser');
const Record = require('./models/record');
const { findById } = require('./models/record');
const app = express()

const categoryList = ['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他'];
const imageList = [
  'fa-home',
  'fa-shuttle-van',
  'fa-grin-beam',
  'fa-utensils',
  'fa-pen',
]

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res) => {
  Record.find()
    .lean()
    .then((records) => {
      let totalAmount = 0;
      for (let record of records) {
        totalAmount += record.amount;
      }
      res.render('index', { records, totalAmount });
    })
    .catch(error => console.error(error))
})

//Create
app.get('/records/new', (req, res) => {
  return res.render('new')
})
app.post('/records', (req, res) => {
  console.log('req.body:', req.body)
  const record = req.body;
  let index = categoryList.findIndex((item) => item === record.category);
  record.image = imageList[index];
  return Record.create(record)
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error));
})

//Update
app.get('/records/:id/edit', (req, res) => {
  const id = req.params.id
  Record.findById(id)
    .lean()
    .then((record) => {
      const categoryTrue = categoryList.map((item) => item === record.category)
      res.render('edit', {
        record,
        category0: categoryTrue[0],
        category1: categoryTrue[1],
        category2: categoryTrue[2],
        category3: categoryTrue[3],
        category4: categoryTrue[4],
      })
    })
})
app.post('/records/:id/edit', (req, res) => {
  const id = req.params.id
  const editRecord = req.body
  let index = categoryList.findIndex((item) => item === editRecord.category)
  editRecord.image = imageList[index];
  return Record.findById(id)
    .then((record) => {
      record = Object.assign(record, editRecord)
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

//DELETE
app.get('/records/:id/delete', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//sort category
app.get('/sort/:category', (req, res) => {
  const category = req.params.category
  Record.find({ category })
    .lean()
    .then((records) => {
      let totalAmount = 0;
      for (let record of records) {
        totalAmount += record.amount;
      }
      res.render('index', { records, totalAmount })
    })
    .catch((error) => console.log(error))
})

app.listen(3000, () => {
  console.log('App is running on httpL//localhost:3000')
})
