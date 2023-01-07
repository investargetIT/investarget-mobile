import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import SelectWithSearch from '../components/SelectWithSearch'
import { connect } from 'react-redux'
import api from '../api'
import * as newApi from '../api3.0'
import * as utils from '../utils'
import { modifyUserInfo, handleError, requestContents, hideLoading } from '../actions'
import qs from 'qs';

const searchContainerStyle = {
  flex: 1,
  marginRight: 10,
  height: 40,
  backgroundColor: 'lightgrey',
  lineHeight: 'normal',
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
}
const searchInputStyle = {
  fontSize: '16px',
  backgroundColor: 'lightgrey',
  border: 'none',
  height: '100%',
  flex: 1,
  verticalAlign: 'middle'
}
const searchIconStyle = {
  width: 24,
  height: 24,
  marginLeft: 4,
  marginRight: 4,
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
          <img style={searchIconStyle} src={api.baseUrl + "/images/keyboard_arrow_up_FILL0_wght400_GRAD0_opsz48.svg"} />
          <img style={searchIconStyle} src={api.baseUrl + "/images/keyboard_arrow_down_FILL0_wght400_GRAD0_opsz48.svg"} />
          <img style={searchIconStyle} src={api.baseUrl + "/images/cancel_FILL0_wght400_GRAD0_opsz48.svg"} />
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

    this.accessToken = qs.parse(this.props.location.search.slice(1)).access_token;
    console.log('access token', this.accessToken);
  }

  componentDidMount() {
    newApi.getUserBaseWithToken(this.props.match.params.id, this.accessToken)
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
    newApi.editUserWithToken([this.state.userInfo.id], { tags: this.state.selectedTags }, this.accessToken)
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
        {this.state.selectedTags && <div style={{ marginTop: 60 }}>
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