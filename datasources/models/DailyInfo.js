const mongoose = require('mongoose');

const { Schema } = mongoose;

const dailyInfoSchema = new Schema({
  ticker: String,
  date: String,
  open: Number,
  high: Number,
  low: Number,
  close: Number,
  volume: Number,
});
const DailyInfo = mongoose.model('DailyInfo', dailyInfoSchema);

module.exports = DailyInfo;
