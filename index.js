const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
// import { MongoClient } from "mongodb";
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;


// midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uzrqz5q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  async function run() {
       try {
        // Connect the client to the server	\
        await client.connect();
        const coffeeCollection = client.db('coffeeDB').collection('coffee')

        // get data  from the server
        app.get('/coffee',async(req,res)=>{
          const cursor = coffeeCollection.find();
          const result = await cursor.toArray();
          res.send(result);
        })

        // send data to the server
        app.post('/coffee', async(req,res)=>{
        const newCoffee = req.body;
        console.log(newCoffee)
        const result = await coffeeCollection.insertOne(newCoffee) 
        res.send(result)

      })
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Coffee making server is running')
})

app.listen(port,()=>{
    console.log(`cofee server is runnig: ${port}`)
})
