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
            flexDirection:'column',
            padding:'15px',
            overflowY:'scroll',
            position:'relative'
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
            transition:'opacity linear .3s',
            overflowX:'scroll'
        }
    },
])

sydDOM.serviceSection = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.dashboard()
        },
        [
            sydDOM.dataHeader(),
            sydDOM.transactionPage()
        ]
    )
}

sydDOM.dataHeader = (content = ['transaction']) =>{
    return createElement(
        'div',
        {
            style:'height:80px;width:100%;border-bottom:1px solid lightgrey;display:flex;justify-content:space-between;padding:0 15px;align-items:center;',
            id:"header"
        },
        [
            createElement('h3',{style:"font-weight:300;color:#000;text-transform:capitalize"},[content[0]])
        ]
    )
}

sydDOM.transactionPage = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.dataPage({method:'remove',style:['position']})
        },
        [
            sydDOM.rowElement({content:['s/n','transaction type','quantity','amount', 'date', 'status','action']}),
            // sydDOM.rowElement({content:['1','school fees payment','5','100000','04/27/2004','success','']}),
        ],
        {
            createState:{
                stateName:'transactionPage',
                state:{d:'none',o:'0',transacData:{}}
            },
            type:'transactionPage'
        }
    )
}

sydDOM.rowElement = ({content = []} = {}) =>{
    return createElement(
        'div',
        {
            style:'height:fit-content;min-height:50px;min-width:400px;display:flex;align-items:center;text-transform:capitalize;border-bottom:1px solid lightgrey',
            class:'rowElements'
        },
        [
            sydDOM.col1(content[0]),
            sydDOM.col2(content[1]),
            sydDOM.col2(content[2]),
            sydDOM.col2(content[3]),
            sydDOM.col2(content[4]),
            sydDOM.col2(content[5]),
            sydDOM.col2(content[6]),
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
            style:'height:fit-content;width:calc((100% - 50px)/6);display:flex;justify-content:center;align-items:center'
        },
        [
            text
        ]
    )
}