const func = async(data,connection) =>{
    const findUser = async() =>{
        const result = await connection.find({userID:data.userID})

        // console.log(result)

        return result.length === 0 ? false : true
    }

    switch(await findUser())
    {
        case true:
            // console.log('a match was found, so we just update')
            const updateUser = await connection.findOneAndUpdate({userID:data.userID},data,{new:true})
            .then(newData =>{
                // console.log(newData)
                console.log('user pending updated sucessfully')
            })
            .catch(err =>{
                console.log(err)
            })
        break;
        default:
            // console.log('no match was found so we just create a new user');
            const createUser = await connection.create(data)
            .then(() =>{
                console.log('user pending created sucessfully')
            })
            .catch(err =>{
                console.log('an error occured ', err)
            })
    }
}

module.exports = func