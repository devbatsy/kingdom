const newUser = ({connection,mongoose}) =>{
    const schema = mongoose.Schema({
        pending:{
            type:Boolean,
            required:false
        },
        userID:{
            type:String,
            required:false
        },
        tnxInfo:{
            type:Object,
            required:false
        }
    })

    return connection.model('usersTnxPend',schema)
}

module.exports = newUser