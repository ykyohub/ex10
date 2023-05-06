import React, { useState } from 'react'
import { Col, Row, Card, Button, Form, InputGroup} from 'react-bootstrap'
import {app} from '../firebaseInit'
import {getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const JoinPage = ({history}) => {
    const auth = getAuth(app);
    const [form, setForm] = useState({
        email:'red@inha.com',
        password: '12341234'
    });
    const [loading, setLoading] = useState(false);
    const {email, password} = form;
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        });
    }

    const onClickJoin = () => {
        if(email === '' || password === '') {
            alert('아이디 또는 비밀번호를 입력하세요.');
        }else{
            setLoading(true);
            createUserWithEmailAndPassword(auth, email, password)
            .then(success=>{
                setLoading(false);
                history.push('/login');
            })
            .catch(error=>{
                setLoading(false);
                alert('회원가입실패:' + error.message);
            });
        }
    }

    if(loading) return <h1 className='my-5 text-center'>로딩중......</h1>
    return (
        <Row className='my-5 justify-content-center'>
            <Col lg={5} xs={8}>
                <h1 className='text-center mb-5'>회원가입</h1>
                <Card className='p-3'>
                    <Form>
                        <InputGroup className='my-2'>
                            <InputGroup.Text>아 이 디</InputGroup.Text>
                            <Form.Control name="email" onChange={onChange}
                                value={email}/>
                        </InputGroup>
                        <InputGroup className='my-2'>
                            <InputGroup.Text>비밀번호</InputGroup.Text>
                            <Form.Control name="password" onChange={onChange}
                                value={password} type="password"/>
                        </InputGroup>
                        <div className='text-center my-3'>
                            <Button onClick={onClickJoin}
                                className='w-100'>회원가입</Button>
                        </div>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}

export default JoinPage