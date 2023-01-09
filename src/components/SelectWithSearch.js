import React from 'react'
import Button from './Button'

var containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#fff',
}

var titleStyle = {
    padding: '15px',
    width: '100%',
    fontSize: '16px',
}

var selectWrapStyle = {
    flexGrow: '1',
    overflowY: 'scroll',
    width: '100%',
}

var selectStyle = {
    // display: 'flex',
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    // flexWrap: 'wrap',
    padding: '10px',
}

var optionStyle = {
    float: 'left',
    // flexGrow: '1',
    // flexShrink: '0',
    margin: '5px',
    padding: '.5em 1em',
    border: '1px solid #ccc',
    borderRadius: '1.5em',
    lineHeight: '1',
    textAlign: 'center',
    color: '#999',
    fontSize: '14px',
    backgroundColor: '#fff',
    maxWidth: '50%',
}

var activeOptionStyle = Object.assign({}, optionStyle, {
    border: '1px solid rgb(34, 105, 212)',
    color: 'rgb(34, 105, 212)',
})

var actionStyle = {
    flexShrink: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
}

var clearStyle = {
    flexGrow: '1',
    height: '50px',
    lineHeight: '50px',
    textAlign: 'center',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#ccc',
}
var confirmStyle = {
    flexGrow: '1',
    height: '50px',
    lineHeight: '50px',
    textAlign: 'center',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: 'rgb(34, 105, 212)',
}


class Select extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selected: props.selected ? props.selected : [],
        }

        if (props.multiple) {
            this.handleSelect = this.handleMultipleSelect.bind(this)
        } else {
            this.handleSelect = this.handleSingleSelect.bind(this)
        }
        this.confirm = this.confirm.bind(this)
        this.clear = this.clear.bind(this)
    }

    handleMultipleSelect(event) {
        var target = event.currentTarget;
        var id = parseInt(target.dataset.id)
        var array = this.state.selected.slice()
        var index = array.indexOf(id)
        if (index > -1) {
            array.splice(index, 1)
        } else {
            array.push(id)
        }

        this.setState({
            selected: array,
        })
        this.props.onChange(array);

    }

    handleSingleSelect(event) {
        var target = event.target
        var id = parseInt(target.dataset.id)

        if (this.state.selected.indexOf(id) == -1) {
            this.setState({
                selected: [id],
            })
        }
    }

    clear(event) {
        this.setState({
            selected: []
        })
    }

    confirm(event) {
        var selected = this.state.selected.slice()
        this.props.onConfirm(selected)
    }

    // multiple, options, onChange

    render() {
        var items = this.props.options.map(option => {
            var style = (this.state.selected.indexOf(option.id) == -1) ? optionStyle : activeOptionStyle
            return <span style={style} key={option.id} data-id={option.id} onClick={this.handleSelect}>
                {option.label.map(({ text, matchIndex }, index) => {
                    if (matchIndex > -1) {
                        return (
                            <mark
                                key={index}
                                data-match-index={matchIndex}
                                style={{
                                    color: 'inherit',
                                    padding: 0,
                                    background: matchIndex === this.props.current ? 'rgba(245, 74, 69, 0.6)' : 'rgba(255, 198, 10, 0.6)',
                                }}
                            >
                                {text}
                            </mark>
                        );
                    } else {
                        return <span key={index}>{text}</span>;
                    }
                })}
            </span>
        })
        
        return <div style={containerStyle}>
            {this.props.title && <div style={titleStyle}>{this.props.title}</div>}
            <div style={selectWrapStyle}>
                <div style={selectStyle} className="clearfix">
                    {items}
                </div>
            </div>
        </div>
    }
}

export default Select