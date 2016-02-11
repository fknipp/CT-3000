import React from 'react';
import { StaggeredMotion, spring, presets } from 'react-motion';

import * as Objects from './objects/_index';

const springSetting1 = {stiffness: 172, damping: 18};

export default React.createClass ({
  getInitialState() {
    const elements = Object.keys(Objects).map((key) => {
      return { name: key, status: false }
    });
    const stroom = false;
    return { elements, stroom }
  },

  // +++++++++++++ <TEST-CODE> ++++++++++
  toggleElement(i){
    if(i == 0) {
      this.setState({
        stroom: !this.state.stroom
      });
    }
    var n = 0;
    const elements = Object.keys(Objects).map((key) => {
      var status = n === i ? !this.state.elements[n].status : this.state.elements[n].status;
      n++;
      return { name: key, status: status }
    });
    this.setState({
       elements: elements
    });
  },

  handleKeyUp(e) {
    var num = e.which-49;
    if(num >= 0 & num <= 5) {
        this.toggleElement(num);
    }
  },

  componentDidMount: function() {
    document.addEventListener('keyup', this.handleKeyUp);
  },
  // +++++++++++++ </TEST-CODE> ++++++++++


  getDefaultStyles() {
    var o = [];
    this.state.elements.forEach(key => {
      o.push({ x:300, scale: 0.5 });
    })
    return o;
  },

  render() {
    let pos = this.state.stroom ? 0 : 300;
    let size = this.state.stroom ? 1 : 0.5;

    return(
      <div className="status-bar" onKeyUp={this.handleKeyUp}>
        <StaggeredMotion
          defaultStyles={this.getDefaultStyles()}
          styles={prevInterpolatedStyles => prevInterpolatedStyles.map((_, i) => {
            return i === 0
             ? { x: spring(pos, springSetting1), scale: spring(size, springSetting1)}
             : { x: spring(prevInterpolatedStyles[i-1].x, springSetting1), scale: spring(prevInterpolatedStyles[i-1].scale, springSetting1) }
          })}>

          {interpolatingStyles =>
            <div className="elements">
              { interpolatingStyles.map((style, i) => {
                const ObjectInstance = Objects[this.state.elements[i].name];
                return <ObjectInstance key={i} style={{ transform: 'scale(' + style.scale + ') translateY(' + style.x + 'px)'}} status={this.state.elements[i].status} />
              })}
            </div>
          }
        </StaggeredMotion>
      </div>
    );
  }
});