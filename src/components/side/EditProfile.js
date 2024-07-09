import React, { useRef, useState } from "react";
import { Row, Form, Input, Button } from "reactstrap";
import Error from "components/Error";
import Avatar from 'components/Avatar';
import axios from "axios";

function EditProfile(props) {
    const [state, setState] = useState(
        {
            name: props.user.name, 
            about: props.user.about, 
            image: false, 
            avatar: false, 
            error: null
        }
    )
    const fileUpload = useRef(null)

    function showFileUpload(e){ 
        fileUpload.current.click();
    }

    function onImageChange(e) {
        if (e.target.files && e.target.files[0]) {
            setState(prev => {
                return{
                    ...prev,
                    image: URL.createObjectURL(e.target.files[0]),
                    avatar: e.target.files[0]
                }
            })
        }
    }

    function onChange(e) {
        setState(prev => { 
            return {
                ...prev, 
                [e.target.name]: e.target.value, 
                error: null
            } 
        })
    }

    function onSubmit(e) {
        e.preventDefault();
        const data = new FormData();
        data.append('name', state.name);
        data.append('about', state.about);
        if (state.avatar) data.append('avatar', state.avatar, state.avatar.name);
        axios.post('/api/account', data)
        .then(props.toggle)
        .catch(err => setState(prev => {
            return {
                ...prev,
                error: err.response.data.message
            }
        }));
    };

    function onClose(e) {
        setState(prev => {
            return {
                ...prev,
                image: false, 
                name: props.user.name, 
                about: props.user.about
            }
        })
        props.toggle();
    };


    return (
        <div className={props.open ? 'side-profile open' : 'side-profile'}>

            <Row className="heading">
                <div className="mr-2 nav-link" onClick={onClose}>
                    <i className="fa fa-arrow-right" />
                </div>
                <div>الملف الشخصي</div>
            </Row>

            <div className="d-flex flex-column" style={{overflow: 'auto'}}>

                <Form onSubmit={onSubmit}>

                    <Error error={state.error} />

                    <div className="text-center" onClick={showFileUpload}>
                        <Avatar src={props.user.avatar} file={state.image}/>
                    </div>

                    <input type="file" ref={fileUpload} onChange={onImageChange} className="d-none"/>

                    <div className="bg-white px-4 py-2">
                        <label className="text-muted">الاسم</label>
                        <Input value={state.name} name="name" onChange={onChange} required  autoComplete="off"/>
                    </div>

                    <div className="bg-white px-3 py-2">
                        <label className="text-muted">رسالة الحالة</label>
                        <Input value={state.about} name="about" onChange={onChange} required autoComplete="off" />
                    </div>

                    <div className="bg-white px-3 py-2">
                        <Button block className="mt-3">حفظ</Button>
                    </div>

                </Form>

            </div>

        </div>

    );
}

export default EditProfile;
