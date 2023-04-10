const mongoose = require("mongoose");

exports.dbInit = () => {
  mongoose.set("strictQuery", true);
  mongoose.connection.on("open", () => console.log(`Db is connected!`));

  return mongoose.connect(process.env.MONGO_URI);
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
