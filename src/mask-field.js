import React, { Component } from 'react';

class MaskField extends Component {
  state = {
    text: '',
    maskRes: null,
  }

  ref = input => this.input = input

  componentDidUpdate() {
    if (this.state.maskRes) {
      this.input.selectionStart = this.state.maskRes.cursor;
      this.input.selectionEnd = this.state.maskRes.cursor;
    }
  }

  onChange = (e) => {
    if (this.props.mask) {
      const maskRes = this.props.mask({
        value: e.target.value,
        cursor: this.text.selectionStart,
      });
  
      this.setState({
        text: maskRes.isMatched
          ? `${maskRes.value}${maskRes.space}`
          : maskRes.value,
        maskRes: maskRes.isMatched ? maskRes : null,
      });
    }
  }


  render() {
    return (
      <input
        ref={this.ref}
        value={this.state.text}
        onChange={this.onChange}
      />
    );
  }
}

export default MaskField;
