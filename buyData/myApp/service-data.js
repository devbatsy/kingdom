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
            position:'relative'
        }
    },
    {
        nameTag:"dataheaderContent",
        style:{
            height:'fit-content',
            display:'flex',
            flexDirection:'column',
            rowGap:'10px',
            padding:'12px',
            paddingTop:'15px',
            background:'#fff',
            position:'relative',
            transition:'opacity linear .3s'
        }
    },
    {
        nameTag:'dataPage',
        style:{
            position:'absolute',
            top:'0',
            left:'0',
            height:'fit-content',
            width:'100%',
            flexDirection:'column',
            background:'#fff',
            boxShadow:'-2px 8px 20px rgba(0,0,0,.2)',
            transition:'opacity linear .3s'
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
    },
    {
        nameTag:'blocks',
        style:{
            height:'fit-content',
            display:'flex',
            flexDirection:'column',
            rowGap:'10px'
        }
    }
])

const selectObject = {
    network:[
        'mtn',
        'airtel',
        'glo',
        '9mobile'
    ],
    'purchase type':[
        'Data',
        'Airtime'
    ],
    data:[
        '200mb ---- ₦00.00',
        '500mb ---- ₦00.00',
        '1gb ---- ₦00.00',
        '2gb ---- ₦00.00',
        '5gb ---- ₦00.00'
    ],
    airtime:[
        '₦50.00',
        '₦100.00',
        '₦150.00',
        '₦200.00',
        '₦300.00',
        '₦500.00',
        '₦1000.00',
        '₦1500.00',
        '₦2000.00',

    ]
}
const regSelect = /(\d{1,})(\w{0,2})/;
const regAirtime = /\d{1,}/
class serverPackage{
    constructor(msg)
    {
        this.type = 'dataPurchase';
        this.msg = msg
    }
}

const fetchData = () =>{
	const getData = new XMLHttpRequest();

	getData.open('POST','dataTransaction',true);
	
    getData.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
	getData.send(id);
	
	getData.addEventListener('load',e =>{
		switch(true)
		{
			case e.target.readyState === 4 && e.target.status === 200:
				const transactionData = JSON.parse(e.target.responseText);
                switch(transactionData.error)
                {
                    case false:
                        const transactionPageState = getState('transactionPage');
                        transactionData.data.forEach((val,idx) =>{
                            const {phoneNo,date,subscription,status} = val
                            transactionPageState.transacData.push(
                                {
                                    number:`${phoneNo}`,
                                    status:status,
                                    date:date,
                                    sub:subscription,
                                }
                            )
                        })
                        console.log(transactionPageState)
                        useState('transactionPage',{type:'a',value:transactionPageState})
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
        initLoader();
    },4000)
}
ws.addEventListener('open', () =>{
    sockectConnectionState = true;
    updatePopup({text:'connection sucessful',bg:'rgba(92, 248, 92, 0.5)'})
    ws.addEventListener('message',({data}) =>{
        switch(JSON.parse(data).method)
        {
            case 'purchaseStatus':
                clearTimeout(pop_timer);
                switch(JSON.parse(data).status)
                {
                    case false:
                        updatePopup({text:`${JSON.parse(data).transType} purchase failed due to ${JSON.parse(data).reason}`});
                    break;
                    default:
                        updatePopup({text:`${JSON.parse(data).transType} purchase sucessfull, you will be credited shortly`,bg:'rgba(92, 248, 92, 0.5)'})
                }
            break;
            case 'purchaseTransaction':
                const transState = getState('transactionPage');
                transState.transacData.push(
                    JSON.parse(data)
                )
                useState('transactionPage',{type:'a',value:transState})
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
            sydDOM.mainDataPage(),
            sydDOM.transactionPage(),
            sydDOM.customPop()
        ]
    )
}
sydDOM.mainDataPage = () =>{
    const dataMode = () =>{
        const mode = preState(['mainDataPage','dMode'],0);
        let currentMode;
        switch(mode)
        {
            case 0:
                currentMode = sydDOM.select_box('Data')
            break;
            default:
                currentMode = sydDOM.select_box('Airtime')
        }
        return currentMode
    }
    const filter = (param) =>{
        const wanted = preState(['mainDataPage','wanted'],[]);
        return wanted.includes(param)
    }
    return createElement(
        'div',
        {
            style:styleComponent.dataPage({
                method:'add',
                style:{
                    display:preState(['mainDataPage','d'],'flex'),
                    opacity:preState(['mainDataPage','o'],'1'),
                }
            })
        },
        [
            sydDOM.dataHeader({content:['data subscription','view transaction'],param:0}),
            createElement(
                'form',
                {
                    style:styleComponent.dataheaderContent({method:'add',style:{background:''}}),
                },
                [
                    sydDOM.select_box('Network').addAttr({class:filter('network')?'warn':''}),
                    sydDOM.select_box('purchase type').addAttr({class:filter('purchase type')?'warn':''}),
                    dataMode().addAttr({class:filter(preState(['mainDataPage','dMode'],0) === 0 ? 'data' : 'airtime')?'warn':''}),
                    sydDOM.info_box({text:'Mobile Number',params:['number','mobile_name','mobile_id'],readonly:false}).addAttr({class:filter('number')?'warn':''}),
                    sydDOM.login_button()
                ]
            )
        ],
        {
            createState:{
                stateName:'mainDataPage',
                state:{
                    d:'flex',
                    o:'1',
                    data:{},
                    dMode:0,
                    wanted:[],
                    order:['network','purchase type','data','airtime','number']
                }
            },
            type:'mainDataPage'
        }
    )
}
sydDOM.transactionPage = () =>{
    const rendertrans = () =>{
        const details = preState(['transactionPage','transacData'],[]);
        const render = []
        details.forEach((val,id) =>{
            render.push(
                sydDOM.rowElement({content:[`${id+1}`,val.number,val.sub,val.date,val.status === true ? 'success' : 'failed']})
            )
        })
        return render
    }
    return createElement(
        'div',
        {
            style:styleComponent.dataPage({
                method:'add',
                style:{
                    display:preState(['transactionPage','d'],'none'),
                    opacity:preState(['transactionPage','o'],'0'),
                }
            })
        },
        [
            sydDOM.dataHeader({content:['transaction history','buy data'],param:1}),
            sydDOM.rowElement({content:['s/n','mobile no.','subscription','date','status']}),
            ...rendertrans()
        ],
        {
            createState:{
                stateName:'transactionPage',
                state:{d:'none',o:'0',transacData:[]}
            },
            type:'transactionPage'
        }
    )
}

sydDOM.rowElement = ({content = []} = {}) =>{
    return createElement(
        'div',
        {
            style:'height:fit-content;min-height:50px;display:flex;align-items:center;text-transform:capitalize;border-bottom:1px solid lightgrey',
            class:'rowElements'
        },
        [
            sydDOM.col1(content[0]),
            sydDOM.col2(content[1]),
            sydDOM.col2(content[2]),
            sydDOM.col2(content[3]),
            sydDOM.col2(content[4]),
        ]
    )
}
sydDOM.col1 = (text = 's/n') =>{
    return createElement(
        'div',
        {
            style:'height:fit-content;min-width:50px;width:50px;display:flex;justify-content:center;align-items:center'
        },
        [
            text
        ]
    )
}

sydDOM.col2 = (text = 'mobile no.') =>{
    return createElement(
        'div',
        {
            style:'height:fit-content;width:calc((100% - 50px)/3);display:flex;justify-content:center;align-items:center'
        },
        [
            text
        ]
    )
}

sydDOM.transTextModel = (text) =>{
    return createElement(
        'p',
        {style:'text-transform:capitalize'},
        [
            text
        ]
    )
}

sydDOM.dataHeader = ({content = [],param} = {}) =>{
    changeDataTab = (id) =>{
        const states = ['transactionPage','mainDataPage'];

        const trueState = getState(states[id]);
        trueState.d = 'flex';
        useState(states[id],{type:'a',value:trueState})
        const timer = setTimeout(() =>{
            clearTimeout(timer);
            trueState.o = '1'
            useState(states[id],{type:'a',value:trueState})
        },100);

        // update false states
        for(let state_id in states)
        {
            switch(true)
            {
                case Number(state_id) !== id:
                    const falseState = getState(states[state_id]);
                    falseState.o = '0';
                    useState(states[state_id],{type:'a',value:falseState})
                    const timer = setTimeout(() => {
                        clearTimeout(timer);
                        falseState.d = 'none';
                        useState(states[state_id],{type:'a',value:falseState})
                    }, 300);
            }
        }


    }
    return createElement(
        'div',
        {
            style:'height:80px;width:100%;border-bottom:1px solid lightgrey;display:flex;justify-content:space-between;padding:0 15px;align-items:center;',
            id:"header"
        },
        [
            createElement('h3',{style:"font-weight:300;color:#000;text-transform:capitalize"},[content[0]]),
            createElement(
                'p',
                {
                    style:'padding:10px 15px;color:#fff;background:#2F55DC;border-radius:5px;',
                    class:'select',
                    onclick:`changeDataTab(${param})`
                },
                [
                    content[1]
                ]
            )
        ]
    )
}














sydDOM.info_box = ({text = 'Email',params = [],readonly = true} = {}) =>{
    updateInput = (elem) =>
    {
        const formState = getState('mainDataPage');
        formState.data['number'] = elem.value;
        useState('mainDataPage',{type:'a',value:formState})
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
                    oninput:`updateInput.bind()(this)`,
                    // value:preState(['view','data',text.toLowerCase()],''),
                    type:params[0],
                    name:params[1],
                    id:params[2]
                })
        ]
    )
}



sydDOM.select_box = (type = 'state',bool = false) =>{
    const options = () =>{
        let array = [sydDOM.disable_option(`select ${type}`)];
        selectObject[type.toLowerCase()].forEach(val =>{
            array.push(sydDOM.option(val))
        });
        return array;
    }
    optionClick = (elem,type) =>{
        let value = selectObject[type.toLowerCase()][elem.selectedIndex-1];
        const formState = getState('mainDataPage');
        switch(true)
        {
            case type.toLowerCase() === 'data':
                value = regSelect.exec(value)[0]
            break;
            case type.toLowerCase() === 'airtime':
                value = regAirtime.exec(value)[0]
        }
        formState.data[type.toLowerCase()] = value;
        useState('mainDataPage',{type:'a',value:formState})

        switch(type)
        {
            case 'purchase type':
                const formState = getState('mainDataPage');
                switch(value.toLowerCase())
                {
                    case 'data':
                        formState.dMode = 0
                        delete formState.data['airtime']
                    break;
                    default:
                        formState.dMode = 1
                        delete formState.data['data']
                }
                useState('mainDataPage',{type:'a',value:formState})
        }
    }
    return createElement(
        'div',
        {
            style:styleComponent.info_box()
        },
        [
            createElement('p',{style:'color:grey;text-transform:capitalize'},[bool ? type+'*' : type]),
            createElement('select',{
                style:styleComponent.input({method:'add',style:{cursor:'pointer',fontSize:'16px',fontFamily:'ubuntu',textTransform:'capitalize'}}),
                name:type.split(' ').join('_') +`_${type[0].toLowerCase()}_`+'n',
                id:type.split(' ').join('_') +`_${type[0].toLowerCase()}_`+'id',
                onchange:`optionClick.bind()(this,'${type}')`
            },
            [
                ...options()
            ]
            )
        ]
    )
}

sydDOM.login_button = () =>{
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
    sendData = () =>{
        const formState = getState('mainDataPage');
        const parcel = formState.data;
        parcel.userId = id
        let validateInputsArray = validateInputs(formState.data,formState.order)
        switch(Number(validateInputsArray.length))
        {
            case 1:
                ws.send(JSON.stringify(new serverPackage(parcel)))
            break;
            default:
                updatePopup({text:'Please enter all field before submitting'})
        }
        formState.wanted = validateInputsArray
        useState('mainDataPage',{type:'a',value:formState})
    }
    return createElement(
        'div',
        {
            style:'padding:10px 0;width:100%;height:60px;min-height:60px;padding-right:25px;padding-left:10px;display:flex;align-items:center'
        },
        [
            createElement(
                'div',
                {
                    style:'height:fit-content;width:fit-content;padding:10px 20px;background:#2F55DC;display:flex;justify-content:center;align-items:center;border-radius:7px;font-weight:700;color:#fff',
                    class:'select',
                    onclick:'sendData()'
                },
                [
                    "proceed"
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
            style:'font-family:ubuntu;font-size:16px;text-transform:capitalize;font-family:ubuntu',
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
