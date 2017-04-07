import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import MasterDetail from '../components/MasterDetail'
import { connect } from 'react-redux'
import { toggleFilter } from '../actions'

const CATEGORY_1 = 'area', CATEGORY_2 = 'industry', CATEGORY_3 = 'tag'

const cateogryStyle = {
  position: 'fixed',
  left: 0,
  right: 0,
  top: '48px',
  display: 'flex',
  backgroundColor: 'white'
}

const categoryPlaceholderStyle = {
  height: '48px'
}

const categoryItemContainer = {
  height: '48px',
  flex: 1,
  textAlign: 'center',
  lineHeight: '48px'
}

const categoryIconStyle = {
  width: '9px',
  height: '5px',
  marginLeft: '7px',
  verticalAlign: 'middle'
}

const selectedContainerStyle = {
  position: 'fixed',
  height: '60px',
  left: 0,
  right: 0,
  bottom: '48px',
  backgroundColor: 'white',
  padding: '2px 8px'
}

const selectedLabelStyle = {
  lineHeight: 1.5
}

const selectedContentStyle = {
  fontSize: '13px',
  color: 'gray',
  lineHeight: '1.4'
}

const actionContainerStyle = {
  position: 'fixed',
  height: '48px',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex'
}

const actionResetStyle = {
  flex: 1,
  backgroundColor: '#71A2E5',
  border: 'none',
  color: 'white',
  fontSize: '16px'
}

const actionConfirmStyle = Object.assign({}, actionResetStyle, {
  backgroundColor: '#10458F'
})

function FilterCategory(props) {

  var categoryTitleStyle = {
    fontSize: '16px',
    verticalAlign: 'middle',
    color: '#5B5B5B'
  }

  var icon = "/images/home/filterDown@2x.png"

  if (props.isActive) {
    categoryTitleStyle.color = '#10458F'
    icon = "/images/home/filterUp@2x.png"
  }

  return (
    <div style={categoryItemContainer} onClick={props.onClick}>
      <span style={categoryTitleStyle}>{props.name}</span>
      <img style={categoryIconStyle} src={icon} alt="" />
    </div>
  )

}

class Filter extends Component {

  constructor(props) {
    super(props)

    this.state = { activeCategory: CATEGORY_1 }

    this.handleCountryClicked = this.handleCountryClicked.bind(this)
    this.handleAreaCategoryClicked = this.handleAreaCategoryClicked.bind(this)
    this.handleIndustryCategoryClicked = this.handleIndustryCategoryClicked.bind(this)
    this.handleTagCategoryClicked = this.handleTagCategoryClicked.bind(this)
  }

  handleCountryClicked(type, item) {
    var filterType, filterName
    switch (type) {
      case CATEGORY_1:
        filterType = CATEGORY_1
        filterName = item.countryName
        break
      case CATEGORY_2:
        filterType = CATEGORY_2
        filterName = item.industryName
        break
    }

    this.props.dispatch(toggleFilter(Object.assign({}, item, {
      type: filterType,
      name: filterName
    })))
  }

  handleAreaCategoryClicked() {
    this.setState({activeCategory: CATEGORY_1})
  }

  handleIndustryCategoryClicked() {
    this.setState({activeCategory: CATEGORY_2})
  }

  handleTagCategoryClicked() {
    this.setState({activeCategory: CATEGORY_3})
  }

  render() {

    const area = <MasterDetail name={CATEGORY_1} data={this.props.continentsAndCountries} masterName="continentName" detailName="countryName" masterDetail="countries" handleDetailItemClicked={this.handleCountryClicked} chosenItem={this.props.filter.filter(item => item.type === CATEGORY_1).map(item => item.id)} />

    const industry = <MasterDetail name={CATEGORY_2} data={this.props.industries} masterName="industryName" detailName="industryName" masterDetail="subIndustries" handleDetailItemClicked={this.handleCountryClicked} chosenItem={this.props.filter.filter(item => item.type === CATEGORY_2).map(item => item.id)} />

    return (
      <div>

        <NavigationBar title="筛选" backIconClicked={this.props.history.goBack} />

        <div style={categoryPlaceholderStyle}></div>
        <div style={cateogryStyle}>

          <FilterCategory name="地区" onClick={this.handleAreaCategoryClicked} isActive={this.state.activeCategory === CATEGORY_1} />

          <FilterCategory name="行业" onClick={this.handleIndustryCategoryClicked} isActive={this.state.activeCategory === CATEGORY_2} />

          <FilterCategory name="标签" onClick={this.handleTagCategoryClicked} isActive={this.state.activeCategory === CATEGORY_3} />

        </div>

        {this.state.activeCategory == CATEGORY_1 ? area : null}
        {this.state.activeCategory == CATEGORY_2 ? industry : null}

        <div style={selectedContainerStyle}>
          <p style={selectedLabelStyle}>已选条件：</p>
          <p style={selectedContentStyle}>{this.props.filter.map(item => item.name).join('，')}</p>
        </div>

        <div style={actionContainerStyle}>
          <button style={actionResetStyle}>清空</button>
          <button style={actionConfirmStyle}>完成</button>
        </div>

      </div>
    )
  }
  
}

function mapStateToProps(state) {
  const continentsAndCountries = state.continentsAndCountries
  const filter = state.filter
  const industries = state.industries
  return { continentsAndCountries, filter, industries }
}

export default connect(mapStateToProps)(Filter)