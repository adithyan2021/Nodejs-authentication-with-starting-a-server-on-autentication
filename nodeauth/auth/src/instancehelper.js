const {Client} = require('pg');
const db="your database"
const CryptoJS = require("crypto-js");
const key = "the key";
const connection =  new Client({

  host: 'your ip',
  user: 'postgres',
  database: db,
  password: 'pass',
  port: 5432,
});
// require("../instancesave")
var {instancemaker}=require('../instancesave')
const maker=new instancemaker();
connection.connect();
var metadata=[]
class instacehelper {
    
    async keychecker(res,key){

        const text = 'SELECT * FROM keymeta WHERE key = $1 ';
     
        try {
            const{rows}=await connection.query(text, [key]);
            if (!rows[0]) {
                return res.status(400).send({'message': 'The credentials you provided is incorrect'});
              }else{
                var instance=rows[0].instance;
                var db=rows[0].db;
                this.check_exist(instance,db,res)
              }
        } catch (error) {
            return res.status(400).send({'message': 'The credentials you provided is incorrect'});
        }
    }
    async check_exist(instance,db,res){
        var count=0;
        if (metadata.length==0){
           this.add_Data(instance,db,res);
        }else{
       for(var i=0;i<metadata.length;i++){
          console.log("llllll",metadata)
        if(metadata[i][0]==instance && metadata[i][1]==db){
            i=metadata.length+1;
            var k=['PQ'+instance,'QP'+instance]
            return res.send(k);
            
        }else if(1-(metadata[i][0]==instance || metadata[i][1]==db)){
          count+=1;
        }
         
      
       }if (count!=0){
        this.add_Data(instance,db,res);
       }else{
        var k=['PQ'+instance,'QP'+instance]
        return res.status(200).send(k);
       }
      }
    }
    async add_Data(instance,db,res){
   
        var d=[instance,db]
        metadata.push(d);
        var k=[db,'PQ'+instance,'QP'+instance]
        console.log("before starting",k)
       // var p=maker.instancecreate(k);
    //  console.log("........",res)
      maker.instancecreate(k,res);
     
      var PQ=this.convertCrypt('PQ'+instance)
      var QP=this.convertCrypt('QP'+instance)
      var sender=[PQ,QP]
      
       return res.status(201).send(sender);
    }
   convertCrypt(x){
      var j=CryptoJS.AES.encrypt(x, key).toString();
      return j;
    }
     



}

module.exports={instacehelper};