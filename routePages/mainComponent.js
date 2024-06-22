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

let route;

import {} from './side_bar.js';


setStyle([
	{
		nameTag:'container',
		style:{
			height:'100vh',
			width:'100vw',
			display:'flex',
			fontFamily:'ubuntu',
			position:'relative',
			fontWeight:'400'
		}
	},
	{
		nameTag:'sideBar',
		style:{
			height:'100%',
			display:'flex',
			transition:'transform linear .3s',
			border:'1px solid lightgrey',
			background:'#2F55DC',
			padding:'10px',
			paddingTop:'90px',
			rowGap:'20px',
			flexDirection:'column',
			overflowY:'scroll',
			zIndex:'1000'
		}
	},
	{
		nameTag:"mainDisplay",
		style:{
			height:'100%',
			width:'100%',
			position:'relative',
			paddingTop:'70px'
		}
	},
	{
		nameTag:"main_header",
		style:{
			height:'70px',
			width:'100%',
			position:'absolute',
			border:'1px solid lightgrey',
			top:'0',
			left:'0',
			background:'#fff',
			display:'flex',
			justifyContent:'flex-end',
			alignItems:'center',
			columnGap:'20px',
			paddingRight:'30px'
		}
	},
	{
		nameTag:'bg',
		style:{
			backgroundPosition:'center',
			backgroundSize:'cover',
			backgroundRepeat:'no-repeat'
		}
	},
	{
		nameTag:"menuBtn",
		style:{
			height:'30px',
			width:'30px',
			position:'absolute',
			top:'10px',
			left:'10px',
			opacity:'.7'
		}
	},
	{
        nameTag:'info_box',
        style:{
            display:'flex',
            flexDirection:'column',
            rowGap:'20px',
            width:'100%',
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
			padding:'0',
            paddingLeft:'20px',
			fontWeight:'400'
        }
    },
])

sydDOM.container = () =>{
	return createElement(
		'div',
		{
			style:styleComponent.container(),
			id:'container'
		},
		[
			sydDOM.inputRemote(),
			sydDOM.sideBar(),
			sydDOM.mainDisplay(),
			sydDOM.menuBtn(),
			sydDOM.whatsapp()
		]
	)
}
sydDOM.whatsapp = () =>{
	return createElement(
		'div',
		{
			style:'position:fixed;bottom:30px;z-index:999;right:20px;height:60px;width:60px;box-shadow:1.5px 1.5px 3px rgba(0,0,0,.6);background-color:rgba(58,218,137);border-radius:50%;'+styleComponent.bg({method:'add',style:{backgroundSize:'60%',backgroundImage:`url('./img/whatapp.png')`}}),
			class:'select'
		}
	)
}

sydDOM.menuBtn = () =>{
	return createElement(
		'label',
		{
			style:styleComponent.menuBtn({method:'add',style:{backgroundImage:'url("./img/menu.png")'}})+styleComponent.bg(),
			class:'select menus',
			for:'menuCheck'
		}
	)
}

sydDOM.inputRemote = () =>{
	return createElement(
		'input',
		{
			type:'checkbox',
			style:"display:none;position:absolute;left:200px;top:200px;z-index:250",
			id:'menuCheck'
		}
	)
}

sydDOM.mainDisplay = () =>{
	return createElement(
		'div',
		{
			style:styleComponent.mainDisplay()
		},
		[
			sydDOM.main_display_header(clientName),
			sydDOM.serviceSection()
		]
	)
}

sydDOM.main_display_header = (username = 'user') =>{
	return createElement(
		'div',
		{
			style:styleComponent.main_header()
		},
		[
			sydDOM.headerName(username),
			sydDOM.activeProfile(username[0] === ' ' ? 'X' : username[0])
		]
	)
}
sydDOM.headerName = (username) =>{
	return createElement(
		'div',
		{
			style:"heightL100%;width:fit-content;display:flex;justify-content:center;align-items:flex-end;color:grey;flex-direction:column"
		},
		[
			createElement('p',{style:'color:lightgrey;text-transform:capitalize'},[`${username}`]),
			'customer'
		]
	)
}
sydDOM.activeProfile = (alpha) =>{
	return createElement(
		'div',
		{
			style:'height:40px;width:40px;background-color:rgba(58,218,137);display:flex;justify-content:center;align-items:center;color:#fff;font-weight:700;position:relative;border-radius:50%;text-transform:uppercase',
			id:'activeProfile'
		},
		[
			alpha
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