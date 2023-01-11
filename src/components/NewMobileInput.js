import React from 'react'
import NewTextInput from './NewTextInput'
import PickerView from './PickerView'
import * as newApi from '../api3.0'

var areaCodeStyle = {
    fontSize:'0.68rem',
    lineHeight:'30px',
    paddingLeft:'4px',
    paddingRight:'16px'
}
var areaCodePlusStyle = {
    marginRight: '4px'
}
var areaCodeContentStyle = {
    verticalAlign: 'middle'
}
var areaCodeIconStyle = {
    width:'8px',
    marginLeft:'8px',
    verticalAlign:'middle'
}
var phoneInputStyle = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: '0 20px',
    borderRadius: 6,
}
var pickerViewWrapStyle = {
    position: 'fixed',
    left: '0',
    bottom: '0',
    width: '100%',
}


class MobileInput extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            _areaCode: props.areaCode || '86',
            _options: [{ value: '86', name: '中国' }]
        }
    }

    handleMobileChange = (e) => {
        this.props.onChange({
            mobile: e.target.value,
            areaCode: this.props.areaCode
        })
    }

    handleShow = () => {
        this.setState({ show: true, _areaCode: this.props.areaCode })
    }

    handleAreaCodeChange = (_areaCode) => {
        console.log(':::', _areaCode)
        this.setState({ _areaCode })
    }

    handleCancel = () => {
        this.setState({ show: false })
    }

    handleConfirm = () => {
        this.setState({ show: false })
        this.props.onChange({
            mobile: this.props.mobile,
            areaCode: this.state._areaCode
        })
    }

    componentDidMount() {
        newApi.getSource('country')
            .then(data => {
                const _options = data
                    .filter(item => item.level == 2)
                    .map(item => ({
                        id: item.id,
                        value: item.areaCode,
                        name: item.country,
                    }))
                this.setState({ _options })
            })
            .catch(error => {
                console.error(error)
            })
    }

    render() {
        return (
            <div style={phoneInputStyle}>
                <div onClick={this.handleShow} style={areaCodeStyle}>
                    <span style={areaCodePlusStyle}>+</span>
                    <span style={areaCodeContentStyle}>{this.props.areaCode}</span>
                    <img src="/images/home/filterDown@2x.png" style={areaCodeIconStyle}></img>
                </div>
                <div style={{flex: 1}}>
                    <NewTextInput placeholder="请输入手机号" value={this.props.mobile} handleInputChange={this.handleMobileChange} />
                </div>
                <div style={pickerViewWrapStyle}>
                    <PickerView show={this.state.show}
                        title="国家代码"
                        options={this.state._options}
                        value={this.state._areaCode}
                        onValueChange={this.handleAreaCodeChange}
                        onCancel={this.handleCancel}
                        onConfirm={this.handleConfirm}>
                    </PickerView>
                </div>
            </div>
        )
    }
}

export default MobileInput