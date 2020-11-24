const mongoose = require('mongoose')
const Record = require('../record')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

cdb.on('error', () => {
  console.log('mongodb error!');
})

db.once('open', () => {
  console.log('mongodb connected!');
  for (let i = 0; i < 5; i++) {
    Record.create({ name: 'name-' + i, amount: 10 * i });
  }
  console.log('recordSeeder done');
})