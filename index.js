const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)

// Mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sozmemk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const addCollection = client.db('productDB').collection('product');


    /// Read
    app.get('/product', async (req, res) => {
      const cursor = addCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // Update
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addCollection.findOne(query);
      res.send(result);
    })

    // Product Add
    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct)
      const result = await addCollection.insertOne(newProduct);
      console.log(result)
      res.send(result)
    })

    // update
    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedCard = req.body;
      const Card = {
        $set: {
          url: updatedCard.url,
          name: updatedCard.name,
          brand: updatedCard.brand,
          price: updatedCard.price,
        }
      }
      const result = await addCollection.updateOne(filter, Card, options)
      res.send(result);
    })

    //Delete
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send('Automative Server Open')
});

app.listen(port, () => {
  console.log(`Automative Server is Running : ${port}`)
})