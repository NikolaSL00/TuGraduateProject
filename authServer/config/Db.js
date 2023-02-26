const mongoose = require("mongoose");
const { DB_QUERYSTRING } = require("./env");

exports.dbInit = () => {
  mongoose.set("strictQuery", true);
  mongoose.connection.on("open", () => console.log(`Db is connected!`));

  return mongoose.connect(DB_QUERYSTRING);
};

// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });
// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
