import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Row, Col, Table, Button, Form, InputGroup } from 'react-bootstrap'
import Local from './Local';

const LocalPage = () => {
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('버거킹');
    const [loading, setLoading] = useState(false);
    const [is_end, setIs_end] = useState(false);
    const [locals, setLocals] = useState([]);
    const [total, seTotal] = useState(0);

    const getLocals = async() => {
        const url = "https://dapi.kakao.com/v2/local/search/keyword.json";
        const config = {
            headers: {"Authorization": "KakaoAK b80880fbde422de3fd9b4a4e67c9bb54"},
            params: {"query": query, "size": 5, "page": page}
        }
        const result = await axios.get(url, config);
        setLocals(result.data.documents);
        setIs_end(result.data.meta.is_end);
        seTotal(result.data.meta.pageable_count);
    }

    useEffect(()=>{
        getLocals();
    }, [page]);

    const onSearch = () => {
        setPage(1);
        getLocals();
    }

    if(loading) return <h1 className='text-center my-5'>로딩중......</h1>

    return (
        <Row className='justify-content-center mx-2 my-5'>
            <h1 className='text-center mb-5'>지역검색</h1>
            <Row className='my-2'>
                <Col lg={4} xs={6}>
                        <Form onSubmit={ onSearch }>
                            <InputGroup>
                                <Form.Control value={query} placeholder='검색어'
                                    onChange={(e)=>setQuery(e.target.value)}/>
                                <InputGroup.Text>검색</InputGroup.Text>
                            </InputGroup>
                        </Form>
                </Col>
                <Col>검색수: {total}건</Col>
            </Row>
            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr className='text-center'>
                                <td>장소명</td>
                                <td>주소</td>
                                <td>전화</td>
                                <td width={100}>위치보기</td>
                            </tr>
                        </thead>
                        <tbody>
                           {locals.map(local=>
                                <tr key={local.id} style={{fontSize:'0.8rem'}}>
                                    <td><div className='ellipsis'>{local.place_name}</div></td>
                                    <td><div className='ellipsis'>{local.address_name}</div></td>
                                    <td><div className='ellipsis'></div>{local.phone}</td>
                                    <td className='text-center'><Local local={local}/></td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <div className='text-center my-3'>
                <Button disabled={page === 1 && true}
                    onClick={()=>setPage(page-1)}>이전</Button>
                <span className='mx-2'>{page}</span>
                <Button disabled={is_end}
                    onClick={()=>setPage(page+1)}>다음</Button>
            </div>
        </Row>
    )
}

export default LocalPage