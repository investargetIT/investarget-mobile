import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import SelectWithSearch from '../components/SelectWithSearch'
import { connect } from 'react-redux'
import api from '../api'
import * as newApi from '../api3.0'
import * as utils from '../utils'
import { modifyUserInfo, handleError, requestContents, hideLoading } from '../actions'

const searchContainerStyle = {
  flex: 1,
  marginRight: 10,
  height: '30px',
  backgroundColor: 'lightgrey',
  lineHeight: 'normal',
  borderRadius: '10px'
}
const searchInputStyle = {
  fontSize: '16px',
  backgroundColor: 'lightgrey',
  border: 'none',
  height: '100%',
  width: '80%',
  verticalAlign: 'middle'
}
const searchIconStyle = {
  width: '20px',
  height: '20px',
  marginLeft: 8,
  marginRight: '8px',
  verticalAlign: 'middle',
}

class Search extends Component {
  constructor(props) {
    super(props);
  }

  onChange = event => {
    this.props.onChange(event.target.value);
  }

  render() {
    return (
      <div style={{ backgroundColor: 'white', position: 'fixed', top: 0, left: 0, width: '100%', display: 'flex', padding: 10 }}>
        <div style={searchContainerStyle}>
          <img style={searchIconStyle} src={api.baseUrl + "/images/home/ic_search.svg"} />
          <input style={searchInputStyle} type="text" placeholder="搜索标签" onChange={this.onChange} />
        </div>
        <button style={{ padding: '0 10px' }} onClick={this.props.onSubmit}>提交</button>
      </div>
    );
  }
}

class SelectTag extends Component {

  constructor(props) {
    super(props)

    this.state = {
      userInfo: null,
      cardUrl: null,
      selectedTags: null,
    }
  }

  componentDidMount() {
    newApi.getUserBase(this.props.match.params.id)
      .then(res => {
        this.setState({ userInfo: res, selectedTags: res.tags ? res.tags.map(m => m.id) : [] });
        const { cardBucket, cardKey } = res;
        if (cardBucket && cardKey) {
          return newApi.downloadUrl(cardBucket, cardKey);
        }
      })
      .then(result => {
        if (result) {
          this.setState({ cardUrl: result })
        }
      })
      .catch(error => {
        this.props.dispatch(handleError(error));
      });
  }

  handleSearchChange = content => {
    console.log('content', content);
  }

  handleSubmitBtnClicked = () => {
    this.props.dispatch(requestContents(''));
    newApi.editUser([this.state.userInfo.id], { tags: this.state.selectedTags })
      .then(() => {
        this.props.dispatch(hideLoading());
        this.props.dispatch(handleError(new Error('更新成功！')));
      })
      .catch(error => {
        this.props.dispatch(handleError(error))
      })
  }

  handleSelectChange = selectedTags => {
    this.setState({ selectedTags });
  }

  render() {
    return (
      <div>
        <Search onChange={this.handleSearchChange} onSubmit={this.handleSubmitBtnClicked} />
        {this.state.selectedTags && <div style={{ marginTop: 50 }}>
          <SelectWithSearch
            multiple={true}
            options={this.props.tags.map(item =>
              Object.assign({}, item, {
                name: item.tagName
              })
            )}
            selected={this.state.selectedTags}
            onChange={this.handleSelectChange}
          />
        </div>}
        {this.state.cardUrl && <img src={this.state.cardUrl} style={{ marginTop: 20, width: '100%' }} />}
      </div>
    )
  }

}

function mapStateToProps(state) {
  const { tags, userInfo } = state;
  return { tags, userInfo };
}

export default connect(mapStateToProps)(SelectTag)