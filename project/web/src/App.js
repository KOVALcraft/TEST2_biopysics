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

        socket.emit('react ping', msg)
}

        useEffect(()=>{
            socket.on('server ping', (msg)=>{
                setMessage(JSON.stringify(msg))
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
