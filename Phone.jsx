import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '../core';

const onlyNumbers = value => value
  .replace(/[+ ()-\D]/g, '')
  .replace(/(\d{18})(.*)/g, '$1');

const masks = {
  ru: [
    { match: /^7/, replace: '+7', cursor: { position: [0, 2], value: 2 } },
    { match: /(\d)/, replace: ' ($1', cursor: { position: [3, 5], value: 5 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [6, 6], value: 6 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [7, 7], value: 7 } },
    { match: /(\d)/, replace: ') $1', cursor: { position: [8, 10], value: 10 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [11, 11], value: 11 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [12, 12], value: 12 } },
    { match: /(\d)/, replace: '-$1', cursor: { position: [13, 14], value: 14 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [15, 15], value: 15 } },
    { match: /(\d)/, replace: '-$1', cursor: { position: [16, 17], value: 17 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [18, 18], value: 18 } },
  ],
  kz: [
    { match: /^375/, replace: '+375', cursor: { position: [0, 4], value: 4 } },
    { match: /(\d)/, replace: ' ($1', cursor: { position: [5, 7], value: 7 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [8, 8], value: 8 } },
    { match: /(\d)/, replace: ') $1', cursor: { position: [9, 11], value: 11 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [12, 12], value: 12 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [13, 13], value: 13 } },
    { match: /(\d)/, replace: '-$1', cursor: { position: [14, 15], value: 15 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [16, 16], value: 16 } },
    { match: /(\d)/, replace: '-$1', cursor: { position: [17, 18], value: 18 } },
    { match: /(\d)/, replace: '$1', cursor: { position: [19, 19], value: 19 } },
  ],
  others: [
    { match: /^(370|371|372|373|374|380|992|993|994|995|996|998)/, replace: '+$1' },
    {
      match: /(\d*)/,
      replace: ' $1',
      cursor: {
        value: (value, cursor) => {
          if (!!value.match(/^ \d$/)) {
            return cursor + 1;
          }
        },
      },
    },
  ],
  plus: [
    { match: /^$/, replace: '+' },
  ],
};

class Phone extends React.Component {
  state = {
    text: '',
    value: '',
  }

  setCursor = (cursor) => {
    this.input.selectionStart = cursor;
    this.input.selectionEnd = cursor;
  }

  onChange = (e) => {
    const masksKeys = Object.keys(masks);
    const { target } = e;
    const { selectionStart } = target;
    let value = onlyNumbers(target.value);
    let text = '';
    let isMask = false;
    let indexMask = 0;
    let cursorIndex = null;
    let cursorIndexArgs = null;

    for (indexMask = 0; indexMask < masksKeys.length; indexMask++) {
      const mask = masks[masksKeys[indexMask]];

      for (let index = 0; index < mask.length; index++) {
        const { match, replace, cursor } = mask[index];
        const matchResult = value.match(match);

        if (!matchResult) {
          break;
        } else {
          const maskValue = matchResult[0].replace(match, replace);

          text = `${text}${maskValue}`;
          value = value.replace(match, '');
          isMask = true;

          if (cursor) {
            if ((cursor.position && cursor.position[0] <= selectionStart && selectionStart <= cursor.position[1])
            || (cursor.value instanceof Function && !cursorIndex)) {
              cursorIndex = index;

              if (cursor.value instanceof Function) {
                cursorIndexArgs = [maskValue, selectionStart, matchResult];
              }
            }
          }
        }
      }

      if (isMask) {
        break;
      }
    }

    if (!isMask) {
      const valueOnlyNumbers = `+${onlyNumbers(target.value)}`;

      if (target.value === valueOnlyNumbers) {
        text = target.value;
      } else {
        text = valueOnlyNumbers;
      }
    }

    this.setState({
      value: onlyNumbers(target.value),
      text,
    });

    if (cursorIndex !== null) {
      const maskElementCursor = masks[masksKeys[indexMask]][cursorIndex].cursor;

      if (maskElementCursor) {
        if (maskElementCursor.value instanceof Function) {
          const maskElementCursorValueRes = maskElementCursor.value.apply(this, cursorIndexArgs);

          if (typeof maskElementCursorValueRes === 'number') {
            setTimeout(() => this.setCursor(maskElementCursorValueRes));
          } else {
            setTimeout(() => this.setCursor(selectionStart));
          }
        } else if (typeof maskElementCursor.value === 'number') {
          setTimeout(() => this.setCursor(maskElementCursor.value));
        } else {
          setTimeout(() => this.setCursor(selectionStart));
        }
      } else {
        setTimeout(() => this.setCursor(selectionStart));
      }
    } else {
      setTimeout(() => this.setCursor(selectionStart));
    }
  }

  onFocus = () => {
    if (!this.state.value) {
      this.setState({ text: '+' });
    }
  }

  onBlur = () => {
    if (!this.state.value) {
      this.setState({ text: '' });
    }
  }

  refInput = (input) => {
    this.input = input;
  }

  render() {
    const { onChange, ...props } = this.props;
    const { text } = this.state;

    return (
      <TextField
        {...props}
        value={text}
        inputRef={this.refInput}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      />
    );
  }
}

Phone.propTypes = {
  onChange: PropTypes.func,
};

export default Phone;
