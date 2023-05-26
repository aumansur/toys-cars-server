const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// middleware

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8ewx0me.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    // collection
    const allToysCollection = client.db("toysCar").collection("alltoys");
    // view details
    app.get("/alltoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allToysCollection.findOne(query);
      res.send(result);
    });
    // category
    app.get("/cartab", async (req, res) => {
      const tabCursor = allToysCollection.find();
      const result = await tabCursor.toArray();
      res.send(result);
    });
    // category single

    app.get("/cartab/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allToysCollection.findOne(query);
      res.send(result);
    });
    // all data
    app.get("/alltoys", async (req, res) => {
      const cursor = allToysCollection.find();
      const result = await cursor.limit(20).toArray();
      res.send(result);
    });
    // my toys
    app.get("/mytoys", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      let query = {};
      if (req.query?.email) {
        query = { seller_email: req.query?.email };
      }
      const result = await allToysCollection.find(query).toArray();
      res.send(result);
    });

    // SEARCH
    app.get("/searchtoys/:text", async (req, res) => {
      const searchText = req.params.text;
      console.log(searchText);
      const result = await allToysCollection
        .find({
          $or: [{ name: { $regex: searchText, $options: "i" } }],
        })
        .toArray();
      res.send(result);
    });

    // update
    app.get("/mytoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allToysCollection.findOne(query);
      res.send(result);
    });

    app.patch("/mytoys/:id", async (req, res) => {
      const id = req.params.id;
      const toys = req.body;
      console.log(id, toys);
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedToys = {
        $set: {
          price: toys.price,
          quantity_available: toys.quantity_available,
          description: toys.description,
        },
      };
      const result = await allToysCollection.updateOne(
        filter,
        updatedToys,
        option
      );
      res.send(result);
    });

    // delete
    app.delete("/alltoys/:id", async (req, res) => {
      const id = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await allToysCollection.deleteOne(query);
      res.send(result);
    });
    // category truck
    app.get("/truck", async (req, res) => {
      const filter = { sub_category: "truck" };
      const result = await allToysCollection.find(filter).toArray();
      res.send(result);
    });

    // category regularCar
    app.get("/regularcar", async (req, res) => {
      const filter = { sub_category: "regularCar" };
      const result = await allToysCollection.find(filter).toArray();
      res.send(result);
    });

    //miniPoliceCar
    app.get("/mini", async (req, res) => {
      const filter = { sub_category: "miniPoliceCar" };
      const result = await allToysCollection.find(filter).toArray();
      res.send(result);
    });

    app.post("/alltoys", async (req, res) => {
      const allDataToys = req.body;
      console.log(allDataToys);
      const option = {
        projection: { title: 1, price: 1, service_id: 1, img: 1 },
      };
      const result = await allToysCollection.insertOne(allDataToys);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running ");
});

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
