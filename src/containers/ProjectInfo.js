import React from 'react';
import { requestContents, saveRedirectUrl, handleError } from '../actions';
import { connect } from 'react-redux';
import api from '../api.js';
import * as newApi from '../api3.0.js';
import qs from 'qs';

/**
 * 由于存在两种类型的项目（MarketPlace 项目和非 MarketPlace 项目）
 * 他们的地址和参数都不同，跳转逻辑往往需要单独处理
 * 
 * 现在用这个组件对他们的跳转逻辑进行了封装，对其他组件来说只要打开这个
 * 组件的路由就可以访问项目详情了，不再需要考虑具体跳转逻辑
 * 
 * 如果是 MarketPlace 项目，需要在 url 上带上参数 isMarketPlace，值为 true
 */
class ProjectInfo extends React.Component {

  componentDidMount() {

    if (!this.props.isLogin) {
      this.props.dispatch(saveRedirectUrl(this.props.location.pathname + this.props.location.search));
      this.props.history.replace(api.baseUrl + '/login');
      return;
    }

    const projectID = this.props.match.params.id;
    const isMarketPlace = qs.parse(this.props.location.search.slice(1)).isMarketPlace === 'true';
    if (isMarketPlace) {
      newApi.getProjLangDetail(projectID)
      .then(data => {
        const fileUrl = data.linkpdfurl;
        const userInfo = this.props.userInfo;
        const email = (userInfo && userInfo.emailAddress) ? userInfo.emailAddress : 'deal@investarget.com';
        const url = '/pdf_viewer.html?file=' + encodeURIComponent(fileUrl) + '&watermark=' + encodeURIComponent(email);
        window.location.replace(url);
      })
      .catch(error => this.props.dispatch(handleError(error)));
    } else {
      newApi.getShareToken(projectID)
      .then(token => window.location.replace(api.baseUrl + '/project/' + projectID + (this.props.userInfo ? '?token=' + token : '')))
      .catch(error => this.props.dispatch(handleError(error)));
    }
  }

  render() {
    return <div style={{ width: 1000, height: 1000 }} />;
  }
}

function mapStateToProps(state) {
  const { isLogin, userInfo } = state;
  return { isLogin, userInfo };
}

export default connect(mapStateToProps)(ProjectInfo);