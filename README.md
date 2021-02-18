# xstate-button

![](https://shishkin17.github.io/example.gif)

[Live demo on CodeSandbox](https://codesandbox.io/s/modest-hooks-wsihw?file=/src/App.js)

[xstate](https://github.com/davidkpiano/xstate) toggle behavior for buttons in [React](https://reactjs.org/) out of the box.

## What?

This is a hook that makes any button smart by:
- protecting it from multiple clicks until action is finished
- showing current state with name change
- visually disabling while it is inactive

It works with basic html buttons as well as any framework buttons.
## Why use that?

[xstate](https://github.com/davidkpiano/xstate) is awesome and not that hard to understand. But if you decide to make a smart button (that we described above) it comes out it is not that trivial as it seems. In order to accomplish that, you need to understand how to use context, actions and pass data in xstate (and figure out what you really need to use before you actually know that).


## Installation

```bash
npm install --save xstate-button
```

This package needs [xstate](https://github.com/davidkpiano/xstate) and [@xstate/react](https://github.com/davidkpiano/xstate/tree/master/packages/xstate-react) to be installed as well, so if not, use this line to install everything at once:

```bash
npm install --save xstate-button xstate @xstate/react
```


## Usage
You just call a function "useXstateForButton" where you send an http request or do something else with promises. It returns you 3 variables:  start function, button name and disabled status. Now you can specify them for your button.

[Try all examples live on CodeSandbox](https://codesandbox.io/s/modest-hooks-wsihw?file=/src/App.js)

```js
import { useXstateForButton } from 'xstate-button';

// basic example with async function
const MyButton = () => {
   const [start, name, disabled] = useXstateForButton(async (context, event) => {
      return fetch('/').then(response => response.text()).then(text => {
         console.log(text);
      });
   }, {
      readyName: 'Send',
      loadingName: 'Sending...'
   });
   return <button onClick={() => start()} disabled={disabled}>{name}</button>
};

// or you can use Promise explicitly 
const MyButton2 = () => {
   const [start, name, disabled] = useXstateForButton(async (context, event) => {
      return new Promise(resolve => {
         setTimeout(() => resolve(), 1000);
      });
   }, {
      readyName: 'Send',
      loadingName: 'Sending...'
   });

   return <button onClick={() => start()} disabled={disabled}>{name}</button>
};

// you can omit Promise with flag 'promise: true'
const MyButton3 = () => {
   const [start, name, disabled] = useXstateForButton((context, event, resolve) => {
      setTimeout(() => resolve(), 1000); // but don't forget to resolve in the end
   }, {
      readyName: 'Send',
      loadingName: 'Sending...',
      promise: true // notice the flag
   });

   return <button onClick={() => start()} disabled={disabled}>{name}</button>
};

// if you need to pass some data into 'start' function
const MyButton4 = () => {
   const [start, name, disabled] = useXstateForButton(async (context, event) => {
      const { data } = event; // get data you passed
      console.log(data);
      return fetch('/').then(response => response.text()).then(text => {
         console.log(text);
      });
   }, {
      readyName: 'Send',
      loadingName: 'Sending...'
   });
   const data = { a: 1, b: 2};
   return <button onClick={() => start({ data })} disabled={disabled}>{name}</button>; // pass data here
};

// for eventHandlers if no params passed
const MyButton5 = () => {
   const [start, name, disabled] = useXstateForButton((context, event, resolve) => {
      setTimeout(() => resolve(), 1000);
   }, {
      readyName: 'Send',
      loadingName: 'Sending...',
      promise: true,
      noParams: true // this param allows to pass 'start' function as onClick={start} instead of onClick={() => start()}
   });

   return <button onClick={start} disabled={disabled}>{name}</button>;
};
```

## License
[MIT](https://choosealicense.com/licenses/mit/)