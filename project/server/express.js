
const server = async () => {
	const path = require('path')
	const {viberClientBot} = require('../messengers/viber/index')
	require('dotenv').config();


	const express = require('express')
	const port = process.env.PORT;
	const app = express();

	app.use(express.static(path.join(__dirname, '/../', 'web', 'build')))
	app.get('/', async (req, res) => {
		res.sendFile('index.html')
	})

	// app.listen(port, () => {
	// 	console.log('express on port: ', port)
	// })

	app.use(`/${process.env.VIBER_CLIENT_BOT_TOKEN}`, viberClientBot.middleware());

	const ngrok = require('ngrok');
	const url = await ngrok.connect({
		proto: 'http',
		addr: process.env.PORT,
		authtoken: process.env.NGROK_AUTHTOKEN,
		region: 'us',
		onStatusChange: status => {},
		onLogEvent: data => {}
	})
console.log(url)
	app.listen(port, ()=>{
		viberClientBot.setWebhook(url + `/${process.env.VIBER_CLIENT_BOT_TOKEN}`).catch(err=>{console.log(err)})
		console.log('project started');
	})
}

module.exports = {server}