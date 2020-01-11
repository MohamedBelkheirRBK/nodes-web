import React, { useState, useEffect } from "react";
import io from 'socket.io-client';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import FriendsList from '../friends/friendsList/friendsList.jsx'

import MessageList from '../messages/MessagesList.jsx'
import SendMessageForm from "../messages/sendMessageForm.jsx";

import { getChat } from '../../chat_controller/controller';






export function Chat(props) {
    //using hooks
    const [chat, setChat] = useState({id:null, messages:[]})
    const [socket, setSocket] = useState(null)

    function connect(user) {
        getChat(user, localStorage.getItem('username'))
        .then(({data})=>{
            var newSocket = io('http://192.168.137.82:5001/room1', {
            query: {
                'authorization': `bearer ${localStorage.getItem("token")}`
            }
            })
            newSocket.emit('room', chat.id)
            setSocket(newSocket);
            setChat(data)
        })

        
    }

    function sendMessage(msg) {
        socket.emit('message', {
            username: localStorage.getItem('username'),
            text: msg,
            chatroomid: chat.id
        })
    }

    return (
        < div className="app">
            <FriendsList click={connect}/>
            {(()=>{
                if(chat.id!==null){
                    return <MessageList chat={chat}/>
                } else {
                    return <div>Click on a Friend</div>
                }
            })()}
            <SendMessageForm click={sendMessage}/>
        </div >
    )
}
export default Chat