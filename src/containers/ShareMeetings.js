import React from 'react';
import qs from 'qs';
import * as newApi from '../api3.0';
import { handleError } from '../actions/';
import { connect } from 'react-redux';

class ShareMeetings extends React.Component {

  constructor(props) {
    super(props);

    const { search } = this.props.location;
    const key = qs.parse(search.split('?')[1])['key'];
    this.key = key;

    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    newApi.getSharedMeeting(this.key)
      .then(result => {
        this.setState({ data: result });
      })
      .catch(error => this.props.dispatch(handleError(error)));
  }

  render() {
    return <div>
      <div style={{ textAlign: 'center', marginTop: 20 }}><img style={{ width: 160 }} src="/images/logo.png" /></div>
      <div style={{ textAlign: 'center', marginTop: 10, marginBottom: 20, fontSize: 24, fontWeight: 'bolder' }}>会议安排</div>
      <div style={{ height: 1, backgroundColor: '#e9e9e9' }} />
      <div style={{ padding: 6 }}>
        {this.state.data.map(m => m.username ? <div key={m.id} style={{ marginTop: 10, border: '1px solid lightgray', borderRadius: 6 }}>
          <div style={{ padding: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 'bold', color: '#000' }}>{m.username + (m.org ? `（${m.org && m.org.orgname}）` : '')}</div>
            <div style={{ marginTop: 6, color: 'gray' }}>{m.meet_date.replace('T', ' ').substring(0, 16)}</div>
          </div>
          <div style={{ height: 1, backgroundColor: '#e9e9e9' }} />
          <div style={{ padding: 10, color: 'rgb(176, 176, 176)', fontSize: 13 }}>机构介绍：{m.org && m.org.description ? m.org.description : '暂无'}</div>
          {m.isShow ?
            <div>
              <div style={{ height: 1, backgroundColor: '#e9e9e9' }} />
              <div style={{ padding: 10, color: 'rgb(176, 176, 176)', fontSize: 13 }}>会议纪要：{m.comments || '暂无'}</div>
              <div style={{ height: 1, backgroundColor: '#e9e9e9' }} />
              <div style={{ padding: 10, color: 'rgb(176, 176, 176)', fontSize: 13 }}>附件下载：{m.attachment ? <a style={{ color: '#428BCA' }} href={m.attachmenturl}>{m.attachment}</a> : '暂无'}</div>
            </div>
            : null}
        </div> : null)}
      </div>
    </div>;
  }
}

export default connect()(ShareMeetings);