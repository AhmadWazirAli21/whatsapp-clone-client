import { Button, Card, Row, Spinner } from "reactstrap"
import { ChatHeader, ContactHeader, Contacts, EditProfile, MessageForm, Messages, UserProfile } from "components"
import { Fragment, useEffect, useRef, useState } from "react"
import Auth from "Auth"
import { useNavigate } from "react-router-dom"
import io from "socket.io-client"

export default function Chat() {
    const navigate = useNavigate()
    const [state, setState] = useState({
        connected: false,
        user: null,
        messages: null,
        contacts: null,
        contact: null,
        typing: null,
        userProfile: false,
        profile: false
    })
    const socket = useRef(null)
    
    useEffect(() => {
        initSocketConnection()
        return () => {
            socket.current.off('connect')
            socket.current.off('disconnect')
            socket.current.off('error')
            socket.current.off('data')
            socket.current.disconnect()
        }
    }, [])

    useEffect(() => {
        socket.current.on('typing', onTypingMessage)
        socket.current.on('user_status', updateUsersState)
        socket.current.on('message', onNewMessage)
        socket.current.on('new_user', onNewUser)
        socket.current.on('update_user', onUpdateUser)
        return () => {
            socket.current.off('typing')
            socket.current.off('user_status')
            socket.current.off('message')
            socket.current.off('new_user')
            socket.current.off('update_user')
        }
    }, [state.contact, state.contacts, state.user, state.messages])
    
    function initSocketConnection() {
        socket.current = io(process.env.REACT_APP_SOCKET, { query: 'token=' + Auth.getToken() })
        socket.current.on('connect', () => setState(prev => { return {...prev, connected: true} }))
        socket.current.on('disconnect', () => setState(prev => { return {...prev, connected: false} }))
        socket.current.on('error', err => {
            if(err === 'auth_error') {
                Auth.logout()
                navigate('/login')
            }
        })
        socket.current.on('data', (user, contacts, messages) => {
            setState(prev => {
                return {
                    ...prev,
                    user,
                    contacts,
                    messages,
                    contact: contacts[0]
                }
            })
        })
    }
    
    function onUpdateUser(user) {
        if(state.user.id === user.id) {
            setState(prev => { return {...prev, user} })
            return;
        }
        let contacts = state.contacts.map(contact => {
            if(contact.id === user.id) contact = user
            return contact
        })
        setState(prev => { return {...prev, contacts} })
        if(state.contact.id === user.id) setState(prev => { return {...prev, contact: user} })
    }

    function onTypingMessage(sender) {
        if(state.contact.id !== sender) return;
        setState(prev => { return {...prev, typing: sender} })
        setTimeout(() => setState(prev => { return {...prev, typing: false} }), 2000)
    }

    function sendType() {
        return socket.current.emit('typing', state.contact.id)
    }
    
    function updateUsersState(statusId) {
        let contacts = state.contacts.map((contact) => {
            if(statusId[contact.id]) contact.status = statusId[contact.id]
            return contact
        })
        let contact = state.contact
        if(contact && statusId[contact.id]) contact.status = statusId[contact.id]
        setState(prev => { return {...prev, contacts, contact} })
    }

    function sendMessage(message) {
        if(!state.contact.id) return;
        message.receiver = state.contact.id
        socket.current.emit('message', message)
    }

    function onNewMessage(message) {
        let typing = state.typing
        if(message.sender === state.contact.id) {
            typing = false
            socket.current.emit('seen', state.contact.id)
            message.seen = true
        }
        let messages = state.messages
        messages.push(message)
        setState(prev => { return {...prev, messages, typing} })
    }

    function onNewUser(user) {
        setState(prev => { return {...prev, user} })
    }

    function onChatNavigate(contact) {
        socket.current.emit('seen', contact.id)
        let messages = state.messages.map(message => {
            if(message.sender === contact.id) message.seen = true
            return message
        })
        setState(prev => { return {...prev, contact, messages} })
    }

    function userProfileToggle() {
        setState(prev => { return {...prev, userProfile: !state.userProfile} })
    }

    function profileToggle() {
        setState(prev => { return {...prev, profile: !state.profile} })
    }

    function renderChat() {
        if(!state.contact) return;
        
        return (
            <Fragment>
                <ChatHeader contact={state.contact} typing={state.typing} toggle={userProfileToggle} />
                <Messages user={state.user} messages={state.messages.filter(e => e.sender === state.contact.id || e.receiver === state.contact.id)} /> 
                <MessageForm sender={sendMessage} sendType={sendType}/>
            </Fragment>
        )
    }

    if(!state.connected || !state.user || !state.contacts || !state.messages) {
        return <>
            <Spinner id="loader" color="success" />
            <Card className="auth col-lg-3 col-sm-6">
                ربما هناك عطل
                <Button color="primary" block style={{margin: '10 10 10 10'}} className="mb-3" onClick={() => {Auth.logout(); navigate('/login')}} >خروج</Button>
            </Card>
        </>
    }

    return (
        <Row className="h-100">
            <div id="contacts-section" className="col-6 col-md-4">
                <ContactHeader user={state.user} toggle={profileToggle} />
                <Contacts messages={state.messages} contacts={state.contacts} onChatNavigate={onChatNavigate} />
                {state.contact && <UserProfile contact={state.contact} toggle={userProfileToggle} open={state.userProfile} />}
                <EditProfile user={state.user} toggle={profileToggle} open={state.profile} />
            </div>
            <div id="messages-section" className="col-6 col-md-8">
                {renderChat()}
            </div>
        </Row>
    )
}