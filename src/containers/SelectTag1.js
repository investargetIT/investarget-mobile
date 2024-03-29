// import React, { Component } from 'react'
// import NavigationBar from '../components/NavigationBar'
// import MasterDetail from '../components/MasterDetail'
// import { connect } from 'react-redux'
// import { toggleFilter, searchProject, clearFilter, cloneTrueFilter } from '../actions'
// import api from '../api'

// const CATEGORY_1 = 'area', CATEGORY_2 = 'industry', CATEGORY_3 = 'tag'

// const cateogryStyle = {
//   position: 'fixed',
//   left: 0,
//   right: 0,
//   top: '48px',
//   display: 'flex',
//   backgroundColor: 'white'
// }

// const categoryPlaceholderStyle = {
//   height: '48px'
// }

// const categoryItemContainer = {
//   height: '48px',
//   flex: 1,
//   textAlign: 'center',
//   lineHeight: '48px'
// }

// const categoryIconStyle = {
//   width: '9px',
//   height: '5px',
//   marginLeft: '7px',
//   verticalAlign: 'middle'
// }

// const selectedContainerStyle = {
//   position: 'fixed',
//   height: '60px',
//   left: 0,
//   right: 0,
//   bottom: '48px',
//   backgroundColor: 'white',
//   padding: '2px 8px'
// }

// const selectedLabelStyle = {
//   lineHeight: 1.5
// }

// const selectedContentStyle = {
//   fontSize: '13px',
//   color: 'gray',
//   lineHeight: '1.4'
// }

// const actionContainerStyle = {
//   position: 'fixed',
//   height: '48px',
//   bottom: 0,
//   left: 0,
//   right: 0,
//   display: 'flex'
// }

// const actionResetStyle = {
//   flex: 1,
//   backgroundColor: '#71A2E5',
//   border: 'none',
//   color: 'white',
//   fontSize: '16px'
// }

// const actionConfirmStyle = Object.assign({}, actionResetStyle, {
//   backgroundColor: '#10458F'
// })

// function FilterCategory(props) {

//   var categoryTitleStyle = {
//     fontSize: '16px',
//     verticalAlign: 'middle',
//     color: '#5B5B5B'
//   }

//   var icon = api.baseUrl + "/images/home/filterDown@2x.png"

//   if (props.isActive) {
//     categoryTitleStyle.color = '#10458F'
//     icon = api.baseUrl + "/images/home/filterUp@2x.png"
//   }

//   return (
//     <div style={categoryItemContainer} onClick={props.onClick}>
//       <span style={categoryTitleStyle}>{props.name}</span>
//       <img style={categoryIconStyle} src={icon} alt="" />
//     </div>
//   )

// }

// const floatContainerStyle = {
//   padding: '8px 0px',
//   backgroundColor: '#F6F6F6',
//   height: (window.innerHeight - 48*3 - 60) + 'px',
//   overflowY: 'scroll',
//   position: 'fixed',
//   left: 0,
//   right: 0
// }

// const itemStyle = {
//   float: 'left',
//   width: 100/375*100+'%',
//   margin: '8px ' + 75/375/6*100+'%',
//   textAlign: 'center',
//   border: '1px solid #CCCCCC',
//   color: '#555555',
//   fontSize: '14px',
//   lineHeight: 1.8,
//   borderRadius: '5px'
// }

// const itemActiveStyle = Object.assign({}, itemStyle, {
//   color: 'white',
//   backgroundColor: '#10458F',
//   border: '1px solid #10458F'
// })

// class TableView extends Component {

//   constructor(props) {
//     super(props)

//     this.state = { chosenItem: props.chosenItem ? props.chosenItem : [] }

//     this.handleItemClicked = this.handleItemClicked.bind(this)
//   }

//   handleItemClicked(event) {
//     const target = event.target
//     const detailItem = JSON.parse(target.dataset.item)
//     const id = parseInt(detailItem.id, 10)

//     this.props.handleTableItemClicked(this.props.name, detailItem)

//     var array = this.state.chosenItem.slice()
//     var itemIndex = array.indexOf(id)
//     if (itemIndex > -1) {
//       array.splice(itemIndex, 1)
//     } else {
//       array.push(id)
//     }

//     this.setState({
//       chosenItem: array
//     })
//   }

//   render() {

//     const content = this.props.data.map(item => {
//       const style = this.state.chosenItem.indexOf(item.id) > -1 ? itemActiveStyle : itemStyle
//       return <div style={style} onClick={this.handleItemClicked} data-item={JSON.stringify(item)} key={item.id}>{item.tagName}</div>
//     })

//     return (
//       <div style={floatContainerStyle}>
//         {content}
//       </div>
//     )

//   }
  
// }

// const searchContainerStyle = {
//   width: '70%',
//   height: '30px',
//   margin: '9px auto',
//   backgroundColor: 'white',
//   lineHeight: 'normal',
//   borderRadius: '13px'
// }
// const searchInputStyle = {
//   fontSize: '16px',
//   backgroundColor: 'white',
//   border: 'none',
//   height: '100%',
//   width: '96px',
//   verticalAlign: 'middle'
// }
// const searchIconStyle = {
//   width: '20px',
//   height: '20px',
//   marginRight: '8px',
//   verticalAlign: 'middle'
// }

// class Search extends Component {
//   constructor(props) {
//     super(props)

//     this.onblur = this.onblur.bind(this)
//   }

//   onblur(event) {
//     this.props.handleSearchOnBlur(event.target.value)
//   }

//   render() {
//   return (
//     <div style={searchContainerStyle}>
//       <img style={searchIconStyle} src={api.baseUrl + "/images/home/ic_search.svg"} />
//       <input style={searchInputStyle} type="text" placeholder="搜索标签" onBlur={this.onblur} />
//     </div>
//   )
//   }

// }


// class SelectTag extends Component {

//   constructor(props) {
//     super(props)

//     this.state = { 
//       activeCategory: CATEGORY_1,
//       searchTitle: ''
//     }

//     this.handleCountryClicked = this.handleCountryClicked.bind(this)
//     this.handleAreaCategoryClicked = this.handleAreaCategoryClicked.bind(this)
//     this.handleIndustryCategoryClicked = this.handleIndustryCategoryClicked.bind(this)
//     this.handleTagCategoryClicked = this.handleTagCategoryClicked.bind(this)
//     this.handleActionButtonClicked = this.handleActionButtonClicked.bind(this)
//     this.handleSearchOnBlur = this.handleSearchOnBlur.bind(this)
//   }

//   componentDidMount() {
//     this.props.dispatch(cloneTrueFilter())
//   }

//   handleCountryClicked(type, item) {
//     var filterType, filterName
//     switch (type) {
//       case CATEGORY_1:
//         filterType = CATEGORY_1
//         filterName = item.countryName
//         break
//       case CATEGORY_2:
//         filterType = CATEGORY_2
//         filterName = item.industryName
//         break
//       case CATEGORY_3:
//         filterType = CATEGORY_3
//         filterName = item.tagName
//         break
//       default: 
//     }

//     this.props.dispatch(toggleFilter(Object.assign({}, item, {
//       type: filterType,
//       name: filterName
//     })))
//   }

//   handleAreaCategoryClicked() {
//     this.setState({activeCategory: CATEGORY_1})
//   }

//   handleIndustryCategoryClicked() {
//     this.setState({activeCategory: CATEGORY_2})
//   }

//   handleTagCategoryClicked() {
//     this.setState({activeCategory: CATEGORY_3})
//   }

//   handleActionButtonClicked(event) {

//     const action = event.target.name

//     if (action === 'search') {
//       this.props.dispatch(searchProject(this.state.searchTitle))
//       this.props.history.goBack()
//     } else if (action === 'reset') {
//       this.props.dispatch(clearFilter())
//     }
//   }

//   handleSearchOnBlur(value) {
//     this.setState({searchTitle: value})
//   }

//   render() {

//     // const area = <MasterDetail
//     //   name={CATEGORY_1}
//     //   data={this.props.continentsAndCountries}
//     //   masterName="continentName"
//     //   detailName="countryName"
//     //   masterDetail="countries"
//     //   handleDetailItemClicked={this.handleCountryClicked}
//     //   chosenItem={this.props.filter.filter(item => item.type === CATEGORY_1).map(item => item.id)} />

//     // const industry = <MasterDetail
//     //   name={CATEGORY_2}
//     //   data={this.props.industries}
//     //   masterName="industryName"
//     //   detailName="industryName"
//     //   masterDetail="subIndustries"
//     //   handleDetailItemClicked={this.handleCountryClicked}
//     //   chosenItem={this.props.filter.filter(item => item.type === CATEGORY_2).map(item => item.id)} />

//     const tag = <TableView
//       name={CATEGORY_3}
//       data={this.props.tags}
//       handleTableItemClicked={this.handleCountryClicked}
//       chosenItem={this.props.filter.filter(item => item.type === CATEGORY_3).map(item => item.id)} />

//     const search = <Search handleSearchOnBlur={this.handleSearchOnBlur} />

//     return (
//       <div>

//         <NavigationBar title={search} hideBack />

//         {/* <div style={categoryPlaceholderStyle}></div> */}
//         {/* <div style={cateogryStyle}>

//           <FilterCategory name="地区" onClick={this.handleAreaCategoryClicked} isActive={this.state.activeCategory === CATEGORY_1} />

//           <FilterCategory name="行业" onClick={this.handleIndustryCategoryClicked} isActive={this.state.activeCategory === CATEGORY_2} />

//           <FilterCategory name="标签" onClick={this.handleTagCategoryClicked} isActive={this.state.activeCategory === CATEGORY_3} />

//         </div> */}

//         {/* {this.state.activeCategory === CATEGORY_1 ? area : null}
//         {this.state.activeCategory === CATEGORY_2 ? industry : null}
//         {this.state.activeCategory === CATEGORY_3 ? tag : null} */}
        
//         {tag}

//         <div style={selectedContainerStyle}>
//           <p style={selectedLabelStyle}>已选标签：</p>
//           <p style={selectedContentStyle}>{this.props.filter.map(item => item.name).join('，')}</p>
//         </div>

//         <div style={actionContainerStyle}>
//           <button name="reset" style={actionResetStyle} onClick={this.handleActionButtonClicked}>清空</button>
//           <button name="search" style={actionConfirmStyle} onClick={this.handleActionButtonClicked}>完成</button>
//         </div>

//       </div>
//     )
//   }
  
// }

// function mapStateToProps(state) {
//   const continentsAndCountries = state.continentsAndCountries
//   const filter = state.filter
//   const industries = state.industries
//   const tags = state.tags
//   return { continentsAndCountries, filter, industries, tags }
// }

// export default connect(mapStateToProps)(SelectTag)