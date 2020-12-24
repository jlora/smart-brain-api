const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  // connect to your own database here
  client: 'pg',
  connection: {
    host : 'ec2-34-204-121-199.compute-1.amazonaws.com',
    user : 'ywjcdncvoeursc',
    port: '5432',
    password : 'c3fc0347041eacb5cd60a2e02453bbf8dfded8dda36beb217f29103f5167732a',
    database : 'db753atbg58l65'
  }
});

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('it is working!!'));
app.get('/users', (req, res)=> db.select('*').from('users').then(users => res.json(users)));
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

const PORT = process.env.PORT;
app.listen(PORT, ()=> {
  console.log(`app is running on port ${PORT}`);
});
