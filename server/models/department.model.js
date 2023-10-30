import mongoose from 'mongoose';

const require = 'field is required';

const DepartmentSchema = new mongoose.Schema([{ 
  name: {
    type: String,
    trim: true,
    required: `Name ${require}`
  }
  
}]);


export default mongoose.model('Department', DepartmentSchema);