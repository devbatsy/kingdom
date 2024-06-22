import { 
	DomType,
	sydDOM,
	setStyle,
	styleComponent,
	mount,
	useState,
	getState,
	preState,
	createElement 
} from "../../sydneyLib/sydneyDom.js";

import '../../routePages/socket.js'

setStyle([
    {
        nameTag:'dashboard',
        style:{
            height:'100%',
            width:'100%',
            background:'rgba(242,244,243)',
            display:'flex',
            columnGap:'40px',
            rowGap:'40px',
            overflowY:'scroll',
            padding:'15px',
        }
    },
    {
        nameTag:'profileMenu',
        style:{
            display:'flex',
            flexDirection:'column',
            rowGap:'10px',
            height:'fit-content'
        }
    },
    {
        nameTag:"profileContent",
        style:{
            height:'fit-content',
            display:'flex',
            flexDirection:'column',
            rowGap:'10px',
            padding:'12px',
            paddingTop:'15px',
            background:'#fff',
            boxShadow:'-2px 8px 20px rgba(0,0,0,.2)',
            position:'relative',
            transition:'opacity linear .3s',
        }
    },
    {
        nameTag:'info_box',
        style:{
            display:'flex',
            flexDirection:'column',
            rowGap:'8px',
            width:'100%',
            padding:'10px',
        }
    },
    {
        nameTag:'input',
        style:{
            height:'40px',
            background:'#F3F3F3',
            width:'100%',
            outline:'none',
            borderRadius:'7px',
            width:'100%',
            paddingLeft:'20px',
            textTransform:'capitalize'
        }
    }
])

const selectObject = {
    state:[
        'Anambara',
        'bauchi',
        'kogi',
        'lokoja',
        'kwara',
        'illorin',
        'abuja',
        'lagos',
        'taraba',
        'edo'
    ],
    gender:[
        'Male',
        'Female'
    ],
    bank:[
        'zenith bank',
        'uba bank',
        'first bank',
        'access bank'
    ]
}

class serverPackage{
    constructor({msg,type})
    {
        this.type = type;
        this.msg = msg
    }
}

let sockectConnectionState = false;
let pop_timer;
let loadertimer;
const initLoader = () =>{
    const popState = getState('customPop');
    const loaderState = getState('popLoader')
    popState.y = -120;
    loaderState.trans = 0
    useState('customPop',{type:'a',value:popState})
    useState('popLoader',{type:'a',value:loaderState})
    clearTimeout(pop_timer);
    cancelAnimationFrame(loadertimer)
}
const updatePopup = ({text,bg = undefined}) =>{
    initLoader()
    const popState = getState('customPop');
    const loaderState = getState('popLoader')
    popState.y = 20;
    popState.text = text;
    popState.bg = bg;
    function startIteration(){
        loadertimer = requestAnimationFrame(startIteration)
        loaderState.trans += 1;
        useState('popLoader',{type:'a',value:loaderState})
    }
    startIteration()
    useState('customPop',{type:'a',value:popState})
    pop_timer = setTimeout(() =>{
        initLoader()
    },4000)
}

ws.addEventListener('open', () =>{
    sockectConnectionState = true;
    updatePopup({text:'connection sucessful',bg:'rgba(92, 248, 92, 0.5)'})
    ws.addEventListener('message',({data}) =>{
        switch(JSON.parse(data).method)
        {
            case 'bank':
                switch(JSON.parse(data).status)
                {
                    case true:
                        updatePopup({text:JSON.parse(data).reason,bg:'rgba(92, 248, 92, 0.5)'})
                    break;
                    default:
                        updatePopup({text:`Acc operation failed due to ${JSON.parse(data).reason}`})
                }
            break;
            case 'password':
                switch(JSON.parse(data).status)
                {
                    case true:
                        updatePopup({text:JSON.parse(data).reason,bg:'rgba(92, 248, 92, 0.5)'})
                    break;
                    default:
                        updatePopup({text:`password operation failed due to ${JSON.parse(data).reason}`})
                }
        }
    })
})

ws.addEventListener('close',() =>{
    sockectConnectionState = false;
    let count = 4;
    let timer
    const popFunc = () =>{
        clearTimeout(timer);
        switch(true)
        {
            case count > 0:
                updatePopup({text:`connection closed, page will be reloaded in ${count}s`})
                count--;
                timer = setTimeout(popFunc,1000);
            break;
            default:
                location.reload()
        }
    }
    popFunc()
})

const fetchData = () =>{
    const getData = new XMLHttpRequest();

	getData.open('POST','requestUserInfo',true);
	
    getData.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
	getData.send(id);

    getData.addEventListener('load',e =>{
        switch(true)
        {
            case e.target.readyState === 4 && e.target.status === 200:
                const profileData = JSON.parse(e.target.responseText);
                switch(profileData.error)
                {
                    case false:
                        console.log(profileData);
                        const viewState = getState('view');
                        const renderData = {}
                        Object.keys(profileData.data).forEach(val =>{
                            switch(val)
                            {
                                case 'DOB':
                                    renderData['date of birth'] = profileData.data[val]
                                break;
                                case 'email':
                                    renderData['email'] = profileData.data[val]
                                break;
                                case 'state':
                                    renderData['state'] = profileData.data[val]
                                break;
                                case 'phoneNo':
                                    renderData['mobile number'] = profileData.data[val]
                                case 'gender':
                                    renderData['gender'] = profileData.data[val]
                                break;
                                case 'username':
                                    renderData['name'] = profileData.data[val]
                            }
                        })
                        console.log(renderData)
                        viewState.data = renderData
                        useState('view',{type:"a",value:viewState})
                    break;
                    default:
                        updatePopup({text:'failed to retrieve data transactions'})
                }
        }
    })
}

setTimeout(() =>{
    fetchData()
},500)


sydDOM.serviceSection = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.dashboard(),
            id:'profileService'
        },
        [
            sydDOM.profileMenu(),
            sydDOM.profileContent(),
            sydDOM.customPop()
        ]
    )
}
sydDOM.profileMenu = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.profileMenu(),
            class:'profileMenu'
        },
        [
            sydDOM.profileMenuElement({text:'View Profile',id:0,classType:'fa-regular fa-user'}),
            sydDOM.profileMenuElement({text:'Edit Profile',id:1,classType:'fa-solid fa-pen-to-square'}),
            sydDOM.profileMenuElement({text:'Bank Details',id:2,classType:'fa-solid fa-building-columns'}),
            sydDOM.profileMenuElement({text:'Change Password',id:3,classType:'fa-solid fa-lock'}),
        ],
        {
            createState:{
                stateName:'profileMenu',
                state:{idx:0}
            },
            type:"profileMenu"
        }
    )
}

sydDOM.profileMenuElement = ({text = 'Dashboard',func = 'dashboard', classType = 'fa-solid fa-gauge-high', id} = {}) =>{
    menuBtn = (id) =>{
        let Pstate = getState('profileMenu');
        let PstateInfo = getState('profileInfo')
        let Cstate_login = getState('login_button');
        const formNames = ['view','edit','bank','password']

        Pstate.idx = id;
        useState('profileMenu',{type:'a',value:Pstate})

        const trueState = getState(formNames[id]);
        trueState.d = 'flex';
        useState(formNames[id],{type:'a',value:trueState})
        const timer = setTimeout(() =>{
            clearTimeout(timer);
            trueState.o = '1'
            useState(formNames[id],{type:'a',value:trueState})
        },100);

        //update false states
        for(let state_id in formNames)
        {
            switch(true)
            {
                case Number(state_id) !== id:
                    const falseState = getState(formNames[state_id]);
                    falseState.o = '0';
                    useState(formNames[state_id],{type:'a',value:falseState})
                    const timer = setTimeout(() => {
                        clearTimeout(timer);
                        falseState.d = 'none';
                        useState(formNames[state_id],{type:'a',value:falseState})
                    }, 300);
            }
        }
    }
    return createElement(
        'div',
        {
            style:`height:45px;min-height:45px;width:100%;display:flex;column-gap:10px;border-radius:5px;align-items:center;padding-left:10px;color:${preState(['profileMenu','idx'],0) === id ? '#fff' : '#000'};background-color:${preState(['profileMenu','idx'],0) === id ? '#000' : 'transparent'}`,
            class:'profileMenuElement select',
            onclick:`menuBtn(${id})`
        },
        [
            createElement('i',{class:classType}),
            text
        ]
    )
}
sydDOM.profileContent = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.profileContent({method:"remove",style:['boxShadow']}),
            class:'profileContent'
        },
        [
            sydDOM.view(),
            sydDOM.edit(),
            sydDOM.bank(),
            sydDOM.password()
        ]
    )
}
sydDOM.view = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.profileContent(
                {method:'add',style:{position:'absolute',top:'0',left:'0',width:'100%',display:preState(['view','d'],'flex'),opacity:preState(['view','o'],'1')}}
                )
        },
        [
            sydDOM.info_box({text:'Name',params:['text','name_d','name_id']}),
            createElement(
                'div',
                {style:'width:100%;display:flex;row-gap:10px',class:'info_wrap'},
                [
                    sydDOM.info_box({text:'Email',params:['email','email_d','email_id']}),
                    sydDOM.info_box({text:'mobile Number',params:['text','mobile_d','mobile_id']}),
                ]
            ),
            createElement(
                'div',
                {style:'width:100%;display:flex;row-gap:10px',class:'info_wrap'},
                [
                    sydDOM.info_box({text:'State',params:['text','state_d','state_id']}),
                    sydDOM.info_box({text:'Gender',params:['text','gender_d','gender_id']}),
                ]
            ),
            sydDOM.info_box({text:'Date Of Birth',params:['text','dob_d','dob_id']})

        ],
        {
            createState:{
                stateName:'view',
                state:{data:{},d:'flex',o:'1'}
            },
            type:'view'
        }
    )
}

sydDOM.edit = () =>{
    return createElement(
        'form',
        {
            style:styleComponent.profileContent(
                {method:'add',style:{position:'absolute',top:'0',left:'0',width:'100%',display:preState(['edit','d'],'none'),opacity:preState(['edit','o'],'0')}}
                ),
            method:'POST',
            action:'profile'
        },
        [
            sydDOM.info_box({text:'Name',params:['text','name_a','name_a_id'],readonly:false}),
            createElement(
                'div',
                {style:'width:100%;display:flex;row-gap:10px',class:'info_wrap'},
                [
                    sydDOM.info_box({text:'mobile Number',params:['number','mobile_a','mobile_a_id'],readonly:false}),
                    sydDOM.select_box()
                ]
            ),
            createElement(
                'div',
                {style:'width:100%;display:flex;row-gap:10px',class:'info_wrap'},
                [
                    sydDOM.select_box('Gender'),
                    sydDOM.info_box({text:'Date Of Birth',params:['date','dob_a','dob_a_id'],readonly:false})
                ]
            ),
            sydDOM.uuidBox(),
            sydDOM.method('editProfile','48##'),
            sydDOM.login_button('editProfile')
        ],
        {
            createState:{
                stateName:'edit',
                state:{data:{},d:'none',o:'0'}
            },
            type:'edit'
        }
    )
}

sydDOM.uuidBox = () =>{
    return createElement(
        'input',
        {
            style:'display:none',
            name:'userID',
            id:'userID_id',
            readOnly:'readOnly',
            value:id
        }
    )
}

sydDOM.method = (purpose,cid) =>{
    return createElement(
        'input',
        {
            style:'display:none',
            name:'purpose',
            id:cid,
            readOnly:'readOnly',
            value:purpose
        }
    )
}

sydDOM.bank = () =>{
    const filter = (param) =>{
        const wanted = preState(['bank','wanted'],[]);
        const formState = preState(['bank','data'],{})
        let bool = wanted.includes(param)
        if(bool === false)
        {
            switch(formState[param])
            {
                case '':
                    bool = true
            }
        }
        return bool
    }
    return createElement(
        'form',
        {
            style:styleComponent.profileContent(
                {method:'add',style:{position:'absolute',top:'0',left:'0',width:'100%',display:preState(['bank','d'],'none'),opacity:preState(['bank','o'],'0')}}
                )
        },
        [
            sydDOM.info_box({text:'Account Name',params:['text','acc_name','acc_name_id'],readonly:false,pageType:'bank'}).addAttr({class:filter('account name')?'warn':''}),
            sydDOM.info_box({text:'Account Number',params:['number','acc_num_','acc_num_id'],readonly:false,pageType:'bank'}).addAttr({class:filter('account number')?'warn':''}),
            sydDOM.select_box('Bank').addAttr({class:filter('bank')?'warn':''}),
            sydDOM.login_button('bank')
        ],
        {
            createState:{
                stateName:'bank',
                state:{data:{},wanted:[],order:['account name','account number','bank'],d:'none',o:'0'}
            },
            type:'bank'
        }
    )
}

sydDOM.password = () =>{
    const filter = (param) =>{
        const wanted = preState(['password','wanted'],[]);
        const formState = preState(['password','data'],{})
        let bool = wanted.includes(param)
        if(bool === false)
        {
            switch(formState[param])
            {
                case '':
                    bool = true
            }
        }
        return bool
    }
    return createElement(
        'form',
        {
            style:styleComponent.profileContent(
                {method:'add',style:{position:'absolute',top:'0',left:'0',width:'100%',display:preState(['password','d'],'none'),opacity:preState(['password','o'],'0')}}
                )
        },
        [
            sydDOM.info_box({text:'Current Password',params:['password','currentpass_name','currentpass_id'],readonly:false,pageType:'password'}).addAttr({class:filter('current password')?'warn':''}),
            sydDOM.info_box({text:'New Password',params:['password','newpass_name','newpass_id'],readonly:false,pageType:'password'}).addAttr({class:filter('new password')?'warn':''}),
            sydDOM.info_box({text:'Confirm Password',params:['password','confirmpass_name','confirmpass_id'],readonly:false,pageType:'password'}).addAttr({class:filter('confirm password')?'warn':''}),
            sydDOM.login_button('password')
        ],
        {
            createState:{
                stateName:'password',
                state:{data:{},wanted:[],order:['current password','new password','confirm password'],d:'none',o:'0'}
            },
            type:'password'
        }
    )
}


sydDOM.info_box = ({text = 'Email',params = [],readonly = true,pageType = ''} = {}) =>{
    updateInput = (elem,text,pageType) =>
    {
        switch(true)
        {
            case pageType.length > 0:
                const formState = getState(pageType);
                formState.data[text.toLowerCase()] = elem.value;
                useState(pageType,{type:'a',value:formState})
        }
    }

    return createElement(
        'div',
        {
            style:styleComponent.info_box()
        },
        [
            createElement('p',{style:'color:grey'},[!readonly ? text+'*' : text]),
            createElement(
                'input',
                {
                    style:styleComponent.input()+`pointer-events:${readonly ? 'none' : 'unset'}`,
                    oninput:`updateInput.bind()(this,'${text}','${pageType}')`,
                    value:readonly ? preState(['view','data',text.toLowerCase()],'') : '',
                    type:params[0],
                    name:params[1],
                    id:params[2]
                })
        ]
    )
}

sydDOM.select_box = (type = 'state',bool = true) =>{
    const options = () =>{
        let array = [sydDOM.disable_option(`select ${type}`)];
        selectObject[type.toLowerCase()].forEach(val =>{
            array.push(sydDOM.option(val))
        });
        return array;
    }

    optionClick = (elem,type) =>{
        let value = selectObject[type.toLowerCase()][elem.selectedIndex-1];
        const formState = getState('bank');
        switch(true)
        {
            case type.toLowerCase() === 'bank':
                formState.data[type.toLowerCase()] = value;
            break;
        }
        useState('bank',{type:'a',value:formState})
    }

    let name = type.split(' ').join('_') +`_${type[0]}_`+'n';
    let id = type.split(' ').join('_') +`_${type[0]}_`+'id'
    return createElement(
        'div',
        {
            style:styleComponent.info_box()
        },
        [
            createElement('p',{style:'color:grey'},[bool ? type+'*' : type]),
            createElement('select',{
                style:styleComponent.input({method:'add',style:{cursor:'pointer',fontSize:'16px',fontFamily:'ubuntu',textTransform:'capitalize'}}),
                name:name.toLowerCase(),
                id:id.toLowerCase(),
                onchange:`optionClick.bind()(this,'${type}')`
            },
            [
                ...options()
            ]
            )
        ]
    )
}
sydDOM.option = (value) =>{
    return createElement(
        'option',
        {
            value:value,
            style:'font-family:ubuntu;font-size:16px;text-transform:capitalize',
        },
        [
            value
        ]
    )
}
sydDOM.disable_option = (value) =>{
    return createElement(
        'option',
        {
            value:value,
            disabled:true,
            selected:true,
            style:'font-family:ubuntu;font-size:16px;'
        },
        [
            value
        ]
    )
}

sydDOM.login_button = (type) =>{

    const validateInputs = (data,list) =>{
        let wanted = []
        list.forEach(val =>{
            let bool = Object.keys(data).includes(val)
            switch(bool)
            {
                case true:
                    switch(data[val]){
                        case '':
                            bool = false
                    }
            }

            !bool ? wanted.push(val) : null
        })
        return wanted
    }

    submit_details = (type) =>{
        const formState = getState(type);
        const parcel = formState.data;
        parcel.userId = id
        let validateInputsArray = validateInputs(formState.data,formState.order)
        formState.wanted = validateInputsArray
        useState(type,{type:'a',value:formState})

        switch(Number(validateInputsArray.length))
        {
            case 0:
                ws.send(JSON.stringify(new serverPackage({msg:parcel,type:`${type} msg`})))
            break;
            default:
                updatePopup({text:'Please enter all field before submitting'})
        }
    }
    return createElement(
        'div',
        {
            style:'padding:10px 0;width:100%;height:60px;min-height:60px;padding-right:25px;padding-left:10px;display:flex;align-items:center'
        },
        [
            createElement(
                type === 'editProfile' ? 'button' : 'div',
                {
                    style:'height:fit-content;width:fit-content;padding:10px 20px;background:#2F55DC;display:flex;justify-content:center;align-items:center;border-radius:7px;font-weight:700;color:#fff',
                    class:'select',
                    type:'submit',
                    onclick:type === 'editProfile' ? '' : `submit_details('${type}')`
                },
                [
                    "Submit"
                ]
            )
        ]
    )
}