import React from 'react'
import { Link } from 'react-router-dom'

var container = {
  position: 'fixed',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  backgroundImage: 'url(images/login/backgroungImage@2x.png)',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
}

var backIconContainerStyle = {
  width: '36px',
  height: '36px',
  float: 'left',
  textAlign: 'center'
}

var titleStyle = {
  marginRight: '36px',
  lineHeight: '36px',
  textAlign: 'center'
}

var backIconStyle = {
  marginTop: '8px',
  width: '9px',
  height: '15px'
}

var inputIconStyle = {
  float: 'left',
  width: '30px',
  height: '30px'
}

var inputStyle = {
  width: '80%',
  marginLeft: '10px',
  lineHeight: '30px',
  fontSize: '16px',
  backgroundColor: 'transparent',
}

var formContainer = {
  width: '80%',
  margin: '200px auto'
}

var buttonContainerStyle = {
  marginTop: '10px'
}

var loginButtonStyle = {
  width: '100%',
  height: '38px',
  background: '#2269D4',
  fontSize: '16px',
  borderRadius: '20px',
  border: '1px solid #2269D4',
  color: 'white'
}

var registerButtonStyle = Object.assign({}, loginButtonStyle)
registerButtonStyle.background = 'transparent'
registerButtonStyle.color = '#2269D4'

function Login(props) {
  return (
    <div style={container}>

      <Link to="/user">
        <div style={backIconContainerStyle}>
          <img style={backIconStyle} src="images/login/backButton@3x.png" alt="Back" />
        </div>
      </Link>

      <p style={titleStyle}>登录</p>

      <div style={formContainer}>

        <div>
          <img src="images/login/User-copy@2x.png" alt="用户名" style={inputIconStyle} />
          <input type="text" placeholder="请输入手机号/邮箱" style={inputStyle} />
        </div>

        <div>
          <img src="images/login/Locked@2x.png" alt="密码" style={inputIconStyle} />
          <input type="text" placeholder="请输入密码" style={inputStyle} />
        </div>

        <div style={buttonContainerStyle}>
          <button style={loginButtonStyle}>登录</button>
        </div>

        <div style={buttonContainerStyle}>
          <button style={registerButtonStyle}>注册</button>
        </div>

        <p>忘记密码？</p>

      </div>

    </div>
  )
}

export default Login