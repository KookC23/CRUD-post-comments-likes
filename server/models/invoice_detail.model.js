import mongoose from 'mongoose';

const require = 'field is required';


const Invoice_detailchema = new mongoose.Schema([{ 
    
    amount: {
        type: Number,
        trim: true,
        required: `amount ${require}`

    },

   

    created: {
        type: Date,
        default: Date.now 
    },
    
    updated: Date,
    

}]);

export default mongoose.model('Invoice_detail', Invoice_detailchema);