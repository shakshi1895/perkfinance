const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const todoRoutes = express.Router();
const csv = require('csv-parser');  
const fs = require('fs');
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

var pincode_data = []
fs.createReadStream('pincode.csv')  
  .pipe(csv())
  .on('data', (row) => {
    pincode_data.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
});

// app.get('/', (req, res) => res.json(pincode_data))

app.route('/').get(function(req, res) {
    var start_from = req.query['start'];
    var end = req.query['end'];
    pincode_data = pincode_data.sort(function(a, b){return a.pincode - b.pincode});
    var data = {"total": pincode_data.length, "data": pincode_data.splice(start_from, end-start_from)}
    res.json(data)
});

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});


