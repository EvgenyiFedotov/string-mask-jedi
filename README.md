# string-mask-jedi

This package allows you to create dynamic masks for the input field with the ability to control the cursor position.

#### Examples
[Config phone mask](#config-phone-mask)  
[Config time mask](#config-time-mask)  
[Config phone mask with repeat elements](#config-phone-mask-with-repeat-elements)  
[Сreate a mask with a handler](#create-a-mask-with-a-handler)  
[Create mask](#create-mask)  
[Create combine mask](#create-combine-mask)  
[Use mask phone](#use-mask-phone)  
[Use mask combine phone](#use-mask-combine-phone)  
[Use mask phone in React.Component](#use-mask-phone-in-react.component)  

## Examples
### Config phone mask
```javascript
const configMask = [
  () => ({ match: /(^7|\+7)/, replace: '+7' }),
  () => ({ match: /(\d)/, replace: ' ($1', space: ' ( ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: ') $1', space: ') ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: '-$1', space: '- ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: '-$1', space: '- ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
];

// '79998887766' => '+7 (999) 888-77-66'
``` 

### Config time mask
```javascript
const configMask = [
  () => ({ match: /([012])/, replace: '$1', space: '_' }),
  maskMap  => ({
    match: maskMap && maskMap[0].value.match(/([01])/) ? /(\d)/  : /([0123])/,
    replace: '$1',
    space: '_',
  }),
  () => ({ match: /([012345])/, replace: ':$1', space: ':_' }),
  () => ({ match: /(\d)/, replace: '$1', space: '_' }),
];

// '1234' => '12:34'
```

### Config phone mask with repeat elements
```javascript
import { repeatMaskElement} from 'string-mask-jedi';

const configMask = [
  () => ({ match: /(\d)/, replace: '+$1' }),
  () => ({ match: /(\d)/, replace: ' $1' }),
  () => ({ match: /(\d)/, replace: '$1' }),
  () => ({ match: /(\d)/, replace: '$1' }),
  () => ({ match: /(\d)/, replace: ' $1' }),
  ...repeatMaskElement(() => ({ match: /(\d)/, replace: '$1' }), 6),
];

// '95557866666' => '+9 555 7866666'
```

### Сreate a mask with a handler
#### `before`
```javascript
import createMask from 'string-mask-jedi';

const configMask = [...];

const mask = creatorMask(configMask, {
  before: ({ value, cursor }) => ({
    value: value.replace(/\D/g, ''),
    cursor,
  }),
});
```

### Create mask
```javascript
import createMask from 'string-mask-jedi';

const configMask = [...];

const mask = creatorMask(configMask);
```

### Create combine mask
```javascript
import createMask, { combine } from 'string-mask-jedi';

const configMaskPhone1 = [...];
const configMaskPhone2 = [...];

// The order of the masks by priority
const mask = combine(
  creatorMask(configMaskPhone1),
  creatorMask(configMaskPhone2),
);
```

### Use mask phone 
#### `Create mask`
```javascript
import createMask from 'string-mask-jedi';

const configMask = [
  () => ({ match: /(^7|\+7)/, replace: '+7' }),
  () => ({ match: /(\d)/, replace: ' ($1', space: ' ( ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: ') $1', space: ') ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: '-$1', space: '- ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: '-$1', space: '- ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
];

const mask = creatorMask(configMask);
```
####  `Add`
```javascript
mask({ value: '7', cursor: 1 });
// => { value: '+7', cursor: 2, space: ' ( ) - - ', isMatched: true }

mask({ value: '+79', cursor: 3 });
// => { value: '+7 (9', cursor: 5, space: ' ) - - ', isMatched: true }

mask({ value: '+7 (99', cursor: 6 });
// => { value: '+7 (99', cursor: 6, space: ' ) - - ', isMatched: true }

mask({ value: '+7 (999', cursor: 7 });
// => { value: '+7 (999', cursor: 7, space: ') - - ', isMatched: true }

mask({ value: '+7 (9998', cursor: 8 })
// => { value: '+7 (999) 8', cursor: 10, space: ' - - ', isMatched: true }

mask({ value: '+7 (97799) 8', cursor: 7 })
// => { value: '+7 (977) 998', cursor: 7, space: '- - ', isMatched: true }

mask({ value: '+7 (955577) 998', cursor: 8 })
// => { value: '+7 (955) 577-99-8', cursor: 10, space: ' ', isMatched: true }

mask({ value: '+7 (000000955) 577-99-8', cursor: 10 })
// => { value: '+7 (000) 000-95-55', cursor: 12, space: '', isMatched: true }

mask({ value: '+7 (1111111111000) 000-95-55', cursor: 14 })
// => { value: '+7 (111) 111-11-11', cursor: 18, space: '', isMatched: true }
```
####  `Remove`
```javascript
mask({ value: '79998887766', cursor: 11 })
// => { value: '+7 (999) 888-77-66', cursor: 18, space: '', isMatched: true }

mask({ value: '+7 (999) 888-77-6', cursor: 17 })
// => { value: '+7 (999) 888-77-6', cursor: 17, space: ' ', isMatched: true }

mask({ value: '+7 (999) 88-77-6', cursor: 11 })
// => { value: '+7 (999) 887-76', cursor: 11, space: '- ', isMatched: true }

mask({ value: '+7 (98-77-6', cursor: 5 })
// => { value: '+7 (987) 76', cursor: 5, space: ' - - ', isMatched: true }

mask({ value: '+787) 76', cursor: 2 })
// => { value: '+7 (877) 6', cursor: 2, space: ' - - ', isMatched: true }

mask({ value: '+ (877) 6', cursor: 1 })
// => { value: '', cursor: 0, space: ' ( ) - - ', isMatched: false }

mask({ value: '799988877', cursor: 9 })
// => { value: '+7 (999) 888-77', cursor: 15, space: '- ', isMatched: true }

mask({ value: '+7 (997', cursor: 6 })
// => { value: '+7 (997', cursor: 6, space: ') - - ', isMatched: true }

mask({ value: '+7 (9998887766', cursor: 14 })
// => { value: '+7 (999) 888-77-66', cursor: 18, space: '', isMatched: true }

mask({ value: '+7 (999) 888-77-6', cursor: 17 })
// => { value: '+7 (999) 888-77-6', cursor: 17, space: ' ', isMatched: true }

mask({ value: '+7 (999) 888-77-', cursor: 16 })
// => { value: '+7 (999) 888-77', cursor: 15, space: '- ', isMatched: true }

mask({ value: '+7 (999) 888-', cursor: 13 })
// => { value: '+7 (999) 888', cursor: 12, space: '- - ', isMatched: true }

mask({ value: '+7 (999)', cursor: 8 })
// => { value: '+7 (999', cursor: 7, space: ') - - ', isMatched: true }
```
#### `Change`
```javascript
mask({ value: '79998887766', cursor: 11 })
// => { value: '+7 (999) 888-77-66', cursor: 18, space: '', isMatched: true }

mask({ value: '+7 (999) 888-77-656', cursor: 18 })
// => { value: '+7 (999) 888-77-65', cursor: 18, space: '', isMatched: true }

mask({ value: '+7 (999) 888-77-4465', cursor: 18 })
// => { value: '+7 (999) 888-77-44', cursor: 18, space: '', isMatched: true }

mask({ value: '+7 (999) 888-733337-44', cursor: 18 })
// => { value: '+7 (999) 888-73-33', cursor: 18, space: '', isMatched: true }

mask({ value: '+7 (999) 822-73-33', cursor: 12 })
// => { value: '+7 (999) 822-73-33', cursor: 12, space: '', isMatched: true }

mask({ value: '+7 (911122-73-33', cursor: 8 })
// => { value: '+7 (911) 122-73-33', cursor: 10, space: '', isMatched: true }
```

### Use mask combine phone
#### `Create mask`
```javascript
import createMask, { combine, repeatMaskElement } from 'string-mask-jedi';

const configMaskPhone1 = [
  () => ({ match: /(^7|\+7)/, replace: '+7' }),
  () => ({ match: /(\d)/, replace: ' ($1', space: ' ( ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: ') $1', space: ') ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: '-$1', space: '- ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
  () => ({ match: /(\d)/, replace: '-$1', space: '- ' }),
  () => ({ match: /(\d)/, replace: '$1', space: ' ' }),
];

const configMaskPhone2 = [
  () => ({ match: /(\d)/, replace: '+$1' }),
  () => ({ match: /(\d)/, replace: ' $1' }),
  () => ({ match: /(\d)/, replace: '$1' }),
  () => ({ match: /(\d)/, replace: '$1' }),
  () => ({ match: /(\d)/, replace: ' $1' }),
  ...repeatMaskElement(() => ({ match: /(\d)/, replace: '$1' }), 6),
];

const mask = combine(
  creatorMask(configMaskPhone1),
  creatorMask(configMaskPhone2, {
    before: ({ value, cursor }) => ({
      value: value.replace(/\D/g, ''),
      cursor,
    }),
  }),
);
```
####  `Add`
```javascript
mask({ value: '7', cursor: 1 })
// => { value: '+7', cursor: 2, space: ' ( ) - - ', isMatched: true }

mask({ value: '+', cursor: 1 })
// => { value: '', cursor: 0, space: '', isMatched: false }

mask({ value: '9888777', cursor: 7 })
// => { value: '+9 888 777', cursor: 10, space: '', isMatched: true }

// ? There may be a bug with the position of the cursor (rare case)
mask({ value: '+79 888 777', cursor: 2 })
// => { value: '+7 (988) 877-7', cursor: 5, space: ' - ', isMatched: true }
```
####  `Remove`
```javascript
mask({ value: '+7 (988) 877-7', cursor: 14 })
// => { value: '+7 (988) 877-7', cursor: 14, space: ' - ', isMatched: true }

mask({ value: '+ (988) 877-7', cursor: 1 })
// => { value: '+9 888 777', cursor: 2, space: '', isMatched: true }

mask({ value: '+9 8 777', cursor: 4 })
// => { value: '+9 877 7', cursor: 4, space: '', isMatched: true }

mask({ value: '+', cursor: 1 })
// => { value: '', cursor: 0, space: '', isMatched: false }
```

### Use mask phone in React.Component
```javascript
import React, { Component } from  'react';
import createMask, { masks, combine } from  'string-mask-jedi';

const mask = combine(
  createMask(...masks.phone.ru),
  createMask(...masks.phone.code),
);

class MaskTextField extends Component {
  focus =  false

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
```