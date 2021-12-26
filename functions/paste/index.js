console.log(require('dotenv').config());

const Hashids = require('hashids');
const hashIds = new Hashids('seed');
const { Db, MongoClient } = require('mongodb');
const encryption = require('./encryption-helper');

/**
 *
 * @param {Db} db
 * @param {string} pasteId
 * @returns
 */
async function getPaste(db, pasteId) {
  if (!pasteId) {
    return {
      statusCode: 500,
    };
  }

  var collection = db.collection('documents');
  try {
    const result = await collection.findOne(
      { token: pasteId },
      { fields: { _id: 0 } }
    );
    if (result) {
      if (result.encrypted) {
        result.message = encryption.decrypt(result.message);
      }
      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
    };
  }
  return {
    statusCode: 404,
  };
}

/**
 *
 * @param {Db} db
 * @param {*} paste
 * @returns
 */
async function createPaste(db, paste) {
  if (!paste || !paste.message) return { statusCode: 400 };

  let token = hashIds.encode(Date.now());
  const newPaste = {
    token,
    encrypted: 1,
    message: encryption.encrypt(paste.message),
  };
  const collection = db.collection('documents');
  try {
    await collection.insertOne(newPaste);
    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (err) {
    console.error(err);
  }
  return {
    statusCode: 500,
  };
}

/**
 *
 * @param {Db} db
 * @param {string} pasteId
 * @returns
 */
async function deletePaste(db, pasteId) {
  if (!pasteId) return { statusCode: 400 };
  try {
    var collection = db.collection('documents');
    await collection.deleteOne({ token: pasteId });
    return { statusCode: 200 };
  } catch (err) {
    console.error(err);
  }
  return { statusCode: 500 };
}

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let db;
  const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?ssl=true&replicaSet=${process.env.DB_REPLICA_SET}&authSource=admin&retryWrites=true&w=majority`;

  try {
    const client = new MongoClient(url);
    await client.connect();
    MongoClient.connect(url);
    db = client.db(process.env.DB_NAME);
  } catch (err) {
    console.error('Unable to connect to database', err);
    process.exit(1);
  }

  switch (event.httpMethod) {
    case 'GET':
      const { id: pasteId } = event.queryStringParameters;
      return getPaste(db, pasteId);
    case 'POST':
      return createPaste(db, JSON.parse(event.body));
    case 'DELETE':
      const { id: deleteId } = event.queryStringParameters;
      return deletePaste(db, deleteId);
    default:
      return { statusCode: 400 };
  }
};
