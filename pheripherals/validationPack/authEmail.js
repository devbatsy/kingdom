const {v4:uuidv4} = require('uuid');
const validation = (email,userMainConnection,ws,clientPackage) =>{
    const authResponse = {}
    //do the email validation process using moongoose, and create the unique user id
    const emailAuth = async () =>{
        const getEmails = await userMainConnection.find({},'-_id email')
        .then(data =>{
            let shouldbreak = false
            for(const x of data)
            {
                switch(true)
                {
                    case x.email === email.toLowerCase():
                        shouldbreak = true
                }
                if(shouldbreak) break
            }
            switch(shouldbreak)
            {
                case true:
                    authResponse.state = false;
                break;
                default:
                    authResponse.state = true;
                    authResponse.userId = uuidv4()
            }
        })
        .catch(err =>{
            console.log(err)
        })

        const validation = new clientPackage();
        validation.validate = authResponse.state;
        validation.userId = authResponse.userId;
        ws.send(JSON.stringify(validation));
    }
    emailAuth()
    return authResponse
}

module.exports = validation

