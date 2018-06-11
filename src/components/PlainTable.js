import React, {Component} from 'react'

const tableStyle = {
    "table": {
        width: "100%", 
        background: "white", 
        borderSpacing: 0, 
        padding: "0 25px"
    },
    "tbody": {
        width: "100%"
    },
    "tr": {
        width: "100%",
        lineHeight: 1,
        fontSize: 18
    },
    "th": {
        textAlign: "left",
        padding: "15px 5px",
    },
    "td": {
        padding: "15px 5px",
        borderTop: "solid 1px #EEE",
        borderBottom: "solid 1px transparent",
        minWidth: 120,
    }
}

export default class PlainTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showHeader: this.props.showHeader === undefined ? true : this.props.showHeader,
            data: this.props.data || [],
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.data) this.setState({data: newProps.data})
    }

    renderLine(elem, contents, props={}) {
        return React.createElement("tr", {...props, style: tableStyle["tr"]}, contents.map((v,i) => React.createElement(elem, {key: i, style: tableStyle[elem] || null}, v)))
    }

    render() {
        return (
            <table style={tableStyle["table"]}>
                <tbody style={tableStyle["tbody"]}>
                    { this.state.showHeader && this.props.header ? this.renderLine("th", this.props.header, {key: -1}) : null }
                    { this.state.data.map((v,i) => this.renderLine("td", v, {key: i}))}
                </tbody>
            </table>
        )
    }


}