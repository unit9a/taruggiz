var myWorkerProxy = new NodeWorker( 'mochaTest.js', 'my-worker-name' );
// Get the proxy worker port for communication
var workerProxyPort = myWorkerProxy.port;
// Send a "hello" message to the worker
workerProxyPort.postMessage( {type: 'hello', says: 'Hello worker !'} );

// Listen for worker thread messages
workerProxyPort.onmessage = function( event )
{
    // Proxy receives a message !
    // Same as before, the `event.data` is what the worker proxy sends using `postMessage()`. Could be a String, Number or an Object type.
    // Here, `event.data` contains an object: `{type: String, says: String}`
    var message = event.data;
    switch( message.type )
    {
        // It's a hello world message
        case 'hello':
            console.log( '[RECEIVED BY PROXY] '+ event.says );
            // Say by to the worker
            workerProxyPort.postMessage( {type: 'close', says: 'Bye bye worker!'} );
            break;

        // It's a terminate message
        case 'close':
            console.log( '[RECEIVED BY PROXY] '+ event.says );
        case 'connected':
            console.log( '[RECEIVED BY PROXY] '+ event.says );

        // It's something else. Skip it.
        default:
            break;
    }
}