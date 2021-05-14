const {server} = require('./server/express')
const {socket} = require('./server/socket')
// const {telegram} = require('./messengers/telegram/index')

const start = async ()=>{
try {
    await server()
        socket()
    // await telegram()
}catch (e){
    console.log(e.message)
}
}

start()