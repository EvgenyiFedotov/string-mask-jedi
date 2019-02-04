import React, { Component } from 'react';
import createMask, { masks, combine } from 'string-mask-jedi';

const mask = combine(
  createMask(...masks.phone.ru),
  createMask(...masks.phone.code),
);

class MaskTextField extends Component {
  focus = false

  state = {
    value: '',
    cursor: 0,
  }

  componentDidUpdate() {
    if (this.focus) {
      const { cursor } = this.state;

      this.input.selectionStart = cursor;
      this.input.selectionEnd = cursor;
    }
  }

  onChange = (e) => {
    const {
      isMatched,
      value,
      space,
      cursor,
    } = mask({
      value: e.target.value,
      cursor: this.input.selectionStart,
    });

    this.setState({
      value: isMatched ? `${value}${space}` : value,
      cursor: isMatched ? cursor : this.input.selectionStart,
    });
  }

  refInput = input => this.input = input

  onFocus = () => this.focus = true

  onBlur = () => this.focur = false

  render = () => (
    <input
      {...this.props}
      ref={this.refInput}
      value={this.state.value}
      onChange={this.onChange}
      onFocus={this.onFocus}
      onBlur={this.onBlur}
    />
  )
}

export default MaskTextField;
