
const express = require('express');

const {User} = require('./src/user')

const UserWithDb=new User();
let cors = require("cors");



const app = express()

app.use(express.json())
app.use(cors());


app.post('/api/v1/users', function(req, res){
  UserWithDb.create(req, res);
});

app.post('/api/v1/users/login', function(req, res){
  UserWithDb.login(req, res);
});
app.post('/api/v1/users/keylogin', function(req, res){
  UserWithDb.keylogin(req, res);
});
app.delete('/api/v1/users/me', function(req, res){
  UserWithDb.delete(req, res);
});
var pt=2080
app.listen(pt,"0.0.0.0")
console.log('app running on port ',pt);