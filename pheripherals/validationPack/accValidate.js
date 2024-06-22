const accountValidate = (data,userAccountConnection,ws,clientPackage) =>{
    const updatePack = {
        userID:data.userId,
        accName:data['account name'],
        accNum:data['account number'],
        bank:data.bank
    }

    const accClientPackage = new clientPackage();
    accClientPackage.method = 'bank'

    const createDb = async () =>{
        const result = await userAccountConnection.create(updatePack)
        .then(() =>{
            accClientPackage.status = true;
            accClientPackage.reason = 'data created successfully'
        })
        .catch(err =>{
            accClientPackage.status = false
            accClientPackage.reason = 'an error occured while trying to create user acc data'
        })
        return true
    }

    const updateDb = async () =>{
        const result = await userAccountConnection.findOneAndUpdate({userID:updatePack.userID},updatePack)
        .then(data =>{
            accClientPackage.status = true
            accClientPackage.reason = 'data updated successfully'
            console.log('hey updated')
        })
        .catch(err =>{
            accClientPackage.status = true;
            accClientPackage.reason = 'an error occured while trying to update user acc data'
        })
        return true
    }

    const checkDataExistence = async () =>{
        const result = await userAccountConnection.find({userID:updatePack.userID})
        .then(data =>{
            const check = async () =>{
                let result;
                switch(Number(data.length))
                {
                    case 0:
                        result = createDb()
                    break;
                    case 1:
                        result = updateDb()
                }
                return result
            }
            check().then(data =>{
                    ws.send(JSON.stringify(accClientPackage))                
            })
        })
        .catch(err =>{
            accClientPackage.status = false
            accClientPackage.reason = 'an error occured while trying to access user acc, please contact the admin'
        })
    }
    checkDataExistence()
}

module.exports = accountValidate