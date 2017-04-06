import React from 'react'
import NavigationBar from '../components/NavigationBar'
import MasterDetail from '../components/MasterDetail'
import { connect } from 'react-redux'

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

const categoryTitleStyle = {
  fontSize: '16px',
  verticalAlign: 'middle',
  color: '#5B5B5B'
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
const Filter = (props) => {
  return (
    <div>

      <NavigationBar title="筛选" backIconClicked={props.history.goBack} />

      <div style={categoryPlaceholderStyle}></div>
      <div style={cateogryStyle}>

        <div style={categoryItemContainer}>
          <span style={categoryTitleStyle}>地区</span>
          <img style={categoryIconStyle} src="/images/home/filterDown@2x.png" alt="" />
        </div>

        <div style={categoryItemContainer}>
          <span style={categoryTitleStyle}>行业</span>
          <img style={categoryIconStyle} src="/images/home/filterDown@2x.png" alt="" />
        </div>

        <div style={categoryItemContainer}>
          <span style={categoryTitleStyle}>标签</span>
          <img style={categoryIconStyle} src="/images/home/filterDown@2x.png" alt="" />
        </div>

      </div>

      <MasterDetail data={props.continentsAndCountries} masterName="continentName" detailName="countryName" masterDetail="countries" />

      <div style={selectedContainerStyle}>
        <p style={selectedLabelStyle}>已选条件：</p>
        <p style={selectedContentStyle}>美国，加拿大，墨西哥，北美洲（其他），美国，加拿大，墨西哥，北美洲（其他），美国，加拿大，墨西哥，北美洲（其他），美国，加拿大，墨西哥，北美洲（其他）</p>
      </div>

      <div style={actionContainerStyle}>
        <button style={actionResetStyle}>清空</button>
        <button style={actionConfirmStyle}>完成</button>
      </div>

    </div>
  )
  
}

function mapStateToProps(state) {
  const continentsAndCountries = state.continentsAndCountries
  return { continentsAndCountries }
}

export default connect(mapStateToProps)(Filter)