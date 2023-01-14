const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_ATLAS_URI || "mongodb://localhost:27017/PlayChess"

console.log("Connecting to DB...");
mongoose.connect(
  MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
).then(() => {
  console.log("DB connection Success");
}).catch((err) => {
  return console.log(err);
});
