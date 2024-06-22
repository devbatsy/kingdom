const axios = require('axios');
const check = async(userID,pendingConnection) =>{
        const getPending = await pendingConnection.find({userID:userID});
        const url = `https://qa.interswitchng.com/paymentgateway/api/v1/virtualaccounts/transaction?merchantCode=MX191540&transactionReference=${userID}`

        const updatePendingState = async() =>{
            const updateUser = await pendingConnection.findOneAndUpdate({userID:userID},{
                pending:false,
                tnxInfo:{amount:'0'}
            },{new:true})
            .then(newData =>{
                // console.log(newData)
                console.log('user pending updated sucessfully')
            })
            .catch(err =>{
                console.log(err)
            })
        }

        const getTnxStatus = async() =>{
            const res = await axios.get(url)
            .then(data =>{
                console.log(data);
                updatePendingState()
            })
            .catch(err =>{
                console.log(err)
            })
        }

        switch(getPending[0].pending)
        {
            case true:
                getTnxStatus();
            break
            default:
                console.error('an error occured, seems theres not pending tnx')
        }
}

module.exports = check
//ECONNRESET