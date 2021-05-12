const {server} = require('./server/express')
const {socket} = require('./server/socket')

const start = async ()=>{
try {
    await server()
        socket()
}catch (e){
    console.log(e.message)
}
}

start()