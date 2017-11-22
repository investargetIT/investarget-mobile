import React from 'react';
import Button from '../components/Button';
import * as newApi from '../api3.0';
import { requestContents, hideLoading, handleError } from '../actions';
import { connect } from 'react-redux';
import qs from 'qs';
import Modal from '../components/Modal';

class Upload extends React.Component {
  
  constructor (props) {
    super (props);

    const { search } = this.props.location;
    const key = qs.parse(search.split('?')[1])['key'];
    this.key = key;

    this.state = {
      isActive: true,
      showModal: false,
    }
  }

  componentDidMount () {
    newApi.queryMobileUploadKey(this.key)
      .then(result => {
        if (!result[this.key] || !result[this.key]['is_active'] || result[this.key].key) {
          this.setState({ isActive: false });
        }
      })
  }

  handleInputChange = e => {
    const file = e.target.files[0];
    window.echo(file);
    const filename = file.name;
    let bucket;
    if (/^image\//i.test(file.type)) {
      bucket = 'image';
    } else {
      bucket = 'file';
    }
    this.props.dispatch(requestContents());
    newApi.qiniuUpload(bucket, file)
      .then(result => {
        this.props.dispatch(hideLoading());
        const { key: cardKey, url: cardUrl } = result.data;
        const body = {
          record: this.key,
          filename,
          bucket,
          key: cardKey,
        }
        return newApi.updateMobileUploadKey(body);
      })
      .then(result => {
        this.setState({ showModal: true });
      })
      .catch(error => this.props.dispatch(handleError(error)));
  }

  handleUploadBtnPressed = () => {
    this.inputElement.click();
  }

  render () {
    return (
      <div style={{ padding: 10 }}>
        <input
          ref={input => this.inputElement = input}
          style={{ display: 'none' }}
          type="file"
          onChange={this.handleInputChange}
        />
        <div style={{ position: 'relative' }}>
        <p style={{ textAlign: 'center', width: '100%' }}>手机上传附件</p>
        <img style={{ position: 'absolute', top: 0, height: 20 }} src="/images/shareLogo@2x.png" />
        </div>
        <div style={{ margin: '10px 0', height: 200, border: '1px solid lightGray', borderRadius: 21, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img style={{ width: 88 }} src="/images/emptyBox@2x.png" />
        </div>
        <Button type="primary" value="上传" onClick={this.handleUploadBtnPressed} disabled={!this.state.isActive} />
        <p style={{ fontSize: 12, marginTop: 8, textAlign: 'center' }}>
        { this.state.isActive ? '本网页包含隐私信息，请勿将本网页分享给他人' : '二维码已过期，请重新生成二维码' }
        </p>
        <Modal show={this.state.showModal} title="上传成功" content="请在桌面版浏览器中查看" />
      </div>
    );
  }
}

export default connect()(Upload);