const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

require("dotenv").config();

console.log(process.env.DB_TABLE);

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 4000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ghmig.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productCollection = client
    .db(`${process.env.DB_DATABASE}`)
    .collection(`${process.env.DB_TABLE}`);
  console.log("db connect ");

  app.post("/addBooking", (req, res) => {
    const newBooking = req.body;
    productCollection.insertOne(newBooking).then((results) => {
      res.send(results.insertedCount > 0);
    });
  });

  app.get("/bookings", (req, res) => {
    productCollection.find().toArray((err, items) => {
      res.send(items);
      console.log("db collected", items);
    });
  });
  app.get("/products", (req, res) => {
    productCollection.find().toArray((err, items) => {
      res.send(items);
      console.log("db collected ", items);
    });
  });
  app.get("/bookin/:id", (req, res) => {
    const bookId = ObjectID(req.params.id);
    productCollection.find(bookId).toArray((err, items) => {
      res.send(items);
      console.log("db connected ", items);
    });
  });

  app.post("/addProduct", (req, res) => {
    const newProduct = req.body;
    productCollection.insertOne(newProduct).then((result) => {
      console.log("insert product ", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.delete("/deleteProduct/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    console.log("info get ", req.body);
    console.log("id get show ", id);
    productCollection.findOneAndDelete({ _id: id }).then((err, results) => {
      res.send(results.insertedCount > 0);
    });
  });
 
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
