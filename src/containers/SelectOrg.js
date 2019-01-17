import React from 'react';
import NavigationBar from '../components/NavigationBar';
import * as api from '../api3.0';
import { selectOrAddOrg } from '../actions';
import debounce from 'lodash.debounce';

function OrgItem({ orgname, description, onPress }) {
  return (
    <div onClick={onPress} style={{ backgroundColor: 'white', padding: 10, borderBottom: '1px solid #f4f4f4' }}>
      <div>{orgname}</div>
      <div style={{ marginTop: 6, height: 32, overflow: 'hidden', color: '#999', fontSize: 12, lineHeight: '16px' }}>{description}</div>
    </div>
  );
}

class SelectOrg extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      orgs: [],
    };
    this.searchOrg = debounce(this.searchOrg, 400);
  }

  componentDidMount() {
    this.searchOrg();
  }

  searchOrg = () => {
    const params = {
      search: this.state.search
    };
    api.getOrg(params)
    .then(result => {
      const orgs = result.data.map(item => {
        var obj = {}
        obj['id'] = item.id;
        obj['orgname'] = item.orgname;
        obj['description'] = item.description;
        return obj
      });
      this.setState({ orgs });
    })
    .catch(err => console.error(err));
  };

  handleSearchTextChange = e => {
    this.setState({ search: e.target.value }, this.searchOrg);
  }

  render () {

    const rows = this.state.orgs.map(m => <OrgItem key={m.id} {...m} 
      onPress={this.props.onSelectOrg.bind(this, m)} />
    );

    return (
      <div>
        <NavigationBar title="选择或新增机构" backIconClicked={this.props.backIconClicked} />

        <div style={{ position: 'absolute', left: 0, right: 0 }} >
          
          <div style={{ display: 'flex', height: 48, backgroundColor: 'white', paddingLeft: 8, paddingRight: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <img
              src="/images/search.png" 
              style={{ width: 20, height: 20, marginRight: 8, flexGrow: 0, flexShrink: 0, flexBasis: 20 }}
            />
            <input 
              style={{ fontSize: 15, flex: 1 }}
              placeholder="搜索项目"
              value={this.state.search}
              onChange={this.handleSearchTextChange}
            />
            <div onClick={this.props.onAddOrg.bind(this, this.state.search)} style={{ fontSize: 16, color: '#10458F', textAlign: 'right' }}>添加机构</div>
          </div>

          <div style={{ height: 1, backgroundColor: "#CED0CE" }} />

        </div>

        <div style={{ marginTop: 49 }}>
          {rows}
        </div>

      </div>
    ) 
  }
}

export default SelectOrg;