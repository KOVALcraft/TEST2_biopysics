const socket = async ()=>{

const {viberClientBot} = require('../messengers/viber/index')
const telegramClientBot = await require('../messengers/telegram/index').telegramClientBot()


//----------проверка выборки данных из базы------------
const {connect, createData, readData, createClient} = require('../database')

const io = require('socket.io')(5000)

const {Client} = require('../database/index').models.roles;
const {telegramClient} = require('../database/index').models.roles


const TextMessage = require('viber-bot').Message.Text

const start = async ()=>{
	try{
		await connect()
		console.log('socket on server started')
		io.on('connection', (socket) => {
			console.log('new connection')
			
			socket.on('react ping', async (msg, log)=>{
				//-----------------создаем нового клиента------------
				await createClient(log)

				//----------запись данных в базу------------
				await createData(msg, log)


				const answerCreate = {status:'create Data completed!'}
				socket.emit('server ping', answerCreate)

				//----------проверка выборки данных из базы-----------
				let res = await readData(msg)

				const answerRead = JSON.stringify(res)
				socket.emit('server ping', answerRead)

				//-----------

				const clients = await Client.find()
				const clientsTg = await telegramClient.find()


				clients.forEach(async client => {
					await viberClientBot.sendMessage(client.profileViber, [
						new TextMessage(`comment from client: ${msg.comment} for file with name: ${msg.name}`)
					])
				})

				clientsTg.forEach(async (telegramClient) => {
					await telegramClientBot.telegram.sendMessage(telegramClient.idTelegram,`comment from client: ${msg.comment} for file with name: ${msg.name}`)
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