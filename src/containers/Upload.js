import React from 'react';
import Button from '../components/Button';

class Upload extends React.Component {
  
  componentDidMount () {}

  handleInputChange = () => {}

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
          accept="image/*"
          onChange={this.handleInputChange}
        />
        <div style={{ position: 'relative' }}>
        <p style={{ textAlign: 'center', width: '100%' }}>手机上传附件</p>
        <img style={{ position: 'absolute', top: 0, height: 20 }} src="/images/shareLogo@2x.png" />
        </div>
        <div style={{ margin: '10px 0', height: 200, border: '1px solid lightGray', borderRadius: 21, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img style={{ width: 88 }} src="/images/emptyBox@2x.png" />
        </div>
        <Button type="primary" value="上传" onClick={this.handleUploadBtnPressed} />
        <p style={{ fontSize: 12, marginTop: 8, textAlign: 'center' }}>本网页包含隐私信息，请勿将本网页分享给他人</p>
      </div>
    );
  }
}

export default Upload;