const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000;
require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());



// data base

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fiopcal.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {

    const usersCollection = client.db('contact-management').collection('users');
    const contactsCollection = client.db('contact-management').collection('contacts');

    try {
        await client.connect();

        // post users
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
            const query = { user_email: user.user_email };
            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
                return res.send('User Already exist')
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        //   Contacts Apis  

        // post contacts
        app.post('/contacts', async (req, res) => {
            const user = req.body;
            console.log(user)
            const query = { email: user.email };
            const existingUser = await contactsCollection.findOne(query);
            if (existingUser) {
                return res.send('User Already exist')
            }
            const result = await contactsCollection.insertOne(user);
            res.send(result);
        })
        // get contacts
        app.get('/my-contacts', async (req, res) => {
            const email = req.query.email;
            const query = {user_email: email}
            const myContacts = await contactsCollection.find(query).toArray();
            res.send(myContacts);
        })
        // get contacts
        app.delete('/my-contacts/delete', async (req, res) => {
            const id = req.query.id;
            const query = {_id: new ObjectId(id)}
            const deleteContacts = await contactsCollection.deleteOne(query);
            res.send(deleteContacts);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send(`contact-management server running`)
})

app.listen(port, () => {
    console.log(`contact-management server running port is ${port}`);
})

