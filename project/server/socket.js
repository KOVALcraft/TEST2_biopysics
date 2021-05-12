const socket = async ()=>{

// const {connect, createData} = require('../database')
const {viberClientBot} = require('../messengers/viber/index')

//----------проверка выборки данных из базы------------
const {connect, readData} = require('../database')

const io = require('socket.io')(5000)

const {Client} = require('../database/index').models.roles;


const TextMessage = require('viber-bot').Message.Text

const start = async ()=>{
	try{
		await connect()
		console.log('socket on server started')
		io.on('connection', (socket) => {
			console.log('new connection')
			
			socket.on('react ping', async (msg)=>{
				// console.log(msg)

				// await createData(msg)

				//----------проверка выборки данных из базы------------
				await readData(msg)
				
				// const answer = {status:'create Data completed!'}
				// socket.emit('server ping', answer)

				//----------проверка выборки данных из базы-----------

				let res = await readData(msg)

				const answer = JSON.stringify(res)
				socket.emit('server ping', answer)

				//-----------

				const clients = await Client.find()
				// console.log(clients)
				clients.forEach(async client => {
					await viberClientBot.sendMessage(client.profileViber, [
						new TextMessage(`comment from client: ${msg.comment} for file with name: ${msg.name}`)
					])
				})
			})
		})
	}catch (e) {
		console.log(e.message)
	}
}
start()
}

module.exports = {socket}