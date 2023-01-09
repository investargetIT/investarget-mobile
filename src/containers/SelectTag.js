import React, { Component } from 'react'
import NavigationBar from '../components/NavigationBar'
import SelectWithSearch from '../components/SelectWithSearch'
import { connect } from 'react-redux'
import api from '../api'
import * as newApi from '../api3.0'
import * as utils from '../utils'
import { modifyUserInfo, handleError, requestContents, hideLoading } from '../actions'
import qs from 'qs';
import debounce from 'lodash.debounce';
import Button from '../components/Button';

const searchContainerStyle = {
  flex: 1,
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
  verticalAlign: 'middle',
  outline: 0,
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
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', display: 'flex', padding: 10 }}>
        <div style={searchContainerStyle}>
          <img style={searchIconStyle} src={api.baseUrl + "/images/home/ic_search.svg"} />
          <input value={this.props.keyword} style={searchInputStyle} size="10" type="text" placeholder="搜索标签" onChange={this.onChange} />
          {this.props.total > 0 && (
            <span style={{ margin: '0 4px', color: 'gray' }}>{this.props.current + 1}/{this.props.total}</span>
          )}
          <img style={searchIconStyle} src={api.baseUrl + "/images/keyboard_arrow_up_FILL0_wght400_GRAD0_opsz48.svg"} onClick={this.props.onPrev} />
          <img style={searchIconStyle} src={api.baseUrl + "/images/keyboard_arrow_down_FILL0_wght400_GRAD0_opsz48.svg"} onClick={this.props.onNext} />
          <img style={searchIconStyle} src={api.baseUrl + "/images/cancel_FILL0_wght400_GRAD0_opsz48.svg"} onClick={() => this.props.onChange('')} />
        </div>
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
      tagOptions: [],
      keyword: '',
      current: -1,
      total: 0,
    }

    this.accessToken = qs.parse(this.props.location.search.slice(1)).access_token;
    this.searchKeyword = debounce(this.searchKeyword, 500);
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
    this.setState({ keyword: content });
    this.searchKeyword(content, () => this.scrollToCurrent(this.state.current));
  }

  searchKeyword = (keyword, callback) => {
    const { tagOptions, total } = this.searchInParagraphs(this.props.tags, keyword);
    const current = total > 0 ? 0 : -1;
    this.setState({
      keyword,
      tagOptions,
      total,
      current,
    }, () => {
      if (callback) {
        callback();
      }
    });
  }

  searchInParagraphs = (paragraphs, keyword) => {
    if (keyword == null || keyword === '') {
      return {
        tagOptions: paragraphs.map(m => {
          let { label } = m;
          label = [{ text: label, matchIndex: -1 }];
          return { ...m, label };
        }),
        total: 0,
      };
    }
    const keywordRegExp = new RegExp('(' + keyword + ')');
    const newParagraphs = [];
    let matchIndex = -1;

    paragraphs.forEach((paragraph) => {
      const label = [];
      const spans = paragraph.label.split(keywordRegExp).filter((item) => item !== '');
      spans.forEach((span) => {
        label.push({
          text: span,
          matchIndex: span === keyword ? ++matchIndex : -1,
        });
      });

      newParagraphs.push({
        ...paragraph,
        label,
      });
    });
    return {
      tagOptions: newParagraphs,
      total: matchIndex + 1,
    };
  }

  handlePrev = () => {
    const { total, current } = this.state;
    if (total === 1) return;

    const newCurrent = current > 0 ? current - 1 : total - 1;
    this.setState({
      current: newCurrent,
    });
    this.scrollToCurrent(newCurrent);
  }

  handleNext = () => {
    console.log('handle next');
    const { total, current } = this.state;
    if (total === 1) return;

    const newCurrent = current < total - 1 ? current + 1 : 0;
    this.setState({
      current: newCurrent,
    });
    this.scrollToCurrent(newCurrent);
  }

  scrollToCurrent = (current) => {
    if (current === -1) return;

    const markElem = document.querySelector(`[data-match-index="${current}"]`);
    if (markElem) {
      const { top, bottom } = markElem.getBoundingClientRect();
      const isInView = top > 60 + 10 && window.innerHeight - bottom > 60 + 10;
      if (!isInView) {
        markElem.scrollIntoView({
          block: 'center',
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tags.length !== this.props.tags.length) {
      this.searchKeyword(this.state.keyword);
    }
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
        <Search
          keyword={this.state.keyword}
          current={this.state.current}
          total={this.state.total}
          onChange={this.handleSearchChange}
          onPrev={this.handlePrev}
          onNext={this.handleNext}
          onSubmit={this.handleSubmitBtnClicked}
        />
        {this.state.selectedTags && <div style={{ marginTop: 60 }}>
          <SelectWithSearch
            multiple={true}
            options={this.state.tagOptions}
            selected={this.state.selectedTags}
            onChange={this.handleSelectChange}
            current={this.state.current}
          />
        </div>}
        {this.state.cardUrl && <img src={this.state.cardUrl} style={{ marginTop: 20, width: '100%' }} />}
        <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', padding: 10 }}>
          <button className="select-tag__submit-btn" onClick={this.handleSubmitBtnClicked}>提交</button>
        </div>
      </div>
    )
  }

}

function mapStateToProps(state) {
  const { tags, userInfo } = state;
  return { tags: tags.map(m => ({ ...m, label: m.tagName })), userInfo };
}

export default connect(mapStateToProps)(SelectTag)