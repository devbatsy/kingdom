class Router{
    constructor({express,path,urlencoded,wss,mongoose})
    {
        this.router = express.Router();
        this.path = path;
        this.urlencoded = urlencoded;
        this.websocket = require('./websocketConnection');
        this.verifyId = require('./validationPack/verifyUserId');
        this.updateProfileData = require('./functionals/updateProfile');
        this.checkTnxStatus = require('./functionals/checkTnx')
        try{
            this.atlasConnection = mongoose.createConnection(process.env.connectionString,
                {
                    useUnifiedTopology:true,
                    useNewUrlParser:true
                })

                this.atlasConnection.once('connected', () =>{
                    console.log('connection has been made successfully')
                    this.userMainConnection = require('./connectionSchema/newUserSchema')({connection:this.atlasConnection,mongoose:mongoose})
                    this.userDataTransaction = require('./connectionSchema/dataTransactionSchema')({connection:this.atlasConnection,mongoose:mongoose})
                    this.userProfileConnection = require('./connectionSchema/profileSchema')({connection:this.atlasConnection,mongoose:mongoose})
                    this.userAccountConnection = require('./connectionSchema/accountSchema')({connection:this.atlasConnection,mongoose:mongoose})
                    this.itemsListConnection = require('./connectionSchema/itemsConnectionSchema')({connection:this.atlasConnection,mongoose:mongoose})
                    this.walletConnection = require('./connectionSchema/walletConnection')({connection:this.atlasConnection,mongoose:mongoose})
                    this.serviceTransConnection = require('./connectionSchema/serviceTransSchema')({connection:this.atlasConnection,mongoose:mongoose})
                    this.pendingConnection = require('./connectionSchema/pendingSchema')({connection:this.atlasConnection,mongoose:mongoose})
                    new this.websocket({wss:wss,userMainConnection:this.userMainConnection,userDataTransaction:this.userDataTransaction,userAccountConnection:this.userAccountConnection,itemsListConnection:this.itemsListConnection,walletConnection:this.walletConnection,serviceTransConnection:this.serviceTransConnection,pendingConnection:this.pendingConnection})

                    Router.createRoutes(this)
                })
        }
        catch(err)
        {
            console.log('there was an error')
        }
        // new this.websocket({wss:wss,mongoose:mongoose,atlasConnection:this.atlasConnection})
        // Router.createRoutes(this)
    }
    static createRoutes(params)
    {
        const {router,path,urlencoded,wss,userMainConnection,verifyId,userDataTransaction,userProfileConnection,updateProfileData,checkTnxStatus,pendingConnection} = params;

        const confirm_acc_login = (data,res) =>{
            const responseParcel = {}
            // console.log(data)
            const refinedKarrays = Object.keys(data)
            switch(true)
            {
                case refinedKarrays.includes('text_n') && refinedKarrays.includes('number_n'):
                    const {text_n,email_n,number_n,password_n,userID} = data

                    const uploadNewUserProfile = async() =>{
                        const profileResult = await userProfileConnection.create({
                            username:text_n.toLowerCase(),
                            phoneNo:Number(number_n),
                            email:email_n.toLowerCase(),
                            userID:userID,
                            state:'',
                            gender:'',
                            DOB:''
                        })
                        .then(() =>{
                            console.log('user profile created')
                        })
                        .catch(err =>{
                            console.log('an error occured while creating the profile')
                        })
                    }

                    const uploadNewUser = async () =>{
                        const uploadOutput = await userMainConnection.create({
                            username:text_n.toLowerCase(),
                            phoneNo:Number(number_n),
                            email:email_n.toLowerCase(),
                            password:password_n.toLowerCase(),
                            userID:userID
                        })
                        .then(() =>{
                            console.log('data upload successful');
                            uploadNewUserProfile()
                            res.render(path.join(__dirname,'../','dashboard','myApp','index.ejs'),{customer_id:data.userID,navIndex:0,username:text_n});
                        })
                        .catch(err =>{
                            console.log(err,' this is the error')
                        })
                    }
                    uploadNewUser()
                break;
                //login auth code
                default:
                    verifyId({
                        userMainConnection:userMainConnection,
                        data:data,//(req.body)
                        res:res,
                        routeType:'dashboard',
                        path:path,
                        navIndex:0
                    })
            }
        }

        const getIntention = async (body,req,res) =>{
            switch(body.purpose)
            {
                case 'editProfile':
                    updateProfileData(body,userProfileConnection,userMainConnection,path,res,verifyId);
                break;
                default:
                    verifyId({userMainConnection:userMainConnection,data:req.body,res:res,routeType:'profile',path:path,navIndex:1})
            }
        }

        router
        .post('/profile',urlencoded,(req,res) =>{
            getIntention(req.body,req,res)
        })
        .post('/dashboard',urlencoded, (req,res) =>{
            confirm_acc_login(req.body,res)
        })
        .post('/data',urlencoded, (req,res) =>{
            verifyId({userMainConnection:userMainConnection,data:req.body,res:res,routeType:'buyData',path:path,navIndex:3})
        })
        .get('/login', (req,res) =>{
            res.sendFile(path.join(__dirname,'../','Login','myApp','index.html'))
        })
        .post('/login', (req,res) =>{
            res.sendFile(path.join(__dirname,'../','Login','myApp','index.html'))
        })
        .get('/', (req,res) =>{
            res.sendFile(path.join(__dirname,'../','create_account','myApp','index.html'))
        })
        .post('/trans',urlencoded, (req,res) =>{
            verifyId({userMainConnection:userMainConnection,data:req.body,res:res,routeType:'transaction',path:path,navIndex:4})
        })
        .post('/complaint',urlencoded, (req,res) =>{
            verifyId({userMainConnection:userMainConnection,data:req.body,res:res,routeType:'complain',path:path,navIndex:6})
        })
        .post('/purchase',urlencoded, (req,res) =>{
            // res.send('this is the post request route')
            verifyId({userMainConnection:userMainConnection,data:req.body,res:res,routeType:'purchase',path:path,navIndex:5})
        })
        .post('/wallet',urlencoded, (req,res) =>{
            console.log(req.body)
            // res.send('this is the post request route')
            switch(Object.keys(req.body).includes('txnref'))
            {
                case false:
                    console.log('this is a normal route');
                    verifyId({userMainConnection:userMainConnection,data:req.body,res:res,routeType:'wallet',path:path,navIndex:2})
                break;
                default:
                    console.log('this is qiuck teller');
                    const processPostTnx = async() =>{
                        const result = await checkTnxStatus(req.body.txnref,pendingConnection);

                        verifyId({userMainConnection:userMainConnection,data:{userID:req.body.txnref},res:res,routeType:'wallet',path:path,navIndex:2})
                    }
                    processPostTnx()
            }
        })
        .get('/admin', (req,res) =>{
            res.sendFile(path.join(__dirname,'../admin/index-admin.html'))
        })
        .post('/dataTransaction',urlencoded, (req,res) =>{
            const userId = Object.keys(req.body)[0];

            const getDataTransactions = async () =>{
                const result = await userDataTransaction.find({userID:userId},'-_id -__v -userID')
                .then(data =>{
                    res.json({
                        data:data,
                        error:false
                    })
                })
                .catch(err =>{
                    res.json({
                        error:true
                    })
                })
            }
            getDataTransactions()
        })
        .post('/requestUserInfo', urlencoded, (req,res) =>{
            const userId = Object.keys(req.body)[0];
            
            const getProfileData = async() =>{
                const result = await userProfileConnection.find({userID:userId},'-_id -__v -userID')
                .then(data =>{
                    res.json({
                        data:data[0],
                        error:false
                    })
                })
                .catch(err =>{
                    res.json({
                        error:true
                    })
                })
            }
            getProfileData()
        })

    }
}

module.exports = Router