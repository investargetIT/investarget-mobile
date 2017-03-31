import React from 'react'
import FormContainer from './FormContainer'
import TextInput from './TextInput'
import Button from './Button'
import { Link } from 'react-router-dom'
import Select from './Select'


var inputStyle = {
  margin: '30px 10px',
}

var selectStyle = {
  position: 'relative',
  margin: '30px 10px',
}

var selectTextStyle = {
  borderBottom: '1px solid rgb(34, 105, 212)',
  height: '30px',
  lineHeight: '30px',
  fontSize: '16px',
  color: '#333',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

var unselectTextStyle = {
  borderBottom: '1px solid rgb(34, 105, 212)',
  height: '30px',
  lineHeight: '30px',
  fontSize: '16px',
  color: '#a9a9a9',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}


class Register2 extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
        name: '',
        company: '',
        title: null, // 职位
        industry: [],
        password: '',
        industryOptions: [
          {id: 0, name: '制造业和工业'},
          {id: 1, name: '新能源'},
          {id: 2, name: '农业'},
          {id: 3, name: '互联网移动互联网'},
          {id: 4, name: '医疗'},
        ],
        titleOptions: [
          {id: 0, name: 'CEO'},
          {id: 1, name: 'CTO'},
          {id: 2, name: 'CIO'},
          {id: 3, name: 'COO'},
        ],
        showIndustry: false,
        showTitle: false,
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSelectTitle = this.handleSelectTitle.bind(this)
    this.showTitleSelect = this.showTitleSelect.bind(this)
    this.handleSelectIndustry = this.handleSelectIndustry.bind(this)
    this.showIndustrySelect = this.showIndustrySelect.bind(this)
  }

  handleInputChange(event) {
    const target = event.target
    const name = target.name
    const value = target.value
    this.setState({
      [name]: value
    })
  }

  showIndustrySelect() {
    this.setState({
      showIndustry: true
    })
  }

  showTitleSelect() {
    this.setState({
      showTitle: true
    })
  }

  handleSelectIndustry(ids) {
    this.setState({
      industry: ids,
      showIndustry: false
    })
  }

  handleSelectTitle(ids) {
    console.log(ids)
    var id = ids.length ? ids[0] : null
    this.setState({
      title: id,
      showTitle: false
    })
  }

  handleSubmit() {

  }

  render() {
    var disabled =  this.state.name == '' ||
                    this.state.company == '' ||
                    this.state.title == null ||
                    this.state.industry.length == 0 ||
                    this.state.password == ''

    var titleText
    if (this.state.title != null) {
      var titleOption = this.state.titleOptions.filter(option => {
        return this.state.title == option.id
      })[0]
      titleText = titleOption.name
    } else {
      titleText = '请选择职位'
    }

    var industryText
    if (this.state.industry.length) {
      var industryOptions = this.state.industryOptions.filter(option => {
        return this.state.industry.indexOf(option.id) > -1
      })
      industryText = industryOptions.map(option => option.name).join('，')
    } else {
      industryText = '请选择关注的行业'
    }

    var content =
      <div>

        <div style = {inputStyle}>
            <TextInput name="name" placeholder="姓名" value={this.state.name} handleInputChange={this.handleInputChange} />
        </div>

        <div style = {inputStyle}>
            <TextInput name="company" placeholder="公司名称" value={this.state.company} handleInputChange={this.handleInputChange} />
        </div>

        <div style = {selectStyle}>
            {/*点击选择职位*/}
            <div style = { this.state.title != null ? selectTextStyle : unselectTextStyle } onClick={this.showTitleSelect} >{ titleText || '请选择职位' }</div>

            <div style={{ display: this.state.showTitle ? 'block' : 'none' }}>
              <Select title="请选择职位" multiple={false} options={this.state.titleOptions} onConfirm={this.handleSelectTitle} />
            </div>
        </div>

        <div style = {selectStyle}>
            {/*点击选择关注的行业*/}
            <div style = { this.state.industry.length ? selectTextStyle : unselectTextStyle } onClick={this.showIndustrySelect} >{ industryText || '请选择关注的行业' }</div>

            <div style={{ display: this.state.showIndustry ? 'block' : 'none' }}>
              <Select title="请选择关注的行业" multiple={true} options={this.state.industryOptions} onConfirm={this.handleSelectIndustry} />
            </div>
        </div>

        <div style = {inputStyle}>
            <TextInput name="password" placeholder="请输入密码" value={this.state.password} handleInputChange={this.handleInputChange} />
        </div>

        <div>
            <Button name="register" type="primary" disabled={disabled} onClick={this.handleSubmit} value="注册" />
        </div>

      </div>

    return <FormContainer previousPage="/register" title="个人信息" innerHtml={content} />
  }

}

export default Register2