const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 8000;

require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.o8ccw.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
client.connect((err) => {
  console.log("Database Connection Error", err);
    const blogCollection = client.db("abidretro").collection("blogpost");

    app.get("/posts", (req, res) => {
        blogCollection.find().toArray((err, items) => {
            res.send(items);
        });
    });

    app.post("/addPost", (req, res) => {
        const newEvent = req.body;
        console.log("adding new post: ", newEvent);
       blogCollection.insertOne(newEvent).then((result) => {
            console.log("inserted count", result.insertedCount);
            res.send(result.insertedCount > 0);
        });
    });

    app.get("/posts/:_id", (req, res) => {
        console.log(req.params._id);
        blogCollection.find({ _id: ObjectId(req.params._id) })

            .toArray((err, documents) => {
                res.send(documents[0]);
            });
    });

    app.delete('/posts/:id', (req, res) => {
        blogCollection.deleteOne({ _id: ObjectId(req.params.id) })
          .then(result => {
            res.send(result.deletedCount > 0);
          })
      });

});

app.get("/", (req, res) => {
    res.send("Hello Bangladesh");
});

app.listen(port);