import React, { Component } from 'react'

var wrapper = {
  width: '100%',
  backgroundColor: '#fff'
}

var sideNav = {
  width: '50%',
  position: 'fixed',
  height: (window.innerHeight - 48*3 - 60) + 'px',
  left: 0,
  right: 0,
  overflowY: 'scroll',
  backgroundColor: '#F6F6F6'
}

var contentWrapper = {
  marginLeft: '50%',
  padding: '0 20px',
  overflowY: 'scroll',
  position: 'fixed',
  left: 0,
  right: 0,
  height: (window.innerHeight - 48*3 - 60) + 'px',
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
    const detailItem = JSON.parse(target.dataset.country)
    const id = parseInt(detailItem.id, 10)

    this.props.handleDetailItemClicked(detailItem)

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

    if (this.props.data.length === 0) {
      return null
    }

    const master = this.props.data.map((element, index) => {

      const masterItemStyle = index === this.state.activeIndex ? masterItemActiveStyle : masterItemBasicStyle

      return <li style={masterItemStyle} key={index} data-index={index} onClick={this.handleMasterItemClick}>{element[this.props.masterName]}</li>

    })

    const detail = this.props.data[this.state.activeIndex][this.props.masterDetail].map((element, index) => {

      var style1 = this.state.chosenItem.indexOf(element.id) > -1 ? detailItemActiveStyle : null

      return <li style={detailItemBasicStyle} key={index} data-country={JSON.stringify(element)} onClick={this.handleDetailItemClick}>
        <span data-country={JSON.stringify(element)} style={style1}>{element[this.props.detailName]}</span>
      </li>

    })

    return (
      <div style={wrapper}>

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