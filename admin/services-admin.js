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
} from "../sydneyLib/sydneyDom.js";

import '../routePages/mainComponent.js'
import '../../routePages/socket.js'

setStyle([
    {
		nameTag:'container',
		style:{
			height:'100vh',
			width:'100vw',
			display:'flex',
			fontFamily:'ubuntu',
			position:'relative',
            display:'flex',
            justifyContent:'center',
            padding:'10px'
		}
	},
    {
        nameTag:'walletPagestyle',
        style:{
            height:'fit-content',
            width:'100%',
            background:'#fff',
            boxShadow:'-2px 8px 20px rgba(0,0,0,.2)',
            borderRadius:'10px',
            padding:'20px 20px',
            display:'flex',
            flexDirection:'column',
            rowGap:'15px',

        }
    },
    {
        nameTag:'info_box',
        style:{
            display:'flex',
            flexDirection:'column',
            rowGap:'20px',
            width:'100%',
            // marginBottom:'20px',
            padding:'10px',
            paddingRight:'10px',
            paddingLeft:'10px'
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
    }
])

const selectObject = {
    active:[
        'active',
        'inactive'
    ]
}

class serverPackage{
    constructor({msg,type})
    {
        this.type = type;
        this.msg = msg
    }
}

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
        switch(JSON.parse(data).status)
        {
            case true:
                updatePopup({text:JSON.parse(data).reason,bg:'rgba(92, 248, 92, 0.5)'})
            break;
            default:
                updatePopup({text:`${JSON.parse(data).reason}`})
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

sydDOM.container = () =>{
	return createElement(
		'div',
		{
			style:styleComponent.container(),
			id:'container'
		},
		[
			sydDOM.addItems(),
            sydDOM.customPop()
		]
	)
}

sydDOM.addItems = () =>{
    const filter = (param) =>{
        const wanted = preState(['addItems','wanted'],[]);
        const formState = preState(['addItems','data'],{})
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
		'div',
		{
			style:styleComponent.walletPagestyle({method:'add',style:{width:'100%',maxWidth:'700px',background:'#fff'}})
		},
		[
			createElement('h2',{style:'text-transform:uppercase;text-decoration:underline;font-weight:400;line-height:70px;font-family:copse;width:100%;'},['create items']),
            sydDOM.info_box({text:'service type',params:['text','service_name',
            'service_id'],readonly:false}).addAttr({class:filter('servicetype')?'warn':''}),
            sydDOM.info_box({text:'service price',params:['text','price_name',
            'price_id'],readonly:false}).addAttr({class:filter('serviceprice')?'warn':''}),
            sydDOM.select_box('active').addAttr({class:filter('active')?'warn':''}),
            sydDOM.info_box({text:'password',params:['text','pass_name',
            'pass_id'],readonly:false}).addAttr({class:filter('password')?'warn':''}),
            sydDOM.button()

		],
        {
            createState:{
                stateName:"addItems",
                state:{data:{},order:['password','servicetype','serviceprice','active'],wanted:[]}
            },
            type:'addItems'
        }
	)
}

sydDOM.button = (type = 'Create') =>{
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

    submit = () =>{
        const formState = getState('addItems');
        let validateInputsArray = validateInputs(formState.data,formState.order)
        formState.wanted = validateInputsArray;
        useState('addItems',{type:'a',value:formState})

        switch(Number(validateInputsArray.length))
        {
            case 0:
                ws.send(JSON.stringify(new serverPackage({msg:formState.data,type:'addItems'})))
            break;
            default:
                updatePopup({text:'Please enter all field before submitting'})
        }
    }
    return createElement(
		'div',
		{
			style:`padding:10px 20px;width:fit-content;background:${type !== 'cancel' ? '#2F55DC' : '#FF5B5C'};font-weight:700;font-size:18px;color:#fff;border-radius:5px`,
			onclick:`submit()`,
			class:'select'
		},
		[
			type+'  ',
            createElement('i',{class:'fa-solid fa-folder-plus'})
		]
	)
}

sydDOM.info_box = ({text = 'amount',params = [],readonly = true} = {}) =>{
    updateInput = (elem,type) =>{
        const itemState = getState('addItems');
        itemState.data[type] = elem.value;
        useState('addItems',{type:'a',value:itemState})
    }
    return createElement(
        'div',
        {
            style:styleComponent.info_box()
        },
        [
            createElement('p',{style:'color:grey;text-transform:capitalize;'},[!readonly ? text+'*' : text]),
            createElement(
                'input',
                {
                    style:styleComponent.input({method:'add',style:{fontFamily:'copse'}})+`pointer-events:${readonly ? 'none' : 'unset'}`,
                    oninput:`updateInput.bind()(this,'${text.split(' ').join('')}')`,
                    type:params[0],
                    name:params[1],
                    id:params[2]
                })
        ]
    )
}

sydDOM.select_box = (type = 'quantity',bool = true) =>{
    const options = () =>{
        let array = [sydDOM.disable_option(`select active state`)];
        selectObject[type.toLowerCase()].forEach(val =>{
            array.push(sydDOM.option(val))
        });
        return array;
    }

    optionClick = (elem,type) =>{
        let value = selectObject[type.toLowerCase()][elem.selectedIndex-1];
        const formState = getState('addItems');
        formState.data[type.toLowerCase()] = value;
        useState('addItems',{type:'a',value:formState})
    }

    let name = type.split(' ').join('_') +`_${type[0]}_`+'n';
    let id = type.split(' ').join('_') +`_${type[0]}_`+'id'
    return createElement(
        'div',
        {
            style:styleComponent.info_box()
        },
        [
            createElement('p',{style:'color:grey;text-transform:capitalize;'},[bool ? type+'*' : type]),
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
            style:'font-family:copse;font-size:14px;text-transform:capitalize',
        },
        [
            `${value}`
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
            style:'font-family:copse;font-size:14px;'
        },
        [
            `${value}`
        ]
    )
}

sydDOM.customPop = () =>{
	return createElement(
		'div',
		{
			style:`height:fit-content;width:300px;background:${preState(['customPop','bg'],'rgba(194,74,74,0.7)')};color:#000;position:fixed;z-index:1100;top:0;left:50%;transform:translateX(-50%) translateY(${preState(['customPop','y'],-120)}%);display:flex;justify-content:center;align-items:center;padding:20px 10px;font-size:14px;text-align:center;transition:all linear .3s;overflow:hidden;opacity:${preState(['customPop','y'],-120) === -120 ? '0' : '1'}`
		},
		[
			preState(['customPop','text'],''),
			sydDOM.popLoader()
		],
		{
			createState:{
				stateName:'customPop',
				state:{y:-120,text:'',bg:'rgba(194,74,74,0.7)'}
			},
			type:'customPop'
		}
	)
}
sydDOM.popLoader = () =>{
	return createElement(
		'div',
		{
			style:`position:absolute;bottom:0;height:3px;opacity:.6;width:100%;transform:translateX(${(preState(['popLoader','trans'],0)/-2.4)}%);background:#9db1f8a9`
		},
		[],
		{
			createState:{
				stateName:'popLoader',
				state:{trans:0}
			},
			type:'popLoader'
		}
	)
}

mount(sydDOM.container())