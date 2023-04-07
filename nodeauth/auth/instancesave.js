const { spawn } = require('child_process');

const express = require('express');
const app = express()
app.use(express.json());

const serverPath = '../sernew/index';
class instancemaker{

  async instancecreate(k,res){
  

  console.log("starting for instance")
  var kn=0;
const serverArgs = [k[0],k[1],k[2]];
console.log(serverArgs)

const child = spawn('node', [serverPath, ...serverArgs]);


await child.stdout.on('data', (data) => {
 
console.log(`Server out: ${data}`);
this.s(k,res);



});


child.stderr.on('data', (data) => {
  console.error(`Server error: ${data}`);

});


 
}


}


module.exports={instancemaker}
