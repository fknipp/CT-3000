import React from 'react';
import Reflux from 'reflux';

import ObjectStore from '../../../stores/object';

export default (ComposedComponent, type, status = '') => class BaseObject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      object: ObjectStore.getObject(type) || {},
      digibord: ObjectStore.getObject('digibord') || {}
    };
  }

  componentDidMount() {
    this.unsubscribe = ObjectStore.listen((name) => {
      this.onUpdate(name);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onUpdate(data) {
    if(data && data.objects) {
      this.setState({
        object: data.objects[type] || {},
        digibordConnected: this.isDigibordConnected(data.objects.digibord)
      });
    }
  }

  isDigibordConnected(digibord) {
    if(digibord && digibord.state && digibord.state.length === 6) {
      return true;
    }

    return false;
  }

  render() {
    let classNames = [
      'object',
      type
    ];

    const object = this.state.object;
    if(object) {
      const state = object.state;
      if(object.type == 'rgb' && typeof state === 'object') {
        classNames.push('aan'); // Hardcoded, ugh...
        classNames.push('rgb'); // Hardcoded, ugh...
      }
      else if(object.values) {
        classNames.push(state);
      }
      else if(object.type == 'string' || object.type == 'text')
      {
        classNames.push(state === '' ? 'empty' : 'set');
      }
      else if(object.type == 'int')
      {
        classNames.push('int-' + state);
      }
    }

    return (
      <div className={classNames.join(' ')}>
        <ComposedComponent { ...this.props } { ...this.state } />
      </div>
    );
  }
};
