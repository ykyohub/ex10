import React, { useState, useEffect } from 'react'
import {Row, Col, Form, Button, InputGroup} from 'react-bootstrap'
import ModalPostcode from './ModalPostcode'
import {app} from '../firebaseInit'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage'

const MyPage = ({ history }) => {
    const [loading, setLoading] = useState(false);
    const db = getFirestore(app);
    const storage = getStorage(app);
    const [file, setFile] = useState(null);
    const [form, setForm] = useState({
        name:'무기명',
        address: '인천 미추홀구 인하로 100',
        phone: '032-860-7144',
        image: 'https://via.placeholder.com/200x200',
    });

    const  {name, address, phone, image} = form;
    
    const getUser = async() => {
        setLoading(true);
        const result = await getDoc(doc(db, 'users', sessionStorage.getItem('email')))
        if(result.exists()) {
            setForm(result.data());
        }
        setLoading(false);
    }

    useEffect(()=>{
        getUser();
    }, []);

    const onChangeFile = (e) => {
      setForm({
        ...form,
        image: URL.createObjectURL(e.target.files[0]),
      });
      setFile(e.target.files[0]);
    }
    
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const onPostcode = (address) => {
        setForm({
            ...form,
            address:address
        });
    }

    const onUpdate = async() => {
        //자동으로 ID를 생성하려면 
        //const docRef = await addDoc(collection(store, 'users'), {form}) 
        //console.log('Document ID:', docRef.id)
        
        //setDoc을 사용하여 문서를 만들때 만들 문서의 ID를 지정해야 한다.
        if(!window.confirm('회원정보를 수정하실래요?')) return;
        setLoading(true);

        if(!file){
            await setDoc(doc(db, 'users', sessionStorage.getItem('email')), {...form});
            setLoading(false);
            history.push('/');
        }else{
            uploadBytes(ref(storage, `/images/${Date.now()}.jpg`), file).then(snapshot=>{
                getDownloadURL(snapshot.ref).then(async(url)=>{
                    await setDoc(doc(db, 'users', sessionStorage.getItem('email')), {...form, image:url});
                    setLoading(false);
                    history.push('/');
                });
            });
        }
    }

    if(loading) return <h1 className='my-5 text-center'>로딩중......</h1>
    return (
        <Row className='my-5'>
            <Col>
                <h1 className='text-center mb-5'>회원정보</h1>
                <Form className='px-3'>
                    <InputGroup className='my-2'>
                        <InputGroup.Text className='px-5'>성 명</InputGroup.Text>
                        <Form.Control value={name}
                            name="name" onChange={onChange}/>
                    </InputGroup>
                    <Row>
                        <Col md={10} xs={9}>
                            <InputGroup className='my-2'>
                                <InputGroup.Text className='px-5'>주 소</InputGroup.Text>
                                <Form.Control value={address}
                                    name="address" onChange={onChange}/>
                            </InputGroup>
                        </Col>
                        <Col>
                            <ModalPostcode onPostcode={onPostcode}/>
                        </Col>
                    </Row>
                    <InputGroup className='my-2'>
                        <InputGroup.Text className='px-5'>전 화</InputGroup.Text>
                        <Form.Control value={phone}
                            name="phone" onChange={onChange}/>
                    </InputGroup>
                    <div>
                        <img className='my-2' 
                            src={image} width="20%"/>
                        <Form.Control onChange={onChangeFile}
                            type="file"/>
                    </div>
                    <div className='text-center my-3'>
                        <Button 
                            onClick={onUpdate}
                            className='px-5'>정보저장</Button>
                    </div>
                </Form>
            </Col>
        </Row>
    )
}
export default MyPage