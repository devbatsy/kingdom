const newUser = ({connection,mongoose}) =>{
    const schema = mongoose.Schema({
        accName:{
            type:String,
            required:true
        },
        accNum:{
            type:Number,
            required:true
        },
        bank:{
            type:String,
            required:true
        },
        userID:{
            type:String,
            required:true
        },
    })

    return connection.model('usersAccount',schema)
}

module.exports = newUser