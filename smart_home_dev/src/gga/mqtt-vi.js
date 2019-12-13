var mqtt = require('mqtt');
var socketio = require('../socketio/socketio');
var getSocketId = require('./getSocketId');

module.exports = {
    doAction : function() {
        var client = mqtt.connect('mqtt://io.adafruit.com',{
            port: 1883,
            username: 'lclinh',
            password: '84dc5a5e6c024953a8fc01959b784b8e'
        });

        client.on('connect', function () {
            console.log('MQTT connected');
            client.subscribe('lclinh/feeds/light.living-room', function (err) {
                if (!err) {
                //client.publish('presence', 'Hello mqtt')
                }
            })
            client.subscribe('lclinh/feeds/light.bedroom', function (err) {
                if (!err) {

                }
            })
            client.subscribe('lclinh/feeds/light.kitchen', function (err) {
                if (!err) {

                }
            })
            client.subscribe('lclinh/feeds/light.rest-room', function (err) {
                if (!err) {

                }
            })
        })

        client.on('message', async function (topic, message) {
            // message is Buffer
            var socketId = await getSocketId.getSocketId('de782a97-bc34-4e39-a005-10973e92b54e');
            switch (topic.toString()) {
                case 'lclinh/feeds/light.bedroom':
                    var emitData = { deviceId : '45b0574d-d4c0-449f-8a4c-e2d3fa4786d1', action : message.toString(), data : 'bedroom' };
                    socketio.emitMessage(socketId, emitData);
                    break;
                case 'lclinh/feeds/light.rest-room':
                    var emitData = { deviceId : '57d686a0-f53e-4ddf-8ebb-3a552ac17393', action : message.toString(), data : 'restroom' };
                    socketio.emitMessage(socketId, emitData);
                    break;
                case 'lclinh/feeds/light.kitchen':
                    var emitData = { deviceId : '224f4300-0eed-42a9-bf4b-93947076c4df', action : message.toString(), data : 'kitchen' };
                    socketio.emitMessage(socketId, emitData);
                    break;
                case 'lclinh/feeds/light.living-room':
                    var emitData = { deviceId : 'f9a5ea77-6013-4fc3-b6cb-26272f3e9cdc', action : message.toString(), data : 'living-room' };
                    socketio.emitMessage(socketId, emitData);
                    break;
                default: console.log('No devices')

              }
            console.log('Topic : ', topic.toString());
            console.log('Message : ', message.toString());
            //client.end()
        })
    }
}
