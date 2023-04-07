const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


class Helper {

  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  }


  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  }

  
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }
  
  generateToken(id) {
    const token = jwt.sign({
      userId: id
    },
      process.env.SECRET, { expiresIn: '7d' }
    );
    console.log(token)
    return token;
  }
}

module.exports={Helper};

