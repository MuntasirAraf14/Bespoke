import mongoose  from "mongoose";   

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    cartData: {
        type : Object,
        default : {}
    },
    role: {
        type: String,
        default: "user"
    },
    phone: {
        type: String,
        default: ""
    },
    image: {
        type: String, // Stores Cloudinary URL
        default: ""
    },
    address: {
        type: Object,
        default: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: ""
        }
    }
   
},{minimize: false});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
