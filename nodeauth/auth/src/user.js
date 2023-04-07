const moment =require('moment')


const CryptoJS = require("crypto-js");
const db="your database"
const { v4: uuidv4 } = require('uuid');
const {Helper}=require('./helper')
const {instacehelper}=require('./instancehelper')
const inc= new instacehelper();
const helper=new Helper();
const {Client} = require('pg');
const connection =  new Client({
    host: 'your ip',
    user: 'postgres',
    database: db,
    password: 'pass',
    port: 5432,
});

connection.connect();
class User  {

 
  async create(req, res) {
   console.log("reached")
   var body=req.body

    if (!body.email || !body.password || !body.key || !body.priority) {
      return res.status(400).send({'message': 'Some values are missing'});
    }
    if (!helper.isValidEmail(body.email)) {
      return res.status(400).send({ 'message': 'Please enter a valid email address' });
    }

   
    const text = 'SELECT * FROM users WHERE email = $1';

    const { rows } = await connection.query(text, [body.email]);
    console.log(rows)
    if (rows.length!=0) {
      return res.status(400).send({'message': 'email already exist'});
    }
    const hashPassword = helper.hashPassword(body.password);
    console.log("")
    const createQuery = `INSERT INTO
      users(id, email, password, key, priority,created_date, modified_date)
      VALUES($1, $2, $3, $4, $5, $6 ,$7)
      returning *`;
    const values = [
      uuidv4(),
      body.email,
      hashPassword,
      body.key,
      body.priority,
      
      moment(new Date()),
      moment(new Date())
    ];


    try {
      const { rows } = await connection.query(createQuery, values);
    //  const token = helper.generateToken(rows[0].id);
      // return res.status(201).send({ token });
      return res.status(201).send({'message': 'kitty mwone'});
    } catch(error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ 'message': 'User with that EMAIL already exist' })
      }
      return res.status(400).send(error);
    }
  }

async keylogin(req, res) {
  var body=req.body
  if (!body.email || !body.password || !body.key ) {
    return res.status(400).send({'message': 'Some values are missing'});
  }
  if (!helper.isValidEmail(body.email)) {
    return res.status(400).send({ 'message': 'Please enter a valid email address' });
  }
  const text = 'SELECT * FROM users WHERE email = $1';
  try {
    const { rows } = await connection.query(text, [body.email]);
    console.log(rows[0].priority)
    if (!rows[0]) {
      return res.status(400).send({'message': 'not exist'});
    }
   


    if(!helper.comparePassword(rows[0].password, body.password)) {
      return res.status(400).send({ 'message': 'wrong pass' });
    }
   
      console.log("in pr bd")
      var knrr= rows[0].key.split(",")
      console.log(knrr,knrr.length)
      const foundValue = knrr.find(element => element === body.key);
      if (foundValue) {
       console.log(body.key)
        inc.keychecker(res,body.key);
      } else {
        return res.status(400).send({ 'message': 'wrong key' });
      }



  } catch(error) {
    return res.status(400).send(error)
  }
    

}

  async login(req, res) {
    console.log("reached")
    var body=req.body
    //  var body=JSON.stringify(req.body) ()
   
    if (!body.email || !body.password ) {
      return res.status(400).send({'message': 'Some values are missing'});
    }
    if (!helper.isValidEmail(body.email)) {
      return res.status(400).send({ 'message': 'Please enter a valid email address' });
    }
    const text = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows } = await connection.query(text, [body.email]);
      console.log(rows[0].priority)
      if (!rows[0]) {
        return res.status(400).send({'message': 'not exist'});
      }
     
  

      if(!helper.comparePassword(rows[0].password, body.password)) {
        return res.status(400).send({ 'message': 'wrong pass' });
      }
      if(body.key){
        if(rows[0].priority>0){
        console.log("in pr bd")
        var knrr= rows[0].key.split(",")
        console.log(knrr,knrr.length)
        const foundValue = knrr.find(element => element === body.key);
        if (foundValue) {
         console.log(body.key)
          inc.keychecker(res,body.key);
        } else {
          return res.status(400).send({ 'message': 'wrong key' });
        }
      }
      else{
        console.log("hhhh");
      }
    }
      if(rows[0].priority>0){
        console.log("in condiii")
     
        var id=rows[0].id;
        this.multiplekey(res,id)

      }
  
      else{
        console.log("scsdsds............",rows[0])
       console.log(rows[0].id) 
       var key=rows[0].key
       inc.keychecker(res,key);
      }
    } catch(error) {
      return res.status(400).send(error)
    }
  }
 async keydata(res,m){
  console.log(m)
    const tex = 'SELECT key,db FROM keymeta WHERE user_f_key = $1 ';
    const { rows } =  await connection.query(tex, [m]);
    console.log(rows);
    if(!rows[0]){
      console.log("no data")
    }else{
      console.log("from database",rows);
      var row=this.encryteraray(rows)
      
      return res.send(row);
    }
      

  }
  encryteraray(m){
    for(var i=0;i<m.length;i++){
      m[i].key=inc.convertCrypt(m[i].key);
    m[i].db=inc.convertCrypt(m[i].db);
    }
    return m;
  }
 
 multiplekey(res,k){
    var da=[]
   
     this.keydata(res,k);
if(!da){
console.log("after forloop ",da)
return res.send(da);
}
  }
  async delete(req, res) {
    const deleteQuery = 'DELETE FROM users WHERE id=$1 returning *';
    try {
      const { rows } = await connection.query(deleteQuery, [req.user.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'user not found'});
      }
      return res.status(204).send({ 'message': 'deleted' });
    } catch(error) {
      return res.status(400).send(error);
    }
  }

}

module.exports={User};

