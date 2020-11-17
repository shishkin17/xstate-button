# xstate-button

[xstate](https://github.com/davidkpiano/xstate) toggle behaviour for buttons in React out of the box.

## Installation

```bash
npm install --save xstate-button
```

## Usage

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