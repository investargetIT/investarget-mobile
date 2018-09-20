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
      result: '',
    };
  }

  componentDidMount() {
    newApi.getSharedMeeting(this.key)
      .then(result => {
        this.setState({ result: JSON.stringify(result) });
      })
      .catch(error => this.props.dispatch(handleError(error)));
  }

  render () {
    return <div>{this.state.result}</div>;
  }
}

export default connect()(ShareMeetings);