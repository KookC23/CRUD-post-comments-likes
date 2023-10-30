import mongoose from 'mongoose';


const require = 'field is required';

const CitySchema = new mongoose.Schema([{ 

  name: {
    type: String,
    trim: true,
    required: `Name ${require}`
  },
 
  created: {
    type: Date,
    default: Date.now 
  },

  updated: Date,
  salt: String 

}]);


export default mongoose.model('City', CitySchema);