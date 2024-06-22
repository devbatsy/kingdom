const newDataTrans = ({connection,mongoose}) =>{
    const schema = mongoose.Schema({
        userID:{
            type:String,
            required:true
        },
        transactionType:{
            type:String,
            required:true
        },
        quantity:{
            type:String,
            required:true
        },
        amount:{
            type:String,
            required:true
        },
        date:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        }
    })

    return connection.model('userServiceTrans',schema)
}

module.exports = newDataTrans