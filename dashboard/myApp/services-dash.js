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
            // background:'green',
            display:'flex',
            justifyContent:'center',
            flexWrap:'wrap',
            columnGap:'15px',
            rowGap:'15px',
            padding:'15px',
            overflowY:'scroll'
        }
    },
    {
        nameTag:"card",
        style:{
            boxShadow:'-2px 8px 20px rgba(0,0,0,.2)',
            display:'flex',
            flexDirection:'column',
            color:'#2F55DC',
            fontWeight:'100',
            borderRadius:'5px',
            overflow:'hidden',
            rowGap:'10px',
            height:'fit-content',
            paddingBottom:'10px'
        }
    },
    {
        nameTag:'payPage',
        style:{
            height:'100%',
            width:'100%',
            position:'absolute',
            top:'0',
            left:'0',
            zIndex:'999',
            background:'rgba(255,255,255,.6)',
            justifyContent:'center',
            alignItems:'center',
            padding:'0 10px',
            transition:'opacity .3s linear'
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
            rowGap:'30px',

        }
    },
])

const selectObject = {
    quantity:[1,2,3,4,5,6,7,8,9,10]
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

sydDOM.serviceSection = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.dashboard()
        },
        [
            sydDOM.customPop(),
            sydDOM.payPage(),
            sydDOM.card({price:4000,itemId:1,image:'waec'}),
            sydDOM.card({serviceType:'NECO Result Checker',price:1000, itemId:2,image:'neco'}),
            sydDOM.card({serviceType:'NABTEB Result Checker',price:1500,itemId:3,image:'nabteb'}),
            // sydDOM.card(),
            // sydDOM.card(),
            // sydDOM.card(),
        ]
    )
}

sydDOM.card = ({image = '', serviceType = 'WAEC Result Checker', price = 2000, itemId = ''} = {}) =>{
    return createElement(
        'div',
        {
            style:styleComponent.card(),
            class:'cards'
        },
        [
            createElement(
                'div',
                {
                    style:'min-height:50%;width:100%;'+styleComponent.bg({method:'add',style:{backgroundImage:`url("../../routePages/img/${image}.jpg")`,backgroundColor:'#2F55DC'}}),
                    class:'cardImg'
                }
            ),
            createElement('div',{
                style:'display:flex;row-gap:15px;justify-content:center;flex-direction:column;height:100%;padding:0 15px',
            },
            [
                createElement('p',{class:'serviceFont'},[serviceType]),
                createElement('p',{class:'priceFont'},[`₦${price}.00`]),
                sydDOM.proceedBtn(serviceType,price,itemId)
            ])
        ]
    )
}
sydDOM.proceedBtn = (type,price,itemId) =>{
    proceed = (type,price,itemId) =>{
        const payState = getState('payPage');
		payState.d = 'flex';
        payState.data = {
            type:type,
            price:price,
            itemId:itemId,
            quantity:'0'
        }
		useState('payPage',{type:"a",value:payState})
		const timer = setTimeout(() =>{
				payState.o = '1'
				useState('payPage',{type:"a",value:payState})
				clearTimeout(timer)
		},100)
    }
    return createElement(
        'div',
        {
            style:'height:40px;width:100%;background:#2F55DC;font-weight:400;color:#fff;display:flex;align-items:center;justify-content:center;border-radius:5px;text-transform:capitalize',
            class:'select',
            onclick:`proceed('${type}','${price}','${itemId}')`
        },
        [
            'proceed'
        ]
    )
}

sydDOM.payPage = () =>{
    return createElement(
		'div',
		{
			style:styleComponent.payPage({method:'add',style:{display:preState(['payPage','d'],'none'),opacity:preState(['payPage','o'],'0')}})
		},
		[
			sydDOM.transacPage()
		],
		{
			createState:{
				stateName:'payPage',
				state:{d:'none',o:'0',data:{}}
			},
			type:'payPage'
		}
	)
}

sydDOM.transacPage = () =>{
    return createElement(
		'div',
		{
			style:styleComponent.walletPagestyle({method:'add',style:{width:'100%',maxWidth:'700px',background:'#fff'}})
		},
		[
			createElement('h4',{style:'font-weight:100;text-transform:capitalize;line-height:70px;width:100%;'},[preState(['payPage','data','type'],'')]),
            sydDOM.select_box(),
            sydDOM.info_box({params:['text','amount_name','amount_id']}),
            sydDOM.buttonPack(),

		],
        {
            createState:{
                stateName:"transacPage",
                state:{}
            },
            type:'transacPage'
        }
	)
}

sydDOM.buttonPack = () =>{
	return createElement(
		'div',
		{
			style:'height:fit-content;width:fit-content;display:flex;column-gap:10px'
		},
		[
			sydDOM.createButton('submit'),
			sydDOM.createButton('cancel')
		]
	)
}

sydDOM.createButton = (type) =>{
	submit = (type) =>{
		switch(type)
		{
			case 'cancel':
				const payState = getState('payPage');
				payState.o = '0';
				useState('payPage',{type:"a",value:payState})
				const timer = setTimeout(() =>{
					payState.d = 'none';
					useState('payPage',{type:"a",value:payState})
					clearTimeout(timer)
				},300)
			break;
			default:
                const parcel = getState('payPage').data
                parcel.userID = id
				ws.send(JSON.stringify(new serverPackage({msg:parcel,type:'dashboardPurchase'})))
		}
	}
	return createElement(
		'div',
		{
			style:`padding:10px 20px;width:fit-content;background:${type !== 'cancel' ? '#2F55DC' : '#FF5B5C'};border-radius:5px`,
			onclick:`submit('${type}')`,
			class:'select'
		},
		[
			type
		]
	)
}


sydDOM.select_box = (type = 'quantity',bool = true) =>{
    const options = () =>{
        let array = [sydDOM.disable_option(`0`)];
        selectObject[type.toLowerCase()].forEach(val =>{
            array.push(sydDOM.option(val))
        });
        return array;
    }

    optionClick = (elem,type) =>{
        let value = selectObject[type.toLowerCase()][elem.selectedIndex-1];
        const formState = getState('payPage');
        // console.log(formState)
        formState.data[type.toLowerCase()] = value;
        useState('payPage',{type:'a',value:formState})
    }

    let name = type.split(' ').join('_') +`_${type[0]}_`+'n';
    let id = type.split(' ').join('_') +`_${type[0]}_`+'id'
    return createElement(
        'div',
        {
            style:styleComponent.info_box({method:'remove',style:['paddingRight','paddingLeft','padding']})
        },
        [
            createElement('p',{style:'color:grey;text-transform:capitalize;'},[bool ? type+'*' : type]),
            createElement('select',{
                style:styleComponent.input({method:'add',style:{cursor:'pointer',fontSize:'16px',fontFamily:'copse',textTransform:'capitalize'}}),
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

sydDOM.info_box = ({text = 'amount',params = [],readonly = true} = {}) =>{
    return createElement(
        'div',
        {
            style:styleComponent.info_box({method:'remove',style:['paddingRight','paddingLeft','padding']})
        },
        [
            createElement('p',{style:'color:grey;text-transform:capitalize;'},[!readonly ? text+'*' : text]),
            createElement(
                'input',
                {
                    style:styleComponent.input({method:'add',style:{fontFamily:'copse'}})+`pointer-events:${readonly ? 'none' : 'unset'}`,
                    value:Number(preState(['payPage','data','quantity'],'0')) * Number(preState(['payPage','data','price'],'0')),
                    type:params[0],
                    name:params[1],
                    id:params[2]
                })
        ]
    )
}

sydDOM.option = (value) =>{
    return createElement(
        'option',
        {
            value:value,
            style:'font-family:copse;font-size:16px;text-transform:capitalize',
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
            style:'font-family:copse;font-size:16px;'
        },
        [
            `${value}`
        ]
    )
}