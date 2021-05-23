import React, {useState, useEffect} from "react";

import io from 'socket.io-client'
const socket = io('localhost:5000', {transports:['websocket']})

const App = ()=> {

    const [message, setMessage] = useState('')
    const clickHandler = async (e)=>{

        const msg = {
            name:'NEW_image_0.1',
            comment:'create new test image 0.1'
        }

        const log = {
            mail:'mail@test.ua',
            password:'password123'
        }

        socket.emit('react ping', msg, log)
}

        useEffect(()=>{
            socket.on('server ping', (msg, log)=>{
                setMessage(JSON.stringify(msg, log))
    })
})

  return (
    <div className="App">
      <div>response: {message}</div>
        <button onClick={clickHandler}>send</button>
    </div>
  );
}

export default App;
