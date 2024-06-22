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
            rowGap:'15px',
            padding:'15px',
            overflowY:'scroll',
            position:'relative'
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
        nameTag:'textarea',
        style:{
            minHeight:'150px',
            border:'1px dashed grey',
            width:'100%',
            outline:'none',
            padding:'5px',
            borderRadius:'7px',
        }
    },
])

sydDOM.serviceSection = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.dashboard({method:'remove',style:['padding']})
        },
        [
            createElement(
                'form',
                {
                    style:styleComponent.dashboard([
                        {method:'remove',style:['height','overflowY']},
                        {method:'add',style:{boxShadow:'-2px 8px 20px rgba(0,0,0,.2)'}}
                    ])
                },
                [
                    sydDOM.dataHeader(),
                    sydDOM.info_box(),
                    sydDOM.login_button()
                ]
            )
        ]
    )
}

sydDOM.dataHeader = (content = ['send complain']) =>{
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

sydDOM.info_box = ({text = 'MESSAGE',params = ['',''],readonly = false} = {}) =>{
    return createElement(
        'div',
        {
            style:styleComponent.info_box()
        },
        [
            createElement('p',{style:'color:grey'},[text]),
            createElement(
                'textarea',
                {
                    style:styleComponent.textarea()+`pointer-events:${readonly ? 'none' : 'unset'}`,
                    value:preState(['view','data',text.toLowerCase()],''),
                    name:params[0],
                    id:params[0]
                })
        ]
    )
}

sydDOM.login_button = () =>{
    return createElement(
        'div',
        {
            style:'padding:10px 0;width:100%;height:60px;min-height:60px;padding-right:25px;padding-left:10px;display:flex;align-items:center'
        },
        [
            createElement(
                'button',
                {
                    style:'height:fit-content;width:fit-content;padding:10px 20px;background:#2F55DC;display:flex;justify-content:center;align-items:center;border-radius:7px;font-weight:700;color:#fff',
                    class:'select',
                    type:'submit'
                },
                [
                    "Send"
                ]
            )
        ]
    )
}