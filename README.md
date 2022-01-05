# prevent-scrolling

Prevent scrolling while optionally allowing scrolling on specified elements.

[![GitHub release](https://img.shields.io/github/release/bameyrick/prevent-scrolling.svg)](https://github.com/bameyrick/prevent-scrolling/releases)
[![Build Status](https://travis-ci.com/bameyrick/prevent-scrolling.svg?branch=master)](https://travis-ci.com/bameyrick/prevent-scrolling)
[![codecov](https://codecov.io/gh/bameyrick/prevent-scrolling/branch/master/graph/badge.svg)](https://codecov.io/gh/bameyrick/prevent-scrolling)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/8aecf75299c64acf88b3a433bb590367)](https://www.codacy.com/gh/bameyrick/prevent-scrolling)

## Features

- Prevents scrolling via keyboard
- Maintains scrolling position
- Scrollbar will not disappear
- Can specify elements to still allow scrolling within
- Elements without scrolling disabled do not allow scroll events to overflow out to parent elements

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
