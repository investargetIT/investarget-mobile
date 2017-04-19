import React from 'react'
import Transform from '../transform'
import AlloyTouch from 'alloytouch/alloy_touch.css'


var containerStyle = {
    width: '100%',
    overflow: 'hidden',
}
var wrapStyle = {
    width: '125%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
}
var cellStyle = {
    flexShrink: '0',
    width: '80%',
}

class SwipeCell extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        var self = this
        var containerEl = this.refs.container
        var scrollerEl = this.refs.scroller
        var rightEl = this.refs.right
        var RIGHT_WIDTH = rightEl.clientWidth

        Transform(scrollerEl)
        this.alloyTouch = new AlloyTouch({
            touch: containerEl,
            vertical: false,
            target: scrollerEl,
            property: 'translateX',
            min: -RIGHT_WIDTH,
            max: 0,
            step: RIGHT_WIDTH,
            spring: true,
            inertia: false,
            touchEnd: function(evt, v, index) {
                if (v <= -RIGHT_WIDTH/2) {
                    this.to(this.min)
                } else {
                    this.to(this.max)
                }
                self.props.onPositionChange()
                
                this.isTouchStart = false
                return false
            },
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isInitialPosition) {
            this.alloyTouch.to(this.alloyTouch.max)
        }
    }
    
    componentWillUnmount() {
        this.alloyTouch.destroy()
        this.alloyTouch = null
    }

    render() {
        var rightStyle = {
            flexShrink: '0',
            width: '20%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: this.props.actionBackgroundColor || 'red',
            color: '#fff',
        }
        return (
            <div style={containerStyle} ref="container">
                <div style={wrapStyle} ref="scroller">
                    <div style={cellStyle}>
                        {this.props.children}
                    </div>
                    <div style={rightStyle} ref="right" onClick={this.props.delete}>{this.props.action || "删除"}</div>
                </div>
            </div>
        )
    }
}


export default SwipeCell