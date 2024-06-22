const passwordValidation = async(data,userMainConnection,ws,clientPackage) =>{

    const passwordClientPackage = new clientPackage();
    passwordClientPackage.method = 'password'
    const updatePassword = async() =>{
        switch(data['new password'] === data['confirm password'])
        {
            case true:
                const updateResult = await userMainConnection.findOneAndUpdate({userID:data.userId},{password:data['new password']})
                .then(() =>{
                    passwordClientPackage.status = true;
                    passwordClientPackage.reason = 'password updated successfully'
                    // console.log('password updated successfully')
                })
                .catch(err =>{
                    passwordClientPackage.status = false;
                    passwordClientPackage.reason = 'old password could not be updated'
                    // console.log('an error occured while trying to update password')
                })
            break;
            default:
                passwordClientPackage.status = false;
                passwordClientPackage.reason = 'new password not confirmed'
                // console.log('please confirm new password')
        }
        return true
    }

    const retrieveServerAuth = await userMainConnection.find({userID:data.userId,password:data['current password']},'-_id password')
    .then(data =>{
        switch(Number(data.length))
        {
            case 0:
                passwordClientPackage.status = false;
                passwordClientPackage.reason = 'incorrect current password'
                // console.log('incorrect current password')
                ws.send(JSON.stringify(passwordClientPackage)) 
            break;
            case 1:
                updatePassword()
                .then(() =>{
                    ws.send(JSON.stringify(passwordClientPackage))   
                })
                .catch(err =>{
                    console.log('an error occured while processing update password')
                })

        }
    })
    .catch(err =>{
        console.log('am error occured while retreiving password')
    })
}

module.exports = passwordValidation