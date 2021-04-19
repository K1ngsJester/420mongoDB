var express = require('express');
var router = express.Router();

// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");

const CaloriesCalculators = require("../CaloriesCalculators");

// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection
//const dbURI = "mongodb+srv://testUser:0530@mycluster.nee1p.mongodb.net/ToDo?retryWrites=true&w=majority";
const dbURI = "mongodb+srv://ServerUser:12qw1q2w@jestercluster.bkyxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);



/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('index.html');
});

/* GET all ToDos */
router.get('/CaloriesCalculators', function(req, res) {
  // find {  takes values, but leaving it blank gets all}
  CaloriesCalculators.find({}, (err, AllCaloriesCalculators) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(AllCaloriesCalculators);
  });
});




/* post a new ToDo and push to Mongo */
router.post('/NewDay', function(req, res) {

    let oneNewCaloriesCalculator = new CaloriesCalculators(req.body);  // call constuctor in ToDos code that makes a new mongo ToDo object
    console.log(req.body);
    oneNewCaloriesCalculator.save((err, caloriescalculator) => {
      if (err) {
        res.status(500).send(err);
      }
      else {
      console.log(caloriescalculator);
      res.status(201).json(caloriescalculator);
      }
    });
});


router.delete('/DeleteDay/:id', function (req, res) {
  CaloriesCalculators.deleteOne({ _id: req.params.id }, (err, note) => { 
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "Day successfully deleted" });
  });
});


router.put('/UpdateDay/:id', function (req, res) {
  CaloriesCalculators.findOneAndUpdate(
    { _id: req.params.id },
    { day: req.body.day, food: req.body.food, calories: req.body.calories, homemade: req.body.homemade },
   { new: true },
    (err, caloriescalculator) => {
      if (err) {
        res.status(500).send(err);
    }
    res.status(200).json(caloriescalculator);
    })
  });


  /* GET one ToDos */
router.get('/FindDay/:id', function(req, res) {
  console.log(req.params.id );
  CaloriesCalculators.find({ _id: req.params.id }, (err, oneCaloriesCalculator) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(oneCaloriesCalculator);
  });
});

module.exports = router;
