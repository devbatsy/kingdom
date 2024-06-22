const updateProfile = async(data,connection,userMainConnection,path,res,verifyId) =>{
    let updateData = {}
    Object.keys(data).forEach(val =>{
        switch(true)
        {
            case data[val].length > 0:
                switch(val)
                {
                    case 'name_a':
                        updateData['username'] = data[val]
                    break;
                    case 'mobile_a':
                        updateData['phoneNo'] = data[val]
                    break;
                    case 'state_s_n':
                        updateData['state'] = data[val]
                    break;
                    case 'gender_g_n':
                        updateData['gender'] = data[val]
                    break;
                    case 'dob_a':
                        updateData['DOB'] = data[val]
                }
        }
    })
    
    const updateAlphaData = async () =>{
        console.log(updateData)
        switch(Object.keys(updateData).includes('username'))
        {
            case true:
                const alphaUpdateName = await userMainConnection.findOneAndUpdate({userID:data.userID},{username:updateData.username})
                .then(() =>{
                    console.log('the alpha username update was a success')
                    verifyId({userMainConnection:userMainConnection,data:data,res:res,routeType:'profile',path:path,navIndex:1})
                })
                .catch(err =>{
                    console.log(err, ' am error occured')
                })
            break;
            default:
                verifyId({userMainConnection:userMainConnection,data:data,res:res,routeType:'profile',path:path,navIndex:1})
        }
    }

    const profileResult = await connection.findOneAndUpdate({userID:data.userID},updateData)
    .then(() =>{
        console.log('the profile update was a success')
        updateAlphaData()
    })
    .catch(err =>{
        console.log(err, ' am error occured')
    })
}

module.exports = updateProfile