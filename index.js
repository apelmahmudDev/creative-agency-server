const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.clbh1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


client.connect(err => {
  const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("service");
  const feedbackCollection = client.db(`${process.env.DB_NAME}`).collection("feedback");
  const orderCollection = client.db(`${process.env.DB_NAME}`).collection("order");
  const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admin");
  
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

  // INSERT ORDER AT THE DATABASE
  app.post('/addOrder', (req, res) => {
    orderCollection.insertOne(req.body)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  // INSERT A ADMIN AT THE DATABASE
  app.post('/admin', (req, res) => {
    adminCollection.insertOne(req.body)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

   // FIND ADMIN
   app.get('/findAdmin', (req, res) => {
    adminCollection.find({email: req.query.email})
    .toArray((error, documents) => {
      if(documents.length){
        res.send(documents[0])
      }
      else{
        console.log('Could not find admin')
      }
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
    .toArray((err, documents) => {
      res.send(documents);
      console.log(err);
    })
  })

  // READ ORDERED SERVICES FOR SPECIFIC CLIENT
  app.get('/clientOrder', (req, res) => {
    orderCollection.find({email: req.query.email})
    .toArray((error, documents) => {
      res.send(documents)
    })
  })

  // READ ALL ORDERED SERVICES FOR ADMIN
  app.get('/orderdServices', (req, res) => {
    orderCollection.find({})
    .toArray((error, documents) => {
      res.send(documents)
    })
  })

  //READ A SPEACIFIC SERVICE USING PARAMS
  app.get('/order/:id', (req, res) => {
    serviceCollection.find({_id: ObjectID(req.params.id)})
    .toArray((error, documents) => {
        res.send(documents[0])
    })
  })

  // ORDER STATUS CHNANGER
  app.patch('/changer/:id', (req, res) => {
    orderCollection.updateOne({_id: ObjectID(req.params.id)},
      {
        $set: {status: req.body.value}
      })
      .then(result => {
        res.send(result.modifiedCount > 0);
      })
  })

});

app.get('/', (req, res) => {
  res.send('Hello Creative agency!');
})

app.listen(process.env.PORT || 4200);