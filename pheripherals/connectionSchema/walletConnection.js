const wallet = ({connection,mongoose}) =>{
    const schema = mongoose.Schema({
        userID:{
            type:String,
            required:true
        },
        wallet:{
            type:String,
            required:true
        }
    })

    return connection.model('userWallet',schema)
}

module.exports = wallet