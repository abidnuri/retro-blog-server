const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 8000;

require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://abidretro:abidretro123@cluster0.o8ccw.mongodb.net/abidretro?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
client.connect((err) => {
    const productCollection = client.db("abidretro").collection("blogpost");
    const productCollectionForOrder = client.db("abidretro").collection("blogpost");

    app.get("/events", (req, res) => {
        productCollection.find().toArray((err, items) => {
            res.send(items);
        });
    });

    app.post("/addEvent", (req, res) => {
        const newEvent = req.body;
        console.log("adding new event: ", newEvent);
        productCollection.insertOne(newEvent).then((result) => {
            console.log("inserted count", result.insertedCount);
            res.send(result.insertedCount > 0);
        });
    });

    app.get("/checkout/:_id", (req, res) => {
        console.log(req.params._id);
        productCollection.find({ _id: ObjectId(req.params._id) })

            .toArray((err, documents) => {
                res.send(documents[0]);
            });
    });

    app.post("/addOrders", (req, res) => {
        const newOrder = req.body;
        productCollectionForOrder.insertOne(newOrder).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    app.get("/orders", (req, res) => {
        productCollectionForOrder.find().toArray((err, items) => {
            res.send(items);
        });     
    });
    
    app.delete('/delete/:_id',(req,res) => {
        productCollection.deleteOne({_id:ObjectId(req.params.id)})
        .then((result) => {
            res.send(result.deletedCount>0);
        })
    });

});

app.get("/", (req, res) => {
    res.send("Hello Bangladesh");
});

app.listen(port);