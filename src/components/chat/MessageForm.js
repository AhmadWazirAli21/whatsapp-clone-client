import React, { useState } from "react";
import { Input } from "reactstrap";
import moment from "moment";

const MessageForm = props => {
  const [message, setMessage] = useState('');
  const [lastType, setLastType] = useState(false)

  const onChange = e => setMessage(e.target.value);

  const onSend = e => {
    if(!message) return;
    let newMessage = {
      content: message,
      date: new Date().getTime()
    };
    props.sender(newMessage);
    setMessage('');
  };

  const onInput = e => {
    if (!lastType || moment() - lastType > 2000){
      setLastType(moment());
      props.sendType();
    }
  };
  
  const onKeyDown = e => {
    if(e.key === 'Enter' && !e.shiftKey){
      setLastType(false);
      onSend();
      e.preventDefault();
    } 
  };

  return (
    <div id="send-message">
        <Input type="textarea" rows="1" onChange={onChange} onKeyDown={onKeyDown} onInput={onInput} value={message} placeholder="اكتب رسالتك هنا"/>
        <i className="fa fa-send text-muted px-3 send" onClick={onSend}/>
    </div>
  );
}

export default MessageForm;