const newDataTrans = ({connection,mongoose}) =>{
    const schema = mongoose.Schema({
        userID:{
            type:String,
            required:true
        },
        phoneNo:{
            type:Number,
            required:true
        },
        subscription:{
            type:String,
            required:true
        },
        status:{
            type:Boolean,
            required:true
        },
        date:{
            type:String,
            required:true
        },
        purchaseType:{
            type:String,
            required:true
        }
    })

    return connection.model('usersDataTrans',schema)
}

module.exports = newDataTrans