var firebase = require('firebase');

module.exports = {
    connect : function() {
        io.on('connection', function(socket){
            console.log('a user connected');
            console.log('client sid :', socket.id);

            socket.on('disconnect', function(){
                console.log('user disconnected');
            });
        });
    },
    recievedSmartHomeId : function() {
         io.on('connection', function(socket){
            socket.on('smarthomeId', async function(msg){
                console.log('message: ' + msg);
                console.log(socket.id);
                var smarthomeReference = firebase.database().ref("/smarthomes/"+ msg);
                try {
                    return await smarthomeReference.update({"socketId" : socket.id}).then(
                        function(error) {
                            var response = null;
                            if (error) {
                                response =  { status: false, message: "Data could not be updated." + error };
                            }
                            else {
                                response =  { status: true, message: "Data updated successfully." };
                            }
                            return response;
                        });
                    } catch (e) {
                        throw Error(e.message);
                    }
            });

         });
    },
    emitMessage : function(socketId, emitData) {
         io.to(socketId).emit('hey', emitData);
    },
}
