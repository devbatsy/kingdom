const newUser = ({connection,mongoose}) =>{
    const schema = mongoose.Schema({
        username:{
            type:String,
            required:false
        },
        phoneNo:{
            type:Number,
            required:false
        },
        email:{
            type:String,
            required:false
        },
        state:{
            type:String,
            required:false
        },
        gender:{
            type:String,
            required:false
        },
        DOB:{
            type:String,
            required:false
        },
        userID:{
            type:String,
            required:true
        }
    })

    return connection.model('usersProfile',schema)
}

module.exports = newUser