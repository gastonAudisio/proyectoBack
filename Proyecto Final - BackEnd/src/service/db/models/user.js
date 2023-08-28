import mongoose from 'mongoose';

const collectionName = 'user';

const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,
    required: true
};

const stringTypeSchemaNonUniqueRequired = {
    type: String,
    required: true
};


const studentSchema = new mongoose.Schema({
    name: stringTypeSchemaNonUniqueRequired,
    lastName: stringTypeSchemaNonUniqueRequired,
    email: stringTypeSchemaUniqueRequired,
    age: stringTypeSchemaNonUniqueRequired,
    password: stringTypeSchemaNonUniqueRequired,
    fullName: {
        type: String
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
    },
   
    
});


const userModel = mongoose.model(collectionName, studentSchema);
export default userModel;