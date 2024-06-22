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

sydDOM.sideBar = () =>{
    console.log(navIndex)
	return createElement(
		'div',
		{
			style:styleComponent.sideBar({method:'remove',style:['overflowY','padding']}),
			id:'sideBar'
		},
		[
            sydDOM.side_bar_header(),
            createElement(
                'div',
                {
                    style:'height:100%;width:100%;'+styleComponent.sideBar({method:'use',style:['display','rowGap','flexDirection','overflowY','padding']})
                },
                [
                    sydDOM.sideElement({classType:'fa-solid fa-gauge-high',current:'0' === navIndex ? true : false}),
                    sydDOM.sideElement({text:'My Profile',func:'profile',classType:'fa-solid fa-user',current:'1' === navIndex ? true : false}),
                    sydDOM.sideElement({text:'e-Wallet',func:'wallet',classType:'fa-solid fa-user',current:'2' === navIndex ? true : false}),
                    sydDOM.sideElement({text:'Buy Data',func:'data',classType:'fa-solid fa-tachograph-digital',current:'3' === navIndex ? true : false}),
                    sydDOM.sideElement({text:'Transactions',func:'trans',classType:'fa-solid fa-money-bill-trend-up',current:'4' === navIndex ? true : false}),
                    sydDOM.sideElement({text:'Purchased Services',func:'purchase',classType:'fa-solid fa-cart-shopping',current:'5' === navIndex ? true : false}),
                    sydDOM.sideElement({text:'Complain',func:'complaint',classType:'fa-solid fa-building',current:'6' === navIndex ? true : false}),
                    sydDOM.sideElement({text:'Logout',func:'login',classType:'fa-solid fa-right-from-bracket',current:'7' === navIndex ? true : false}), 
                ]
                )           
		]
	)
}
sydDOM.side_bar_header = () =>{
    return createElement(
        'div',
        {
            style:'height:80px;background:#fff;width:100%;display:flex;padding-left:20px;align-items:center;position:absolute;top:0;left:0;z-index:200;letter-spacing:1px;text-transform:uppercase;font-weight:700'
        },
        [
            sydDOM.logo({img:'logo.png'}),
            "kingdom computers",
            sydDOM.menuBtn().addAttr({style:styleComponent.menuBtn([{method:'add',style:{backgroundImage:'url("./img/exit.png")',height:'20px',width:'20px',marginLeft:'10px'}},{method:'remove',style:['position','top','left']}])+styleComponent.bg()})
        ]
    )
}
sydDOM.logo = ({size = '40px',img} = {}) =>{
    return createElement(
        'div',
        {
            style:styleComponent.bg({method:'add',style:{backgroundImage:`url('./img/${img}')`,height:size,width:size,minHeight:size,minWidth:size}})
        }
    )
}
sydDOM.sideElement = ({text = 'Dashboard',func = 'dashboard', classType = 'fa-solid fa-gauge-high',current} = {}) =>{
    const currentStyle = current ? 'background:#fff;color:#2F55DC;' : '';
    return createElement(
        'form',
        {
            method:'POST',
            action:`${func}`
        },
        [
            createElement(
                'button',
                {
                    style:`height:45px;min-height:45px;width:100%;display:flex;column-gap:10px;border-radius:5px;align-items:center;padding-left:10px;text-decoration:none;${currentStyle}`,
                    class:'sideElement select',
                    type:'submit'
                },
                [
                    createElement('i',{class:classType}),
                    text
                ]
            ),
            func !== 'login' ? createElement(
                'input',
                {
                    style:'display:none',
                    name:'userID',
                    id:'customer_id_'+func,
                    value:id
                }
            ) : ''
        ]
    )
}