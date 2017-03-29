import React, { Component } from 'react'
import { Link } from 'react-router-dom'

var wrapper = {
  width: '100%',
  backgroundColor: '#fff'
}

var topNav = {
  position: 'fixed',
  left: 0,
  right: 0,
  top: 0,
  height: '60px',
  width: '100%',
  backgroundColor: '#10458F'
}

var sideNav = {
  width: '50%',
  position: 'fixed',
  height: '100vh',
  left: 0,
  right: 0,
  overflowY: 'scroll',
  backgroundColor: '#F6F6F6',
  top: '60px'
}

var contentWrapper = {
  margin: '60px 0 0 50%',
  padding: '0 30px',
  overflowY: 'scroll',
  position: 'fixed',
  left: 0,
  top: 0,
  right: 0,
  height: '100vh',
  backgroundColor: 'white'
}

var masterItemBasicStyle = {
  padding: '10px 40px'
}

var masterItemActiveStyle = Object.assign({}, masterItemBasicStyle, {
  backgroundColor: 'white'
})

var detailItemBasicStyle = {
  listStyle: 'none',
  padding: '10px 20px',
}

var detailItemActiveStyle = {
  color: '#10458F',
  padding: '4px 0',
  borderBottom: '2px solid #10458F'
}

const backIconStyle = {
  width: '9px',
  height: '15px',
  verticalAlign: 'middle'
}

const backLabelStyle = {
  marginLeft: '10px',
  color: 'white',
  textDecoration: 'none',
  verticalAlign: 'middle'
}

const backContainerStyle = {
  padding: '20px'
}

var data = []
var northAmerica = {
  name: '北美洲',
  countries: [
    { id: 1, name: '美国' },
    { id: 2, name: '加拿大' },
    { id: 3, name: '墨西哥' },
    { id: 4, name: '其他' }
  ]
}
var southAmerica = {
  name: '南美洲',
  countries: [{ id: 5, name: '巴西' }, { id: 6, name: '阿根廷' }, { id: 7, name: '智利' }, { id: 8, name: '秘鲁' }, { id: 9, name: '乌拉圭' }, { id: 10, name: '其他' }]
}
  data.push(northAmerica)
  data.push(southAmerica)

class MasterDetail extends Component {

  constructor(props) {
    super(props)

    this.state = {
      activeIndex: 0,
      chosenItem: []
    }

    this.handleMasterItemClick = this.handleMasterItemClick.bind(this)
    this.handleDetailItemClick = this.handleDetailItemClick.bind(this)
  }

  handleMasterItemClick(event) {
    const target = event.target
    const index = parseInt(target.dataset.index, 10)
    this.setState({
      activeIndex: index
    })
  }

  handleDetailItemClick(event) {
    const target = event.target
    const id = parseInt(target.dataset.countryid, 10)

    var array = this.state.chosenItem.slice()
    var itemIndex = array.indexOf(id)
    if (itemIndex > -1) {
      array.splice(itemIndex, 1)
    } else {
      array.push(id)
    }

    this.setState({
      chosenItem: array
    })
  }

  render() {

    const master = data.map((element, index) => {

      const masterItemStyle = index === this.state.activeIndex ? masterItemActiveStyle : masterItemBasicStyle

      return <li style={masterItemStyle} key={index} data-index={index} onClick={this.handleMasterItemClick}>{element.name}</li>

    })

    const detail = data[this.state.activeIndex].countries.map((element, index) => {

      var style1 = this.state.chosenItem.indexOf(element.id) > -1 ? detailItemActiveStyle : null

      return <li style={detailItemBasicStyle} key={index} data-countryid={element.id} onClick={this.handleDetailItemClick}>
        <span data-countryid={element.id} style={style1}>{element.name}</span>
      </li>

    })

    return (
      <div style={wrapper}>

        <div id="top-nav" style={topNav}>
          <Link to="/">
          <div style={backContainerStyle}>
            <img style={backIconStyle} src="images/login/backButton@3x.png" /><span style={backLabelStyle}>返回</span>
            </div>
          </Link>
        </div>

        <div id="side-nav" style={sideNav}>
          <ul>{master}</ul>
        </div>

        <div id="content-wrapper" style={contentWrapper}>
          <ul>{detail}</ul>
        </div>

      </div>
    )
  }

}

export default MasterDetail