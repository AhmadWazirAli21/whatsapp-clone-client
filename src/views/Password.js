import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Input, Button } from "reactstrap";
import { Error }from "components";
import axios from "axios";
import logo from 'assets/logo.png';

function Password(props) {
    const navigate = useNavigate()
    const[state, setState] = useState({
        password: '', 
        newPassword: ''
    })

    function onChange(e) {
        setState(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value, error: null
            }
        })
    }

    function onSubmit (e) {
        e.preventDefault()
        let data = { password: state.password, newPassword: state.newPassword };
        axios.post('/api/account/password', data)
        .then(res => {
            navigate('/')
        })
        .catch(err => {
            setState(prev => {
                return {
                    ...prev, 
                    error: err.response.data.message 
                }
            })
        })
    }

    return (
        <Card className="auth col-lg-3 col-sm-6">
            <Form onSubmit={onSubmit}>
                <img src={logo} alt="" width="200"  />
                <h5 className="mb-4">تغيير كلمة المرور</h5>
                <Error error={state.error} />
                <Input type="password"  value={state.password} name="password" onChange={onChange} placeholder="كلمة المرور الحالية" required />
                <Input type="password"  value={state.newPassword} name="newPassword" onChange={onChange} placeholder="كلمة المرور الجديدة" required />
                <Button block className="mb-3"> تغيير </Button>
                <small><Link to="/">عودة</Link></small>
                <p className="m-3 mb-3 text-muted">&copy; { new Date().getFullYear() }</p>
            </Form>
        </Card>
    )
}

export default Password;
