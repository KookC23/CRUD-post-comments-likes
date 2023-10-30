import mongoose from 'mongoose';


const require = 'field is required';

const BillSchema = new mongoose.Schema([{ 
    
    total: {
        type: Number,
        trim: true,
        required: `Total ${require}`
    },

    subtotal: {
        type: Number,
        trim: true,
        required: `Subtotal ${require}`
    },

    created: {
        type: Date,
        default: Date.now 
    },
    
    updated: Date,


}]);


export default mongoose.model('Bill', BillSchema);