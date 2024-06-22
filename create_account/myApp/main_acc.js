import { 
	sydDOM,
	setStyle,
	styleComponent,
	mount,
	getState,
	preState,
    useState,
	createElement,
    virtualDom
} from "../../sydneyLib/sydneyDom.js";

import '../../routePages/socket.js'

setStyle([
    {
        nameTag:'info_box',
        style:{
            display:'flex',
            flexDirection:'column',
            rowGap:'20px',
            width:'100%',
            // marginBottom:'20px',
            padding:'10px',
            paddingRight:'25px',
            paddingLeft:'30px'
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
            paddingLeft:'20px'
        }
    },
])

// const ws = new WebSocket('ws://localhost:8000');
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
        clearTimeout(pop_timer)
        switch(JSON.parse(data).validate)
        {
            case false:
                updatePopup({text:'Email already in use'})
            break;
            default:
                const uuidBoxState = getState('uuidBox');
                uuidBoxState.userId = JSON.parse(data).userId;
                useState('uuidBox',{type:'a',value:uuidBoxState})
                virtualDom['main_form_page'].submit()
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

class serverPackage{
    constructor(msg)
    {
        this.type = 'accEmailAuth';
        this.msg = msg
    }
}

sydDOM.part_two = () =>{
	return createElement(
		'div',
		{
			style:styleComponent.part_one([
                {method:'add',style:{
                    background:'#fff',
                    width:'100%',
                    overflowY:'scroll',
                }}
            ]),
            id:'part_two'
		},
        [
            sydDOM.headerTitle().addAttr({style:styleComponent.headerTitle([
                {method:'remove',style:['display']},
                {method:'add',style:{
                    position:'absolute',
                    top:'20px',
                    left:'10px',
                    color:'#000'
                }}]
                )}).addAttr({id:'floatHeader'}),
            createElement(
				'header',
				{
					style:'height:fit-content;min-height:50px;padding:10px 0;width:100%;display:flex;align-items:center;padding-right:20px;justify-content:flex-end;column-gap:5px;font-size:14px;'
				},
				[
					"Already have account?",
                    createElement('a',{href:'/login',style:'color:#2F55DC;text-decoration:none;',class:'select'},["Log in"])
				]
			),
            sydDOM.main_form_page()
        ]
	)
}

sydDOM.main_form_page = () =>{
    const filter = (param) =>{
        const wanted = preState(['main_form_page','wanted'],[]);
        return wanted.includes(param)
    }
    return createElement(
        'form',
        {
            style:styleComponent.intro_sec({method:'add',style:{
                color:'unset',
                rowGap:'20px'
            }}),
            method:'post',
            action:'dashboard'
        },
        [
            createElement('h1',{style:'font-family: "Oswald", sans-serif;font-weight:400'},["Create your account"]),
            createElement('p',{style:'color:lightgrey;text-align:center'},["Enter the field below to get started"]),
            sydDOM.info_box('User name').addAttr({style:styleComponent.info_box({method:'add',style:{marginTop:'20px'}})}).addAttr({class:filter('user name')?'warn':''}),
            sydDOM.info_box('Mobile number').addAttr({class:filter('mobile number')?'warn':''}),
            sydDOM.info_box('Email').addAttr({class:filter('email')?'warn':''}),
            sydDOM.info_box('Password').addAttr({class:filter('password')?'warn':''}),
            createElement('a',{href:'#',style:'color:#2F55DC;text-decoration:none;align-self:flex-end;padding-right:25px'},["Forget password?"]),
            sydDOM.uuidBox(),
            sydDOM.login_button()
        ],
        {
            createState:{
                stateName:'main_form_page',
                state:{
                    order:['user name','mobile number','email','password'],
                    wanted:[]
                }
            },
            type:"main_form_page"
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
            value:preState(['uuidBox','userId'],'')
        },
        [],
        {
            createState:{
                stateName:'uuidBox',
                state:{userId:''}
            },
            type:'uuidBox'
        }
    )
}
sydDOM.login_button = () =>{
    const validateInputs = (data,list) =>{
        let wanted = []
        list.forEach(val =>{
            !Object.keys(data).includes(val) ? wanted.push(val) : null
        })
        return wanted
    }
    submit_details = () =>{
        const formState = getState('main_form_page')
        formState.wanted = validateInputs(formState,formState.order)
        // console.log(formState)
        switch(Number(formState.wanted.length))
        {
            case 0:
                ws.send(JSON.stringify(new serverPackage(formState)))
            break;
            default:
                updatePopup({text:'Please enter all field before submitting'})
        }
        useState('main_form_page',{type:'a',value:formState})
    }
    return createElement(
        'div',
        {
            style:'padding:10px 0;width:100%;height:70px;min-height:70px;padding-right:25px;padding-left:30px;margin-'
        },
        [
            createElement(
                'div',
                {
                    style:'height:100%;width:100%;background:#2F55DC;display:flex;justify-content:center;align-items:center;border-radius:7px;font-weight:700;color:#fff',
                    class:'select',
                    onclick:'submit_details()',
                },
                [
                    "Create account"
                ]
            )
        ]
    )
}
sydDOM.info_box = (text = 'Email') =>{
    let type = text.toLowerCase() === 'user name' ? 'text' : text.toLowerCase();
    type = text.toLowerCase() === 'mobile number' ? 'number' : type
    updateInput = (elem,type) =>{
        const CstateForm = getState('main_form_page');
        CstateForm[`${type.toLowerCase()}`] = elem.value.toLowerCase();
        useState('main_form_page',{type:'a',value:CstateForm})
    }
    return createElement(
        'div',
        {
            style:styleComponent.info_box()
        },
        [
            createElement('p',{style:'color:grey'},[text+'*']),
            createElement(
                'input',
                {
                    style:styleComponent.input({method:'add',style:{textTransform:type === 'text' ? 'capitalize' : 'unset'}}),
                    oninput:`updateInput.bind()(this,'${text}')`,
                    value:preState(['main_form_page',text],''),
                    type:type,
                    autocomplete:'off',
                    name:type+'_n',
                    id:type + '_id'
                },)
        ]
    )
}