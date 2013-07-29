var _ = require('underscore')

module.exports = function(io, connectionCallback, disconnectionCallback) {
	var sockets = []

	var socketObj = {
		broadcast: function( event, data ) {
			_.each( sockets, function(socket) {
				socket.emit( event, data )
			})
		}
	}
	
	var onDisconnect = function(socket) {
		sockets.splice( sockets.indexOf(socket), 1 )
		disconnectionCallback(socket)
	}

	io.sockets.on( 'connection', function(socket) {
		sockets.push( socket )
		socket.on( 'disconnect', _.partial( onDisconnect, socket ) )
		connectionCallback(socket)
	})
	
	return socketObj
}