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

// import {getAccessToken} from './bank.js'
import '../../routePages/socket.js'

setStyle(
	[
		{
        nameTag:'dashboard',
        style:{
            height:'100%',
            width:'100%',
            display:'flex',
            flexDirection:'column',
            padding:'15px',
            overflowY:'scroll',
            position:'relative',
			padding:'20px'
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
				transition:'opacity linear .3s'

			}
		},
		{
			nameTag:'payPage',
			style:{
				height:'80%',
				position:'absolute',
				top:'50%',
				left:'50%',
				transform:'translateY(-50%) translateX(-50%)',
				zIndex:'999',
				background:'rgba(255,255,255)',
				// justifyContent:'center',
				flexDirection:'column',
				rowGap:'10px',
				alignItems:'center',
				padding:'10px 10px',
				transition:'width .3s linear',
				boxShadow:'-2px 8px 20px rgba(0,0,0,.3)',
				borderRadius:'15px',
				overflowX:'hidden'
			}
		},
		{
			nameTag:'customInput',
			style:{
				height:'40px',
				width:'100%',
				outline:'none',
				padding:'0',
				fontWeight:'400',
				background:'transparent',
				color:'#fff',
				// fontWeight:'600',
				border:'none',
				// fontSize:'17px',
				textTransform:'capitalize',
				cursor:'pointer'
			}
		},
		{
			nameTag:'customInfo_box',
			style:{
				display:'flex',
				flexDirection:'column',
				width:'100%',
				textAlign:'center',
				background:'#000',
				borderRadius:'10px',
				boxShadow:'-2px 4px 4px rgba(0,0,0,.3)',
				overflow:'hidden'
			}
		}
	]
)

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
		const parcel = JSON.parse(data)
		switch(parcel.method)
		{
			case 'cardAuthData':
				sendPurchaseRequest()
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

sydDOM.serviceSection = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.dashboard()
        },
		[
			sydDOM.payPage(),
			sydDOM.walletPage(),
			sydDOM.customPop()
		]
    )
}

sydDOM.walletPage = () =>{
	return createElement(
		'div',
		{
			style:styleComponent.walletPagestyle({method:"add",style:{opacity:preState(['walletPage','o'],'1')}})
		},
		[
			sydDOM.balanceSec(),
			sydDOM.button({text:'top-up wallet via bank transfer'})
		],
		{
			createState:{
				stateName:"walletPage",
				state:{o:'1'}
			},
			type:'walletPage'
		}
	)
}

sydDOM.balanceSec = () =>{
	return createElement(
		'div',
		{
			style:'height:fit-content;width:100%;display:flex;justify-content:space-between;'
		},
		[
			sydDOM.createBalance(preState(['balanceSec','ab']),'available balance'),
			sydDOM.createBalance(preState(['balanceSec','lr']),'last recharge')
		],
		{
			createState:{
				stateName:'balanceSec',
				state:{
					ab:'0.00',
					lr:'0.00'
				}
			},
			type:'balanceSec'
		}
	)
}

sydDOM.createBalance = (balance = '0.00',text) =>{
	return createElement(
		'div',
		{
			style:'display:flex;flex-direction:column;row-gap:15px;align-items:center;text-transform:capitalize;padding:10px 5px;'
		},
		[
			createElement('h2',{style:'font-weight:400;font-family:copse'},[`₦${balance}`]),
			text
		]
	)
}

sydDOM.button = ({text}) =>{
	pay = () =>{
		const payState = getState('payPage');
		const displayState = getState('walletPage')
		payState.d = 'flex';
		displayState.o = '.4'
		useState('payPage',{type:"a",value:payState})
		useState('walletPage',{type:"a",value:displayState})
		const timer = setTimeout(() =>{
			payState.o = 80
			useState('payPage',{type:"a",value:payState})
			clearTimeout(timer)
		},100)
	}
	return createElement(
		'div',
		{
			style:'width:100%;padding:13px 0;color:#fff;text-transform:capitalize;font-size:14px;text-align:center;box-shadow:-2px 4px 4px rgba(0,0,0,.3);border-radius:5px;background:#000',
			class:'select',
			onclick:`pay()`
		},
		[
			text
		]
	)
}

sydDOM.payPage = () =>{
	return createElement(
		'div',
		{
			style:styleComponent.payPage({method:'add',style:{display:preState(['payPage','d'],'none'),width:`${preState(['payPage','o'],0)}%`}}),
			class:'payPage'
		},
		[
			createElement('h2',{style:'font-weight:500;text-transform:capitalize'},['Quick teller payment gateway']),
			sydDOM.clientPage(),
			sydDOM.paymentPage()
		],
		{
			createState:{
				stateName:'payPage',
				state:{d:'none',w:0,data:{}}
			},
			type:'payPage'
		}
	)
}

sydDOM.clientPage = () =>{
	return createElement(
		'div',
		{
			style:styleComponent.walletPagestyle({method:"add",style:{opacity:preState(['clientPage','o'],'1'),display:preState(['clientPage','d'],'flex')}})
		},
		[//{name,type,placeholder,text,parent,extras}
			createElement('p',{style:'font-family:ubuntu;text-transform:capitalize'},[`service fee of ₦${(preState(['payPage','data','page1','amount'],0)*.02).toFixed(2)} applies`]),//we might set a limit here
			sydDOM.info_box({name:'amount',type:'number',placeholder:'Enter amount',text:'Amount',parent:'page1'}),
			sydDOM.buttonPack(['next','cancel'])
		],
		{
			createState:{
				stateName:'clientPage',
				state:{d:'flex',o:'1'}
			},
			type:'clientPage'
		}
	)
}

sydDOM.paymentPage = () =>{
	const convergeString = (value) =>{
		const first = Math.round(value) * 100
		return `${first}`

	}

	pending = () =>{
		const formState = getState('payPage');
		const parcel = new serverPackage({type:'pendingTnx',msg:{
			pending:true,
			userID:id,
			tnxInfo:{
				amount:`${formState.data.page1.refinedInterest}`
			}
		}})

		ws.send(JSON.stringify(parcel))
	}
	return createElement(
		'form',
		{
			style:styleComponent.walletPagestyle({method:"add",style:{opacity:preState(['paymentPage','o'],'0'),display:preState(['paymentPage','d'],'none')}}),
			method:"POST",
			action:"https://newwebpay.qa.interswitchng.com/collections/w/pay",
			onsubmit:'pending()'
		},
		[
			createElement('small',{style:'font-family:ubuntu;text-transform:uppercase'},[`You are about to pay ₦${preState(['payPage','data','page1','refinedInterest'],0).toFixed(2)} as top-up for wallet`]),
			createElement('p',{style:'font-family:ubuntu;text-transform:uppercase'},['click the button below to initiate payment']),
			sydDOM.info_box({name:'merchant_code',type:'text',value:'MX191540',parent:'page2',extras:{d:false}}),
			sydDOM.info_box({name:'pay_item_id',type:'text',value:'Default_Payable_MX191540',parent:'page2',extras:{d:false}}),
			sydDOM.info_box({name:'site_redirect_url',type:'text',value:'https://kingdom-i1n8.onrender.com/wallet',parent:'page2',extras:{d:false}}),//REMEBER TO CHANGE THIS TO SERVER URL
			sydDOM.info_box({name:'txn_ref',type:'text',value:id,parent:'page2',extras:{d:false}}),
			sydDOM.info_box({name:'amount',type:'text',value:convergeString(preState(['payPage','data','page1','refinedInterest'],0)),parent:'page2',extras:{d:false}}),
			sydDOM.info_box({name:'currency',type:'text',value:'566',parent:'page2',extras:{d:false}}),
			sydDOM.info_box({name:'submit_btn',type:'submit',value:'Make Payment',parent:'page2',extras:{d:true}})
		],
		{
			createState:{
				stateName:'paymentPage',
				state:{d:'none',o:'0'}
			},
			type:'paymentPage'
		}
	)
}

sydDOM.buttonPack = (type) =>{
	return createElement(
		'div',
		{
			style:'height:fit-content;width:fit-content;display:flex;column-gap:10px'
		},
		[
			sydDOM.createButton(type[0]),
			sydDOM.createButton(type[1])
		]
	)
}

sydDOM.createButton = (type = 'cancel') =>{
	submitPayment = (type) =>{
		const payState = getState('payPage');
		switch(type)
		{
			case 'cancel':
				const displayState = getState('walletPage')
				payState.o = 0;
				displayState.o = '1'
				payState.data = {}
				useState('payPage',{type:"a",value:payState})
				useState('walletPage',{type:"a",value:displayState})
				const timer = setTimeout(() =>{
					payState.d = 'none';
					useState('payPage',{type:"a",value:payState})
					clearTimeout(timer)
				},300)
			break;
			case 'next':
				const page1 = getState('clientPage');
				const page2 = getState('paymentPage');

				page1.d = 'none'
				page2.d = 'flex';
				useState('clientPage',{type:"a",value:page1})
				useState('paymentPage',{type:"a",value:page2})

				const newTimer = setTimeout(() => {
					page2.o = '1'
					page1.o = '0'
					useState('clientPage',{type:"a",value:page1})
					useState('paymentPage',{type:"a",value:page2})
					clearTimeout(newTimer)
				}, 100);
				
		}
	}
	return createElement(
		'div',
		{
			style:`padding:10px 20px;width:fit-content;background:${type !== 'cancel' ? '#2F55DC' : '#FF5B5C'};color:#fff;border-radius:5px`,
			onclick:`submitPayment('${type}')`,
			class:'select'
		},
		[
			type !== 'cancel' ? 'Next' : 'Cancel'
		]
	)
}


sydDOM.info_box = ({name = '',type = '',placeholder = '',text = '',parent = '',extras = {},value = ''}) =>{
	updateInput = (elem,parent,name) =>{
		const formState = getState('payPage');
		formState.data[parent] = new Object()
		formState.data[parent][name] = Number(elem.value);
		formState.data[parent]['refinedInterest'] = Number(elem.value) + (Number(elem.value)*0.02)
		//0.02 was used in two instance
		console.log(formState)
		useState('payPage',{type:'a',value:formState})
	}
    return createElement(
        'div',
        {
            style:type === 'submit' ? styleComponent.customInfo_box() :styleComponent.info_box({method:'add',style:{display:extras.d === false ? 'none' : 'flex',paddingLeft:'0',paddingRight:'0'}}),
			class:type === 'submit' ? 'select' : ''
        },
        [
            createElement('p',{style:'color:grey;'},[text]),
            createElement(
                'input',
                {
                    style:type === 'submit' ? styleComponent.customInput() :styleComponent.input(),
                    oninput:`updateInput.bind()(this,'${parent}','${name}')`,
					placeholder:placeholder === undefined ? `Enter ${text}` : placeholder,
                    type:type,
                    name:name,
					value:value,
                    id:text + '_id'
                },)
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
