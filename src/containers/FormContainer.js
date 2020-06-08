import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import api from '../api'
import * as newApi from '../api3.0'
import TransparentNavigationBar from '../components/TransparentNavigationBar'

const inWxApp = newApi.inWxApp;

var containerStyle = {
  width: '100%',
  minHeight: '100%',
  backgroundImage: 'url(' + api.baseUrl + '/images/login/backgroungImage@2x.png)',
  backgroundRepeat: 'repeat-y',
  backgroundSize: '100% auto',
  backgroundPosition: '50% 0',
  overflow: 'hidden',
}

var navbarStyle = {
  width: '100%',
  height: '36px',
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
  textAlign: 'center',
  fontSize: '20px',
  fontWeight: '200',
}

var backIconStyle = {
  margin: '4px'
}

var formContainer = {
  margin: '55% auto 35%',
  width: '76.27%',
}

function FormContainer(props) {

  function back() {
    if (inWxApp && window.wx && props.root) {
      return () => {window.wx.miniProgram.switchTab({url: "/pages/index/index"})};
    } else {
      return props.backIconClicked;
    }
  }

  return (
    <div style={{...containerStyle, ...props.style}} >

      <nav>
        <div className="head_box">

          <div className="logo_box">
            <a href="#"><img src="images/导航logo.png" className="m-logo" alt="" /></a>
          </div>

          <div className="nav_box"></div>
          <div className="act_list">
            <div className="change_box">
              <span className="lg En"><a href="#">En</a></span>
              <span className="lg Cn active"><a href="#">中</a></span>
            </div>
            <ul className="list_">
              <li><a href="index.html">首页</a></li>
              <li>
                <div className="fx">精品投行<i>+</i></div>
                <div className="hover_box">
                  <div className="getHeight">
                    <span><a href="股权融资.html">股权融资</a></span>
                    <span><a href="2_2.html">兼收并购</a></span>
                    <span><a href="2_3.html">核心团队</a></span>
                  </div>
                </div>
              </li>
              <li><a href="3.html">产业投资</a></li>
              <li>
                <div className="fx">产业发展<i>+</i></div>
                <div className="hover_box">
                  <div className="getHeight">
                    <span><a href="4_1.html">简介历程</a></span>
                    <span><a href="4_2.html">产业综合体</a></span>
                  </div>
                </div>
              </li>
            </ul>
            <div className="link_box">
              <a href="login.html" className="login_">登 入</a>
              <a href="contact.html" className="about_us">关于我们 ></a>
            </div>
          </div>

        </div>
      </nav>
    
      <TransparentNavigationBar title={props.title} backIconClicked={back()} />
      
      <div style={{...formContainer, ...props.formStyle}}>
        {props.innerHtml}
      </div>

    </div>
  )
}

function mapStateToProps(state) {
  const { isLogin, redirectUrl } = state
  return { isLogin, redirectUrl }
}

export default connect(mapStateToProps)(FormContainer)
