const get_username = async ({
    userMainConnection,
    data,//(req.body)
    res,
    path,
    routeType,
    navIndex
}) =>{
    const requestloginData = await userMainConnection.find({},'userID username')
    .then(queryData =>{
        for(const x of queryData)
        {
            let shouldbreak
            switch(true)
            {
                case x.userID === data.userID:
                    shouldbreak = true;
                    res.render(path.join(__dirname,'../../',`${routeType}`,'myApp','index.ejs'),{customer_id:data.userID,navIndex:navIndex,username:x.username});
                break;
            }
            if(shouldbreak) {break}
        }
    })
    .catch(err =>{
        console.log(err)
    })
}
module.exports = get_username