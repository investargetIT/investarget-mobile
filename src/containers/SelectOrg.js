import React from 'react';
import NavigationBar from '../components/NavigationBar';

class SelectOrg extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };
  }

  handleSearchTextChange = e => {
    this.setState({ search: e.target.value }, this.searchProject);
  }

  render () {
    return (
      <div>
        <NavigationBar title="选择或新增机构" />

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
            <div onClick={this.handleAddOrgBtnPressed} style={{ fontSize: 16, color: '#10458F', textAlign: 'right' }}>添加机构</div>
          </div>

          <div style={{ height: 1, backgroundColor: "#CED0CE" }} />

        </div>

      </div>
    ) 
  }
}

export default SelectOrg;