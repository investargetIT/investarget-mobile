import React from 'react'
import Transform from '../transform'
import AlloyTouch from 'alloytouch/alloy_touch.css'



var HEIGHT = 30
var TITLE_HEIGHT = 32

var containerStyle = {
    height: `${HEIGHT * 5 + TITLE_HEIGHT}px`,
    boxShadow: '0 -1px 2px rgba(0,0,0,.1)',
}
var hiddenStyle = Object.assign({}, containerStyle, {
    display: 'none',
})

var scrollStyle = {
    height: `${HEIGHT * 5}px`,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#fff',
}

var itemsStyle = {
    height: `${HEIGHT}px`, // 这个属性不重要，因为内容会溢出显示
    padding: `${HEIGHT * 2}px 0`,
}

var titleStyle = {
    position: 'relative',
    height: `${TITLE_HEIGHT}px`,
    lineHeight: `${TITLE_HEIGHT}px`,
    textAlign: 'center',
    fontSize: '16px',
    borderBottom: '1px solid #eee',
    color: '#999',
}
var cancelIconStyle = {
    position: 'absolute',
    left: '10px',
    top: `${(TITLE_HEIGHT - 24) / 2}px`,
    zIndex: '1',
    width: '24px',
    height: '24px',
}
var confirmIconStyle = {
    position: 'absolute',
    right: '10px',
    top: `${(TITLE_HEIGHT - 24) / 2}px`,
    zIndex: '1',
    width: '24px',
    height: '24px',
}

var itemStyle = {
    height: `${HEIGHT}px`,
    lineHeight: `${HEIGHT}px`,
    textAlign: 'center',
    fontSize: '16px',
}

var maskStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    zIndex: '9',
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.95),hsla(0,0%,100%,.6)),linear-gradient(0deg,hsla(0,0%,100%,.95),hsla(0,0%,100%,.6))',
    backgroundPosition: 'top,bottom',
    backgroundSize: `100% ${HEIGHT * 2}px`,
    backgroundRepeat: 'no-repeat',
}
var borderStyle = {
    position: 'absolute',
    top: `${HEIGHT * 2}px`,
    left: '0',
    zIndex: '9',
    width: '100%',
    height: `${HEIGHT}px`,
}

class PickerView extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        var self = this
        var n = this.props.options.length;
       
        var containerEl = this.refs.container;
        var scrollerEl = this.refs.scroller;
        Transform(scrollerEl)
        
        this.alloyTouch = new AlloyTouch({
            touch: containerEl,
            vertical: true,
            target: scrollerEl,
            property: 'translateY',
            min: -(n + 4 - 5) * HEIGHT,
            max: 0,
            step: HEIGHT,
            spring: true,
            inertia: false,
            touchEnd: function(evt, v) {
                var newV;
                if (v < this.min) {
                    newV = this.min
                } else if (v > this.max) {
                    newV = this.max
                } else {
                    newV = Math.round(v / this.step) * this.step
                }
                var index = - (newV / HEIGHT)
                self.props.onValueChange(self.props.options[index].value)

                this.to(newV)
                this.isTouchStart = false
                return false
            },
        })

         var index = this.props.options.findIndex((option) => {
            return option.value == this.props.value
        })
        this.alloyTouch.to(-index * HEIGHT)
    }

    componentWillReceiveProps(nextProps) {
        var index = nextProps.options.findIndex((option) => {
            return option.value == nextProps.value
        })
        this.alloyTouch.to(-index * HEIGHT)
    }

    componentWillUnmount() {
        this.alloyTouch.destroy()
        this.alloyTouch = null
    }

    render() {
        var options = this.props.options.map(option => {
            return <div style={itemStyle} key={option.value}>{option.name}</div>
        })

        return (
            <div style={this.props.show ? containerStyle : hiddenStyle}>
                <div style={titleStyle}>
                    {this.props.title}
                    <img style={cancelIconStyle} src="/images/x@2x.png" onClick={this.props.onCancel}></img>
                    <img style={confirmIconStyle} src="/images/v@2x.png" onClick={this.props.onConfirm}></img>
                </div>
                <div style={scrollStyle} ref="container">
                    <div style={maskStyle}></div>
                    <div style={borderStyle}></div>
                    <div style={itemsStyle} ref="scroller">
                        {options}
                    </div>
                </div>
            </div>
        )
    }
}

export default PickerView