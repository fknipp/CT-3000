import React from 'react';
import Rebase from 're-base';

import LightsComponent from './viewer/lights';
import TheMatrixComponent from './viewer/theMatrix';
import MusicPlayerComponent from './viewer/musicPlayer';

export default class Viewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: {},
      classId: this.generateId(),
    };
  }

  componentWillMount() {
    this.base = Rebase.createClass('https://blink-ct.firebaseio.com/classes/' + this.state.classId);

    this.ref = this.base.syncState('display', {
      context: this,
      state: 'display'
    });
  }

  componentDidMount() {
    this.refs.chat.scrollTop = this.refs.chat.scrollHeight;
  }

  componentDidUpdate() {
    this.refs.chat.scrollTop = this.refs.chat.scrollHeight;
  }

  componentWillUnmount() {
    this.base.removeBinding(this.ref);
  }

  generateId() {
    const num = Math.floor(Math.random() * 1000000).toString();
    const pad = '000000';
    return pad.slice(num.length) + num;
  }

  render() {
    const sessions = this.state.display.sessions || {};
    const nrSessions = this.state.display.sessions ? Object.keys(sessions).length : 0;

    return(
      <div className="viewer">
        <div className="content">
          <div className="diagonal-thingy" aria-hidden="true"></div>

          <h2 className="header-init">
            <span className="class-id">Digibord ID: { this.state.classId }</span>
          </h2>

          <div ref="chat" className="chat">
            { this.renderMessages() }
          </div>

          <div className="users-total">
            <h3>{ nrSessions } gebruiker{ nrSessions !== 1 ? 's' : '' }</h3>
          </div>

          <TheMatrixComponent />

          <MusicPlayerComponent music={ this.state.display.music || {} } sessions={ this.state.display.sessions || {} } />
        </div>

        <LightsComponent sessions={ this.state.display.sessions || {} } />
      </div>
    );
  }

  renderMessages() {
    const messages = this.state.display.messages || {};
    const sessions = this.state.display.sessions || {};

    return Object.entries(messages).map(([key, message]) => {
      const session = sessions[message.sessionKey] || {};
      const userName = session.name || 'Anoniempje';

      return (
        <div className="user-message" key={ key }>
          <div className="user-name">{ userName } zegt:</div>
          <div className="user-text">{ message.message }</div>
        </div>
      );
    });
  }
}
