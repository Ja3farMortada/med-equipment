const {
    contextBridge,
    ipcRenderer
} = require('electron')

contextBridge.exposeInMainWorld(
    'electron', {
        ipcRenderer: ipcRenderer,
        send: async (channel, data) => {
            let response = await ipcRenderer.invoke(channel, data);
            return response;
        },
        receive: (channel, fn) => {
            ipcRenderer.on(channel, (event, ...args) => fn(...args))
        }
    }
)