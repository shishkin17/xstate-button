import  { Machine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

const requestMachine = Machine({
    id: 'request', 
    context: {
        buttonName: '',
        readyName: '',
        loadingName: '',
        buttonDisabled: false
    },
    initial: 'ready',
    states: {
        ready: {
            on: {
                REQUEST: {
                    target: 'loading',
                    actions: assign((context, event) => {
                        return {
                            buttonName: context.loadingName,
                            buttonDisabled: true
                        }
                    })
                }
            }
        },
        loading: {
            invoke: {
                src: 'request',
                onDone: { 
                    target: 'ready',
                    actions: assign((context, event) => {
                        return {
                            buttonName: context.readyName,
                            buttonDisabled: false
                        }
                    })
                }
            }
        }
    }
});

const isSet = (value) => value !== null && value !== undefined;

export const useXstateForButton = (request, config) => {
    if (!isSet(request)) {
        console.error('useXstateForButton: request not specified');
        return [];
    }
    if (typeof request !== 'function') {
        console.error('useXstateForButton: request must be a function');
        return [];
    }
    if (!isSet(config) || typeof config !== 'object')
        config = {};
    let readyName = config.readyName;
    let loadingName = config.loadingName;
    if (!isSet(readyName))
        readyName = 'Button';
    if (!isSet(loadingName))
        loadingName = 'Loading...';
    let promise;
    if (config.promise === true)
        promise = async (context, event) => new Promise((resolve, reject) => request(context, event, resolve));
    else
        promise = request;

    const myRequestMachine = requestMachine.withContext({
        buttonName: readyName,
        readyName,
        loadingName
    });
    const [state, send] = useMachine(myRequestMachine, {
        services: {
          request: promise
        }
    });
    const buttonName = state.context.buttonName;
    const buttonDisabled = state.context.buttonDisabled;
    const start = (params) => {
        if (isSet(params) && config.noParams !== true)
            send('REQUEST', params);
        else
            send('REQUEST');
    };
    return [start, buttonName, buttonDisabled];
};