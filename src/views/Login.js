import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Input, Button } from "reactstrap";
import Error from 'components/Error';
import Logo from 'assets/logo.png'
import axios from "axios";
import Auth from 'Auth';

export default function Login() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    function onChange(e) {
        if(e.target.name === 'username') {
            setUsername(e.target.value)
            setError(null)
        }
        if(e.target.name === 'password') {
            setPassword(e.target.value)
            setError(null)
        }
    }
    function onSubmit(e) {
        e.preventDefault()
        let data = {username, password}
        axios.post('/api/auth', data).then(res => {
            Auth.login(res.data)
            navigate('/')
        })
        .catch(err => {
            setError(err.response.data.message)
        })
    }

    return (
        <Card className="auth col-lg-3 col-sm-6">
            <Form onSubmit={onSubmit} >
                <img src={Logo} alt="" width="200" />
                <h5 className="mb-4">تسجيل دخول</h5>
                <Error error={error} />
                <Input value={username} name="username" onChange={onChange} placeholder=" الاسم المستخدم" required/>
                <Input value={password} name="password" onChange={onChange} placeholder="كلمة السر" required />
                <Button color="primary" block className="mb-3">دخول</Button>
                <small><Link to="/register">انشاء حساب جديد</Link></small>
                <p className="m-3 text-muted">&copy; 2018-2019</p>
            </Form>
        </Card>
    )
}