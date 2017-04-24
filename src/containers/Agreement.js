import React from 'react'
import TransparentNavigationBar from '../components/TransparentNavigationBar'

import api from '../api'

const bgStyle = {
    width: '100%',
    minHeight: '100%',
    backgroundImage: 'url(' + api.baseUrl +'/images/login/backgroungImage@2x.png)',
    backgroundRepeat: 'repeat-y',
    backgroundSize: '100% auto',
    backgroundPosition: '50% 0',
    overflow: 'hidden',
}
var containerStyle = {
    padding: '1px 10px 30px',
    backgroundColor: '#fff',
}
var titleStyle = {
    margin: '10px 0 10px',
    textAlign: 'center',
    lineHeight: '1.6',
    fontSize: '15px',
    color: '#000',
}
var paragraphStyle = {
    textAlign: 'justify',
    lineHeight: '1.6',
    fontSize: '12px',
}

class Agreement extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
        <div style={bgStyle}>
            <TransparentNavigationBar title="用户协议" previousPage="/register" />
            
            <div style={containerStyle}>
                <div>
                    <h3 style={titleStyle}>免责声明</h3>
                    <p style={paragraphStyle}>
免责声明郑重声明：本公司所有涉及收集个人信息内容，未经客户允许或授权，不会公开或提供第三方使用。<br/>
1、Investarget网站（以下简称“本网站”）是Investarget公司为用户提供投融资信息居间服务的网络平台。本声明包含本网站的使用条款，您在浏览和使用本网站之前，请务必仔细查阅本声明。您在浏览和使用本网站的同时，视为您接受以下条款。Investarget公司在法律许可的范围内享有对本声明进行解释、修订及变更的权利；<br/>
2、本网站承诺保障用户个人隐私安全，原则上不向任何个人或组织泄露用户个人信息，但当司法机关、监管机构或其他政府部门依据法律程序，要求本网站提供您的个人信息时，本网站将及时通知用户，根据相关部门的要求提供您的相关信息资料；<br/>
3、本网站建议用户加强自我保护，提高防范意识，由于您对用户账号、密码等个人信息保管不善或告知他人而导致的任何个人信息、账户信息的泄露及损失，本网站不承担任何责任；<br/>
4、本网站如因系统维护或升级而需暂停服务时，将事先公告。若因线路及非本公司控制范围外的硬件故障或其它不可抗力而导致暂停服务，于暂停服务期间造成的一切不便与损失，本网站不负任何责任。<br/>
5、对于任何本网站无法控制的原因（包括但不限于黑客攻击、计算机病毒攻击、政府管制、通讯设施故障及其他不可抗力因素）导致的网站暂时关闭、用户信息泄露、被盗用、被篡改等非正常经营行为，本网站不承担任何责任；<br/>
6、本网站在某些情况下将挑选具备良好声誉的网站作为友情链接列入本网站，供您浏览和参考。但该行为并不视为本网站与其具备合作关系，请您对相关内容进行审慎辨别及判断，对于任何外部链接的网站，您在该网站上进行访问、使用、下载等行为引起的损失或损害，本网站不承担任何责任。<br/>
本网站之声明以及其修改权、更新权及最终解释权均属多维空间网站所有。</p>
                    <h3 style={titleStyle}>平台保密声明</h3>
                    <p style={paragraphStyle}>
平台保密声明本公司的业务是建立在客户彼此信任的基础之上的，为了提供更优质的客户服务和产品，为了使您提供的所有信息都能得到机密保障，我们采用以下关于信息保护的政策：<br/>
1. Investarget收集信息的范围仅限于那些本公司认为对于您的财务需求和开展业务所必须的相关资料；<br/>
2. Investarget尽力确保对客户的信息记录是准确和及时的；<br/>
3. 因服务必要而委托的第三方在得到本公司许可获取客户的个人信息时都被要求严格遵守保密责任；<br/>
4. Investarget将对客户提供的信息严格保密除具备下列情形之一外不会像任何外部机构披露<br/>
a)经过客户事先同意而披露；<br/>
b) 应法律法规的要求而披露；<br/>
c) 应政府部门或其他代理机构的要求而披露；<br/>
d) 应上级监管机构的要求而披露；<br/>
5.Investarget设有严格的安全系统以防止未经授权的任何人包括本公司的职员获取客户信息；<br/>
6. 本网站使用了cookie的功能，cookie是一个标准的互联网技术，载有小量资料的档案，自动储存于用户本身电脑所安装的互联网浏览器。它可以使本网站存储和获得用户登录信息。本网站使用cookie来确保您不会重复浏览到相同的内容并可以获得最新的信息，并使用cookie来确认您是PA18的合法用户。cookie收集的是不记名的集体统计资料，并不包括姓名、地址、及电话、电邮地址等个人联络资料。即使在使用cookie的情况下，除非您非常明确的告知本网站，否则本网站并不会获知您的个人信息。
信息准确性上传者承诺。</p>
                    <h3 style={titleStyle}>信息准确性上传者承诺</h3>
                    <p style={paragraphStyle}>
本公司就提供信息及资料的真实性、准确性和完整性，郑重声明及承诺如下：<br/>
本公司所提供的信息及资料真实、准确和完整，保证不存在虚假记载、误导性陈述或者重大遗漏，并对所提供信息及资料的真实性、准确性和完整性承担法律责任。</p>
                </div>
            </div>
        </div>
        )

    }
}


export default Agreement