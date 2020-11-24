import React, { Component } from 'react';
import PropsType from 'prop-types';
import _ from 'lodash';

import './scrollcontainer.css';

class ScrollContainer extends Component {

    constructor() {
        super();
        this.scrollBoxRef = null;
        this.contentBoxRef = null;
        this.loadingRef = React.createRef();
        this.state = {
            paddingTop: "30px",
            loading: false,
            loadingOffset: -100,
            boxHeight: 0
        }
    }

    static propTypes = {
        onScrollBoxMount: PropsType.func,
        onScrollPageRequest: PropsType.func,
        onScrollPageResponse: PropsType.func
    }

    componentDidMount() {
        this.props.onScrollBoxMount(this.scrollBoxRef, this.contentBoxRef);
        this.setState({ boxHeight: this.contentBoxRef.getBoundingClientRect().height })

        this.addScrollEvent();
    }

    handleObserver() {

    }

    addScrollEvent = () => {
        this.scrollBoxRef.addEventListener("scroll", _.throttle(this.handleScrolling), false);
        document.addEventListener("DOMContentLoaded", this.handleScrolling, false);
    } 

    handleScrolling = async (e) => {
        if (parseInt(this.props.page) > 1 && this.scrollBoxRef.scrollTop <= 30) {
            const offsetPercent = (30 - this.scrollBoxRef.scrollTop) / 30 * 100;
            this.setState({ loadingOffset: offsetPercent - 100 })
        } else {
            this.setState({ loadingOffset: -100 })
        }

        if (!this.state.loading) {
            if (this.scrollBoxRef.scrollTop <= 0) {
                try {
                    this.setState({ loading: true })
                    await this.props.onScrollPageRequest();
                } catch (error) {
                    console.warn(error);
                } finally {
                    this.setState({ loading: false })
                    this.setState((prevState) => {
                        const currentHeight = this.contentBoxRef.getBoundingClientRect().height;
                        this.scrollBoxRef.scrollTo(0, currentHeight - prevState.boxHeight)
                        return ({ boxHeight: currentHeight });
                    })
                }
            }
        }
    }

    render() {
        return (
            <div ref={(el) => this.scrollBoxRef = el} className={`scrollBox ${this.props.className}`} style={{ paddingTop: this.state.paddingTop }}>
                <div ref={this.loadingRef} className="scrollBox--loader" style={{ height: this.state.paddingTop, top: this.state.loading ? 0 : `${this.state.loadingOffset}%` }}>Loading</div>
                <div ref={(el) => this.contentBoxRef = el} className={`scrollBox--content ${this.props.contentClassName}`}>
                    { this.props.children }
                </div>
            </div>
        )
    }
}

export default ScrollContainer;