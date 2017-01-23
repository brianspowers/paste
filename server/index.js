require('dotenv').config();

const express = require('express');
const Hashids = require('hashids');
const bodyParser = require('body-parser')
const hashIds = new Hashids('seed');
const mongodb = require('mongodb');

const app = express();
const jsonParser = bodyParser.json()

let db;

app.set('port', 3001);

app.get('/api/paste/:token', (req, res) => {
  if (!req.params.token) return res.sendStatus(400);

  var collection = db.collection('documents');
  collection.findOne({ token: req.params.token }, {fields: { _id: 0 }})
  .then(result => {
    if (!result) return res.sendStatus(404);
    res.send(result);
  })
  .catch(err => res.sendStatus(500));
});

app.post('/api/paste', jsonParser, (req, res) => {
  if (!req.body || !req.body.message) return res.sendStatus(400);

  let token = hashIds.encode(Date.now());
  const newPaste = {
    token,
    message: req.body.message,
  }
  const collection = db.collection('documents');
  collection.insertOne(newPaste)
  .then(result => {
    res.send({token});
  })
  .catch(err => {
    return res.sendStatus(500);
  });
});

app.delete('/api/paste/:token', (req, res) => {
  if (!req.params.token) return res.sendStatus(400);
  shredPaste(req.params.token)
  .then(result => {
    res.send(result);
  })
  .catch(err => {
    return res.sendStatus(500);
  })
});

function shredPaste(token, callback) {
  var collection = db.collection('documents');
  return collection.deleteOne({ token });
  
}

let server;
const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`;
mongodb.MongoClient.connect(url)
.then(database => {
  db = database;
  server = app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`);
  });
})
.catch(err => {
  console.error("Unable to connect to database", err);
  process.exit(1);
});

// this function is called when you want the server to die gracefully
// i.e. wait for existing connections
var gracefulShutdown = function() {
  console.log("Received kill signal, shutting down gracefully.");
  if (db) {
    db.close();
  }
  if (server) {
    server.close(function() {
      console.log("Closed out remaining connections.");
      process.exit();
    });
  } else {
      process.exit();   
  }
  
   // if after 
   setTimeout(function() {
       console.error("Could not close connections in time, forcefully shutting down");
       process.exit();
  }, 10*1000);
}

// listen for TERM signal .e.g. kill 
process.on ('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', gracefulShutdown);   