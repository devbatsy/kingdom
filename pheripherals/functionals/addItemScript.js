const {v4:uuidv4} = require('uuid');
const updatePassword = 'kingdom1234'
const createItem = async (data,connection,ws,clientPackage) =>{
    const userResponse = new clientPackage();

    const createNewItem = async () =>{
        const resultCreate = await connection.create({
            itemID:uuidv4(),
            serviceType:data.servicetype,
            price:data.serviceprice,
            active:data.active
        })
        .then(() =>{
            console.log('data created successfully')
            userResponse.status = true;
            userResponse.reason = 'item has been created successfully';
            ws.send(JSON.stringify(userResponse))
        })
        .catch(err =>{
            console.log('an error occured while creating item')
        })
    }

    const startCreation = async() =>{
        const resultGetDuplicate = await connection.find({
            serviceType:data.servicetype
        })
        .then(data =>{
            switch(Number(data.length))
            {
                case 0:
                    createNewItem()
                break;
                default:
                    userResponse.status = false;
                    userResponse.reason = 'item already exist, try updating instead';
                    ws.send(JSON.stringify(userResponse))
            }
        })
        .catch(err =>{
            console.log('an error occured while checking db')
        })
    }

    switch(data.password === updatePassword)
    {
        case true:
            startCreation()
        break;
        default:
            userResponse.status = false;
            userResponse.reason = 'incorrect password'
            ws.send(JSON.stringify(userResponse))
    }
}

module.exports = createItem