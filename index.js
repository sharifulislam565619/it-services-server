const express = require("express")
require('dotenv').config()
const { MongoClient } = require('mongodb');
const app = express()
const cors = require("cors")
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2wssq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
   try {
      await client.connect();
      const database = client.db('it-service')
      const serviceCollection = database.collection('services')


      // insert a service
      app.post('/services', async (req, res) => {
         const data = req.body;
         const doc = {
            title: data.title,
            price: data.price,
            desc: data.description,
            img: data.img
         }
         const result = await serviceCollection.insertOne(doc);
         res.json(result)
      })

      //get a all services
      app.get('/services', async (req, res) => {
         const result = await serviceCollection.find({}).toArray()
         res.json(result)
      })


   } finally {
      //   await client.close();
   }
}

run().catch(console.dir)


app.get('/', (req, res) => {
   res.send("It service server is running")
})

app.listen(port, (req, res) => {
   console.log('server is running ', port)
})

