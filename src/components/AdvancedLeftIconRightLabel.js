import React from 'react'
import api from '../api'
import TextInput from './TextInput'

const height = 44

var iconStyle = {
  width: '20px',
  height: '20px',
  margin: (height - 20) / 2 + 'px 0px'
}


const rightIconStyle = {
  width: '20px',
  height: '20px',
  marginRight: 8,
}

const container = {
  position: 'relative',
  marginLeft: 14,
  marginRight: 8,
}

var itemContainerStyle = {
  zIndex: 2,
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 0',
}

const border = {
  WebkitTransform: 'scale(0.5)',
  transform: 'scale(0.5)',
  position: 'absolute',
  borderBottom: '1px solid lightGray',
  top: '-50%',
  right: '-50%',
  bottom: '-50%',
  left: '-50%',
}

class LeftIconRightLabel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      inputValue: props.label,
      isEditMode: false,
    }
  }

  handleValueChange = e => {
    this.setState({ inputValue: e.target.value });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.label !== this.props.label) {
      this.setState({ isEditMode: false });
    }
  }

  handleUpdateTopic = (id, name) => {
    if (!name) return;
    if (name === this.props.label) {
      this.setState({ isEditMode: false });
      return;
    }
    this.props.onUpdateTopic(id, name);
  }

  render() {
    return (
      <div style={container}>

        <div style={itemContainerStyle} >
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <img alt="" style={{ width: 20 }} src="/images/userCenter/chat_bubble_FILL0_wght400_GRAD0_opsz48.svg" />
            <div style={{ margin: '0 12px', fontSize: 14, color: '#ececf1', flex: 1 }}>
              {!this.state.isEditMode ?
                <span onClick={() => this.props.onClick(this.props.topicID, this.props.label)}>{this.props.label}</span>
                :
                <input value={this.state.inputValue} style={{ border: 0, fontSize: 14, color: 'inherit', width: '100%', backgroundColor: 'inherit' }} onChange={this.handleValueChange} />
              }
            </div>
          </div>

          {!this.state.isEditMode ? (
            <div style={{}}>
              <img onClick={() => this.setState({ isEditMode: true, inputValue: this.props.label })} alt="" style={rightIconStyle} src={api.baseUrl + "/images/userCenter/edit_FILL0_wght400_GRAD0_opsz48.svg"} />
              <img onClick={() => this.props.onDelete(this.props.topicID)} alt="" style={rightIconStyle} src={api.baseUrl + "/images/userCenter/delete_FILL0_wght400_GRAD0_opsz48.svg"} />
            </div>
          )
            :
            (
              <div style={{}}>
                <img onClick={() => this.handleUpdateTopic(this.props.topicID, this.state.inputValue)} alt="" style={rightIconStyle} src={api.baseUrl + "/images/userCenter/done_FILL0_wght400_GRAD0_opsz48.svg"} />
                <img onClick={() => this.setState({ isEditMode: false })} alt="" style={rightIconStyle} src={api.baseUrl + "/images/userCenter/close_FILL0_wght400_GRAD0_opsz48.svg"} />
              </div>
            )}

        </div>

        {/* <div style={border}></div> */}

      </div>
    );
  }
}

export default LeftIconRightLabel