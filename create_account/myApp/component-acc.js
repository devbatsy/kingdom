import { 
	sydDOM,
	setStyle,
	styleComponent,
	mount,
	getState,
	preState,
	createElement 
} from "../../sydneyLib/sydneyDom.js";

import {} from './main_acc.js'

setStyle([
	{
		nameTag:'container',
		style:{
			height:'100vh',
			width:'100vw',
			overflow:'hidden',
			fontFamily:'ubuntu',
			display:'flex',
			maxHeight:'1200px',
			maxWidth:'1500px',
			position:'absolute',
			top:'50%',
			left:'50%',
			transform:'translateX(-50%) translateY(-50%)'
		}
	},
	{
		nameTag:'part_one',
		style:{
			height:'100vh',
			width:'50vw',
			display:'flex',
			flexDirection:'column',
			padding:'10px 0',
			paddingTop:"20px",
			rowGap:'10px',
			minHeight:'100vh'
		}
	},
	{
		nameTag:'bg',
		style:{
			backgroundRepeat:"no-repeat",
			backgroundSize:'cover',
			backgroundPosition:'center',
			backgroundColor:'lightblue'
		}
	},
	{
		nameTag:"intro_sec",
		style:{
			height:'100%',
			width:'100%',
			display:'flex',
			flexDirection:'column',
			paddingTop:'20px',
			alignItems:'center',
			rowGap:'30px',
			color:'#fff',
		}
	},
	{
		nameTag:'headerTitle',
		style:{
			height:'fit-content',
			minHeight:'50px',
			padding:'10px 0',
			width:'fit-content',
			display:'flex',
			alignItems:'center',
			paddingLeft:'20px',
			color:'#fff'
		}
	}
])

sydDOM.container = () =>{
	return createElement(
		'div',
		{
			style:styleComponent.container()
		},
		[
			sydDOM.part_one(),
			sydDOM.part_two(),
			sydDOM.customPop()
		]
	)
}

sydDOM.customPop = () =>{
	return createElement(
		'div',
		{
			style:`height:fit-content;width:300px;background:${preState(['customPop','bg'],'rgba(194,74,74,0.7)')};color:#000;position:fixed;z-index:999;top:0;left:50%;transform:translateX(-50%) translateY(${preState(['customPop','y'],-120)}%);display:flex;justify-content:center;align-items:center;padding:20px 10px;font-size:14px;text-align:center;transition:all linear .3s;overflow:hidden;opacity:${preState(['customPop','y'],-120) === -120 ? '0' : '1'}`
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

//START CREATING PART ONE DESIGN

sydDOM.part_one = () =>{
	return createElement(
		'div',
		{
			style:styleComponent.part_one([{method:'add',style:{
				backgroundColor:'#2F55DC',
				paddingLeft:'0px',
				minWidth:'50vw'
			}},
			{method:'remove',style:['display']}
		]),
		id:'part_one'
		},
		[
			sydDOM.headerTitle(),
			sydDOM.intro_section()
		]
	)
}

sydDOM.headerTitle = () =>{
	return createElement(
		'header',
		{
			style:styleComponent.headerTitle()
		},
		[
			sydDOM.smallImage(),
			createElement('h4',{style:'text-transform:uppercase;margin-left:10px;display:inline-block;font-weight:600'},
			[
				'kingdom ',
				createElement('i',{class:'fa-solid fa-computer'})
			])
		]
	)
}

sydDOM.intro_section = () =>{
	return createElement(
		'section',
		{
			style:styleComponent.intro_sec()
		},
		[
			createElement('h1',{style:'text-transform:capitalize;font-family: "Oswald", sans-serif;text-align:center;padding:0 5px;'},["Welcome to kingdom network..."]),
			sydDOM.largeImage(),
			createElement('h4',{style:'color:#fff;font-weight:200;font-size:18px;max-width:500px;text-align:center'},[
				"Creating a professional and elegant interface to purchase computer related services"
			])
		]
	)
}

sydDOM.largeImage = () =>{
	return createElement(
		'div',
		{
			style:styleComponent.bg({method:'add',style:{
				borderRadius:'50%',
				backgroundImage:'url("../routePages/img/logo.png")'
			}}),
			id:'l_img'
		}
	)
}

sydDOM.smallImage = () =>{
	return createElement(
		'div',
		{
			style:'height:20px;width:20px;min-height:20px;min-width:20px;'+styleComponent.bg()
		}
	)
}

mount(sydDOM.container())