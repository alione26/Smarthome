//'use strict';

//Khai báo thư viện để kết nối triển khai code lên firebase-functions
// functions = require('firebase-functions');
// Khai báo các dịch vụ cần dùng được hỗ trợ bởi actions-on-google
var getTemperature = require('./getTemperature')
var socketio = require('../socketio/socketio')
var getSocketId = require('./getSocketId')
const {
  dialogflow,
  Suggestions,
  SimpleResponse,
  } = require('actions-on-google');

//Khai báo các gợi ý dành cho người dùng (tối đa 8 gợi ý)
const intentSuggestions = [
  'light on',
  'light off',
  'temperature',
  'fan on',
  'fan off',
];

// Tạo instance "app" để tương tác với dialogflow.
const app = dialogflow({ debug: true });

// Xử lý các Dialogflow intents.
app.intent('Default Welcome Intent', (conv) => {
  conv.ask(`Welcome, How can I help?`);
  conv.ask(new Suggestions(intentSuggestions));
});

app.intent('Control_Devices', async (conv, { devices, status, location }) => {
      console.log(location);
      var socketId = await getSocketId.getSocketId('de782a97-bc34-4e39-a005-10973e92b54e');
      switch (location) {
        case 'bedroom':
            var emitData = { deviceId : '45b0574d-d4c0-449f-8a4c-e2d3fa4786d1', action : status, data : 'bedroom' };
            socketio.emitMessage(socketId, emitData);
            conv.ask(`OK, switching ${devices} ${status}. Do you want more?`);
            break;
        case 'rest room':
            var emitData = { deviceId : '45b0574d-d4c0-449f-8a4c-e2d3fa4786d1', action : status, data : 'restroom' };
            socketio.emitMessage(socketId, emitData);
            conv.ask(`OK, switching ${devices} ${status}. Do you want more?`)
            break;
        case 'kitchen':
            var emitData = { deviceId : '224f4300-0eed-42a9-bf4b-93947076c4df', action : status, data : 'kitchen' };
            socketio.emitMessage(socketId, emitData);
            conv.ask(`OK, switching ${devices} ${status}. Do you want more?`)
            break;
        case 'living room':
            var emitData = { deviceId : 'f9a5ea77-6013-4fc3-b6cb-26272f3e9cdc', action : status, data : 'living-room' };
            socketio.emitMessage(socketId, emitData);
            conv.ask(`OK, switching ${devices} ${status}. Do you want more?`)
            break;
        default: console.log('No devices')

      }
			conv.ask(new Suggestions(intentSuggestions));
});
app.intent('Get weather', async (conv, {weather_location, weather} ) => {
        if (weather == 'temperature') {
            datatemp = await getTemperature.getTemp();
            data = datatemp.data;
            conv.ask(`OK, temperature is ${data} Celcius degree. Do you want more?`);
        }
});

module.exports = app;
//exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
