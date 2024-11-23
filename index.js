const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g7idr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
        await client.connect();

        const artCollection = client.db("artsDB").collection("arts");
        const userCollection = client.db("artsDB").collection("user");

        app.get('/arts', async (req, res) => {
            const cursor = artCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/arts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await artCollection.findOne(query);
            res.send(result);
        })

        app.post('/arts', async (req, res) => {
            const newAdd = req.body;
            console.log(newAdd);
            const result = await artCollection.insertOne(newAdd);
            res.send(result);
        });

        app.put('/arts/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateItem = req.body;
            const items = {
                $set: {
                    name: updateItem.name,
                    email: updateItem.email,
                    stockStatus: updateItem.stockStatus,
                    processingTime: updateItem.processingTime,
                    customization: updateItem.customization,
                    rating: updateItem.rating,
                    price: updateItem.price,
                    description: updateItem.description,
                    category: updateItem.category,
                    item: updateItem.item,
                    photo: updateItem.photo,
                }
            }
            const result = await artCollection.updateOne(filter, items, options);
            res.send(result);
        })

        app.delete('/arts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await artCollection.deleteOne(query);
            res.send(result);
        })

        // user apis
        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Autumn Arts Backend!');
});

app.listen(port, () => {
    console.log(`Autumn Arts is running on port: ${port}`);
});