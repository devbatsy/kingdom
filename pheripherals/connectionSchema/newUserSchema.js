const newUser = ({connection,mongoose}) =>{
    const schema = mongoose.Schema({
        username:{
            type:String,
            required:true
        },
        phoneNo:{
            type:Number,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        userID:{
            type:String,
            required:true
        },
    })

    return connection.model('usersAlpha',schema)
}

module.exports = newUser