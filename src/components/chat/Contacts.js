import { Input, Row } from 'reactstrap'
import Contact from './Contact'
import { useState } from 'react'

const Contacts = props => {
  const [search, setSearch] = useState('');
  
  function onSearch(e) {
    setSearch(e.target.value)
  }

  function renderContact(contact, index) {
    if(!contact.name.includes(search)) return;
    let messages = props.messages.filter(e => e.sender === contact.id || e.receiver === contact.id)
    let lastMessage = messages[messages.length - 1]
    let unseen = messages.filter(e => !e.seen && e.sender === contact.id).length
    return(
      <div className='w-100' key={index} onClick={props.onChatNavigate.bind(this, contact)}>
        <Contact contact={contact} message={lastMessage} unseen={unseen} />
      </div>
    )
  }

  return (
    <div className='list'>
      <Row className='search'>
        <Input onChange={onSearch} placeholder='بحث' />
      </Row>
      <Row id='contacts'>
        { props.contacts? props.contacts.map( (contact, index) => renderContact(contact, index) ) : '' }
      </Row>
    </div>
  )
}

export default Contacts