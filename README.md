# Node.js Comm Module
***
Socket, server socket, serial, file all-in-one communication module. You can easily handle all unified events in simple block.
***
## Create a Socket
```
const CommBuilder = requier("node-comm");

var socket = CommBuilder.setType("socket").setConfig({
    type: "client",
    host: "localhost",
    port: 50001,
    family: 4,  // IPv4 | IPv6
    isContinuous: false
}).build();
```