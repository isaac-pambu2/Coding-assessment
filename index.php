// in db.js
const mongoose = require('mongoose');

const dbUri = process.env.MONGODB_URI;

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const drinkChoiceSchema = new mongoose.Schema({
  inputs: {
    type: Map,
    of: String,
  },
  decision: String,
}, { timestamps: true });

const DrinkChoice = mongoose.model('DrinkChoice', drinkChoiceSchema);

module.exports = { DrinkChoice };
