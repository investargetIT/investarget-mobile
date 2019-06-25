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
      thumbnails: [],
      files: [],
    }
  }

  componentDidMount () {
    newApi.queryMobileUploadKey(this.key)
      .then(result => {
        if (!result[this.key] || !result[this.key]['is_active'] || result[this.key].key) {
          this.setState({ isActive: false });
        }
      })
      .catch(err => this.setState({ isActive: false }));
  }

  findIconByFilename = filename => {
    if (/\.(gif|jpg|jpeg|bmp|png|webp)$/i.test(filename)) {
      return '/images/image.png';
    } else if (/\.(doc|docx)$/i.test(filename)) {
      return '/images/doc.png';
    } else if (/\.(ppt|pptx)$/i.test(filename)) {
      return '/images/ppt.png';
    } else if (/\.(xls|xlsx)$/i.test(filename)) {
      return '/images/xls.png';
    } else if (/\.(mp4|avi)$/i.test(filename)) {
      return '/images/file-video-icon.png';
    } else if (/\.(pdf)$/i.test(filename)) {
      return '/images/pdf.png';
    } else {
      return '/images/unknow.png';
    }
  }

  handleInputChange = e => {
    const allFiles = [...e.target.files];
    this.setState({
      files: allFiles,
      thumbnails: allFiles.map(m => {
        if (/^image\//i.test(m.type)) {
          return URL.createObjectURL(m);
        } else {
          return this.findIconByFilename(m.name);
        }
      }),
    });
  }

  handleChooseFilesBtnPressed = () => {
    this.inputElement.click();
  }

  handleUploadBtnPressed = () => {
    let files = [];
    const uploadAllReq = this.state.files.map((file, i) => {
      let bucket;
      if (/^image\//i.test(file.type)) {
        bucket = 'image';
      } else {
        bucket = 'file';
      }
      files[i] = {};
      files[i].bucket = bucket;
      files[i].filename = file.name;
      return newApi.qiniuUpload(bucket, file);
    });
    this.props.dispatch(requestContents());
    let body;
    let isActive = true;
    // 上传文件
    Promise.all(uploadAllReq) 
      .then(result => {
        files = result.map((m, i) => ({ ...files[i], key: m.data.key, realfilekey: m.data.realfilekey }));
        body = {
          record: this.key,
          files
        };
        // 查询二维码是否有效
        return newApi.queryMobileUploadKey(this.key);
      })
      .then(result => {
        // 这个二维码已经失效时调用删除接口
        if (result[this.key] && !result[this.key]['is_active']) {
          isActive = false;
          return newApi.deleteMobileUploadKey(this.key);
        } else {
          // 更新这个二维码的内容
          return newApi.updateMobileUploadKey(body);
        }
      })
      .then(result => {
        this.props.dispatch(hideLoading());
        if (isActive) {
          this.setState({ showModal: true });
        } else {
          this.setState({ isActive: false });
        }
      })
      .catch(error => {
        this.props.dispatch(handleError(error));
        this.setState({ isActive: false });
      });
  }

  render () {
    return (
      <div style={{ padding: 10 }}>
        <input
          ref={input => this.inputElement = input}
          style={{ display: 'none' }}
          type="file"
          onChange={this.handleInputChange}
          multiple
        />
        <div style={{ position: 'relative' }}>
        <p style={{ textAlign: 'center', width: '100%' }}>手机上传附件</p>
        <img style={{ position: 'absolute', top: 0, height: 20 }} src="/images/shareLogo@2x.png" />
        </div>
        <div style={{ margin: '10px 0', minHeight: 200, border: '1px solid lightGray', borderRadius: 21, padding: '10px 20px', overflow: 'auto' }}>
          {this.state.thumbnails.length === 0 ? (
            <img style={{ width: 88, margin: 'auto', marginTop: 52, display: 'block' }} src="/images/emptyBox@2x.png" /> 
          ) : (
            this.state.thumbnails.map((m, i) => <div key={i} style={{ float: 'left', marginTop: 10, width: '48%', marginRight: i % 2 === 0 ? '4%' : undefined }}>
              <img style={{ width: '100%' }} src={m} />
              <p style={{ wordBreak: 'break-all', textAlign: 'center' }}>{this.state.files[i].name}</p>
            </div>)
          )}
        </div>
        <Button type="primary" value="选择文件" onClick={this.handleChooseFilesBtnPressed} disabled={!this.state.isActive} />
        <div style={{ marginTop: 10 }}>
          <Button type="primary" value="上传" onClick={this.handleUploadBtnPressed} disabled={this.state.files.length === 0} />
        </div>
        <p style={{ fontSize: 12, marginTop: 8, textAlign: 'center' }}>
        { this.state.isActive ? '本网页包含隐私信息，请勿将本网页分享给他人' : '二维码已过期，请重新生成二维码' }
        </p>
        <Modal show={this.state.showModal} title="上传成功" content="请在桌面版浏览器中查看" />
      </div>
    );
  }
}

export default connect()(Upload);