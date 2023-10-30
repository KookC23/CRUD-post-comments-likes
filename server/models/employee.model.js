import mongoose from 'mongoose';
import crypto from 'crypto';// es una biblioteca de cifrado de JavaScript que ofrece una amplia variedad de funciones criptográficas.

const require = 'field is required';


const EmployeeSchema = new mongoose.Schema([{ 
  name: {
    type: String,
    trim: true,
    required: `Name ${require}`
  },
  
  last_name: {
    type: String,
    trim: true,
    required: `Last_name ${require}`
  },

  id_card: {
    type: String,
    trim: true,
    min: [12, 'Id_card should contain at least twelve digits!'],
    required: `Id_card ${require}`
  },

  phone: {
    type: Number,
    trim: true,
    min: [10, 'Phone number should contain at least ten digits!'], //minimo de caracteres
    required: `Phone ${require}`
  },

  address: {
    type: Number,
    trim: true,
    required: `Address ${require}`
  },

  email: {
    type: String,
    trim: true,
    unique: true,
    index: true,
    math: [/.+\@.+\..+/, 'Please fill a valid email address'],// vereifique si es un correo electronico 
    required: `Email ${require}`
  },

  created: {
    type: Date,
    default: Date.now 
  },

  updated: Date,

  hashed_password: {
    type: String,
    required: `Password ${require}`
  },

  salt: String 

}]);

EmployeeSchema.virtual('password')
.set(function(password){
  this._password = password;
  this.salt = this.makeSalt();
  this.hashed_password = this.encryptPassword(password);
})

.get(function(){
  return this._password;
});

EmployeeSchema.path('hashed_password').validate(function(v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.')
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required')
  }
}, null)

EmployeeSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function(password) {
    if(!password) return '';
    try {
      return crypto
      .createHmac('sha1', this.salt)
      .update(password)
      .digest('hex')
    } catch (err) {
      return '';
    }
  },
  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  }
};

export default mongoose.model('Employee', EmployeeSchema);