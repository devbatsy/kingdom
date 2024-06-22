const validation = async (userData,userMainConnection,ws,clientPackage) =>{
    const authResponse = {}
    //do the login email and login password validation process using moongoose
    

    const get_username = async () =>{
        const requestloginData = await userMainConnection.find({},'userID email password')
        .then(data =>{
            let shouldbreak = false
            for(const x of data)
            {
                switch(true)
                {
                    case userData.email === x.email && userData.password === x.password :
                        shouldbreak = true;
                        authResponse.state = true
                        authResponse.userId = x.userID
                }
                if(shouldbreak) {break}
            }
            switch(shouldbreak)
            {
                case false:
                    authResponse.state = false
            }
        })
        .catch(err =>{
            console.log(err)
        })

        const validation = new clientPackage();
        validation.validate = authResponse.state;
        validation.userId = authResponse.userId
        ws.send(JSON.stringify(validation));
    }
    get_username()
}

module.exports = validation