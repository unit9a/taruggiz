var random_name = requireNode( 'mocha' );

// onconnect is called everytime a new worker proxy is created
onconnect = function( msg )
{
    // Get the worker port for communication with the worker proxy
    // Always use `ports[0]`
    var workerPort = msg.ports[0];

    // Send a message to the worker proxy. The worker is up and running.
    workerPort.postMessage({type: 'connected', says: "I'm alive!"});

    // Listen for worker proxy messages
    workerPort.onmessage = function( event )
    {
        // Worker receives a message !
        // The `event.data` is what the worker proxy sends using `postMessage()`. Could be a String, Number or an Object type.
        // Here, `event.data` contains an object: `{type: String, says: String}`
        var message = event.data;
        switch( message.type )
        {
            // It's a hello world message
            case 'hello':
                console.log( '[RECEIVED BY WORKER] '+ event.says );
                // Use node module to get a cool worker name !
                //var name = random_name();
                // Reply to the worker proxy
                workerPort.postMessage( {type: 'hello', says: 'Hello proxy! I am '+name+'.' } );
                break;

            // It's a terminate message
            case 'close':
                console.log( '[RECEIVED BY WORKER] '+ event.says );
                // Reply to the worker proxy
                workerPort.postMessage( {type: 'close', says: 'I will be back!'} );
                // Close the worker
                console.log( '[WORKER] Worker stops' );
                close();
                break;

            // It's something else. Skip it.
            default:
                break;
        }
    }
}