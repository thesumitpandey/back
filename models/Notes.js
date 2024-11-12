const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true,
        unique:false
        
    },
    description: {
        type: String,
        required: true,
        unique:false
    },
    date: {
        type: Date,
        default: Date.now
    },
    tags: {
        type:String
        
        
    },

    nk:{
        type:String,
    
    
    },



    a: {
        type: [String]
        
        
    },

    



}, { timestamps: true });

module.exports = mongoose.model('Notes', NotesSchema);
