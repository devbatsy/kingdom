const prices = {
    '200mb':50,
    '500mb':100,
    '1gb':200,
    '2gb':500,
    '5gb':1500
}
const charges = 5
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']


const getDate = () =>{
    const date = new Date();
        // array = ['jan 12th, 2020','11:00 AM']
        const trueDate = `${date.getUTCDate()}-${months[date.getMonth()]}-${date.getFullYear()},${date.getHours().toString().length === 1 ? '0'+date.getHours().toString() : date.getHours().toString()}:${date.getMinutes().toString().length === 1 ? '0'+date.getMinutes().toString() : date.getMinutes().toString()}`
        return trueDate;
}


const transaction = (wallet,data,state) =>{
    switch(data['purchase type'].toLowerCase())
    {
        case 'airtime':
            state.status = Math.sign(wallet - (Number(data.airtime) + (Number(data.airtime)) * (charges/100))) === -1 ? false : true;
            state.reason = state.status === false ? 'insufficient balance in wallet' : ''
        break;
        case 'data':
            switch(Object.keys(prices).includes(data.data))
            {
                case true:
                    state.status = Math.sign(wallet - prices[data.data]) === -1 ? false : true;
                    state.reason = state.status === false ? 'insufficient balance in wallet' : ''
            }
    }
    return state
}

const sendDataFeedback = (data,state,ws,clientPackage) =>{
    const purchaseValidation = new clientPackage();
    purchaseValidation.method = 'purchaseStatus';
    const {status, reason, date} = state;
    purchaseValidation.status = status;
    purchaseValidation.reason = reason;
    purchaseValidation.transType = data['purchase type']
    ws.send(JSON.stringify(purchaseValidation))

    const transactionPackage = new clientPackage();
    transactionPackage.method = 'purchaseTransaction';
    transactionPackage.date = date;
    transactionPackage.sub = data['purchase type'].toLowerCase() === 'data' ? `${data.data} data purchase` : `${data.airtime} airtime purchase`
    transactionPackage.number = data.number;
    transactionPackage.status = status
    ws.send(JSON.stringify(transactionPackage))
}

const storeTransactionReciept = async (userDataTransaction,data,state) =>{
    const {status, reason, date} = state;
    const {userId,network,number} = data
    const recieptUploadResult = await userDataTransaction.create({
        userID:userId,
        phoneNo:number,
        subscription:data['purchase type'].toLowerCase() === 'data' ? `${data.data} data purchase` : `₦${data.airtime} airtime purchase`.toLocaleLowerCase(),
        status:status,
        date:date,
        purchaseType:data['purchase type']
    })
    .then(() =>{
        console.log('reciept upload successfull')
    })
    .catch(err =>{
        console.log('an error occured')
    })
}

const validation = async (data,userDataTransaction,ws,clientPackage) =>{
    //do the login email and login password validation process using moongoose
    const wallet = 500;
    let state = {date:getDate()}
    // Get wallet from db using the user's id
    state = transaction(wallet,data,state);

    sendDataFeedback(data,state,ws,clientPackage)

    storeTransactionReciept(userDataTransaction,data,state)

}

module.exports = validation