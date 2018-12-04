# string-mask-jedi

String-mask-jedi return default function with params:
- submasks {Array}
- [params] {Object}
  - [params.preproc] {Function} (value: string, cursor: number) => object
    ```javascript
    (value, cursor) => { value: `${value}!`, cursor: cursor + 1 }
    ```
  - [params.full] {Boolean} default value: false
  
@return function Mask(value: string, cursor: number)
  
**Submask** {Object[]}, composed form props:
  - match {RegExp}
  - replace {String}
  - [cursor] {Object}
    - [cursor.position] {[Number, Number]}
    - [cursor.value] {Number|Function}
      ```javascript
      // if cursor type Function
      (valueReplace: string, cursor: number, matchResult) => number
      ```

The package was designed for phone masks, but I think it can be adapted for other purposes.
You can also build a library of masks based on the current package.

### Examples:
##### params.full = false;
```javascript
import createMask from 'string-mask-jedi';

const submasks = [
  [
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
];

const mask = createMask(submasks);

console.log(mask('7812312312312312', 2)) // => { value: '+7 (812) 312-31-23', cursor: 2, applied: true }
```

##### params.full = true;
```javascript
import createMask from 'string-mask-jedi';

const submasks = [
  [
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
];

const mask = createMask(submasks, { full: true });

console.log(mask('7812312312312312', 2))

// {
//  applied": true,
//   "cursor": 2,
//   "cursorResult": 2,
//   "value": "7812312312312312",
//   "valuePreproc": undefined,
//   "valueResult": "+7 (812) 312-31-23"
//  }
```

##### params.full = true; with preproc

```javascript
import createMask from 'string-mask-jedi';

const submasks = [
  [
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
];

const mask = createMask(submasks, {
  full: true,
  preproc: function (value) {
    return {
      value: value
        .replace(/[+ ()-\D]/g, '')
        .replace(/(\d{18})(.*)/g, '$1')
    };
  },
});

console.log(mask('78zzz12312312312312', 2))

// {
//   "applied": true
//   "cursor": 2,
//   "cursorResult": 2,
//   "value": "78zzz12312312312312",
//   "valuePreproc": { "value": "7812312312312312" },
//   "valueResult": "+7 (812) 312-31-23",
// }
```
