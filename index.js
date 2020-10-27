const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId  = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.clbh1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("service");
  const feedbackCollection = client.db(`${process.env.DB_NAME}`).collection("feedback");
  
  // INSERT SERVICES AT THE DATABASE
  app.post('/addService', (req, res) => {
    serviceCollection.insertOne(req.body)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  // INSERT FEEDBACK AT THE DATABASE
  app.post('/addFeedback', (req, res) => {
    feedbackCollection.insertOne(req.body)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  // READ ALL SERVICES FROM THE DATABASE
  app.get('/services', (req, res) => {
    serviceCollection.find({})
    .toArray((error, documents) => {
      res.send(documents)
    })
  })

  // READ ALL FEEDBACK FROM THE DATABASE
  app.get('/feedback', (req, res) => {
    feedbackCollection.find({})
    .toArray((error, documents) => {
      res.send(documents)
    })
  })

  //READ A SPEACIFIC SERVICE USING PARAMS
  app.get('/order/:id', (req, res) => {
    serviceCollection.find({_id: ObjectId(req.params.id)})
    .toArray((error, documents) => {
        res.send(documents[0])
    })
  })

});




app.get('/', (req, res) => {
  res.send('Hello Creative agency!');
})

app.listen(`${process.env.DB_PORT}`, () => {
  console.log(`Example app listening at http://localhost:${process.env.DB_PORT}`);
})