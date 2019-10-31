#from aiohttp import web
import socketio
# create a Socket.IO server
sio = socketio.AsyncServer()
#app = web.Application()
#sio.attach(app)

@sio.on('connect')
async def connect(sid, environ):
    print('connect ', sid)

@sio.on('disconnect')
async def disconnect(sid):
    print('disconnect ', sid)
    
#if __name__ == '__main__':
    #web.run_app(app)