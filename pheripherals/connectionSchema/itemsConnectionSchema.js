const items = ({connection,mongoose}) =>{
    const schema = mongoose.Schema({
        itemID:{
            type:String,
            required:true
        },
        serviceType:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        active:{
            type:String,
            required:true
        }
    })

    return connection.model('serviceItems',schema)
}

module.exports = items