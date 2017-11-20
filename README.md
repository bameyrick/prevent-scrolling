# prevent-scrolling
Prevent scrolling while optionally allowing scrolling on specified elements.

## Features

* Prevents scrolling via keyboard
* Maintains scrolling position
* Scrollbar will not disappear
* Can specify elements to still allow scrolling within
* Elements without scrolling disabled do not allow scroll events to overflow out to parent elements


## Install
You can install via npm or yarn.

### npm
```bash
npm install --save prevent-scrolling
```

### yarn
```bash
yarn add prevent-scrolling
```

## Usage

### Importing
You can import using ES6 imports.
```javascript
import { PreventScrolling, ReEnableScrolling } from 'prevent-scrolling';
```

### Preventing Scrolling
```javascript
PreventScrolling();
```

#### Preventing Scrolling but keep scrolling available on one element
```javascript
const myScrollableElement = document.querySelector('.MyScrollableElement');

PreventScrolling(myScrollableElement);
```

#### Preventing Scrolling but keep scrolling available on multiple elements
```javascript
const myScrollableElements = [].slice.call(document.querySelectorAll('.MyScrollableElement'));

PreventScrolling(myScrollableElements);
```

### Re-enabling Scrolling
```javascript
ReEnableScrolling();
```
