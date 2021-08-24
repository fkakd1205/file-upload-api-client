import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from 'styled-components';

const Container = styled.div`
    font-family: "gowun";
`;

const Header = styled.div`
    color: white;
    width: 100%;
    height: 55px;
    display: flex;
    background-color: rgba(153, 204, 204, 0.9);
    box-shadow: 0px 1px 4px 2px rgba(10, 10, 10, 0.4);
`;

const Form = styled.form`
    margin: 10px;
    margin-right: 20px;
`;

const UploadButton = styled.label`
    display: inline-block;
    padding: 6px;
    color: #999;
    vertical-align: middle;
    background-color: #fdfdfd;
    border-radius: 3px;
    transition: opacity 0.1s linear;
    &:hover {
        opacity: 0.8;
        cursor: pointer;
    }
`;

const Input = styled.input`
    font-size: 20px;
    width: 100%;
    display: none;
`;

const DataContainer = styled.ul`
    margin-top: 25px;
    list-style: none;
    width: 90%;
    left: 0;
`;

const ReceiveLi = styled.li`
    font-size: 20px;
    text-align: center;
    display: flex;
    margin-bottom: 10px;
`;

const DataText = styled.div`
    font-size: 17px;
    width: 30%;
    background: rgba(153, 204, 204, 0.4);
`;

const ColElement = styled.div`
    width: 30%;
`;

const ExcelFileUpload = (props) => {

    const [excelData, setExcelData] = useState(null);

    const config = {
        headers: {
            "content-type": "multipart/form-data"
        }
    };

    const config2 = {
        headers: {
            "content-type": "application/json"
        }
    }

    const __handleDataConnect = () => {
        return {
            uploadExcelFile: async function (e) {
                const formData = new FormData();

                // 파일을 선택하지 않은 경우
                if(e.target.files.length === 0) return;

                let addFiles = e.target.files;

                for (let i = 0; i < addFiles.length; i++) {
                    formData.append('file', addFiles[i]);
                }

                await axios.post("/api/v1/excel/upload", formData, config)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            if (excelData && excelData.length >= 1) {
                                setExcelData(excelData.concat(res.data.data));
                            } else {
                                setExcelData(res.data.data);
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : uploadExcelFile');
                    })
            },
            downloadExcelFile: async function (data) {
                await axios.post(`/api/v1/excel/download`, data, {
                    responseType: 'blob'
                })
                    .then(res => {
                        console.log(res);
                        const url = window.URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `${data.productName}.xlsx`);
                        document.body.appendChild(link);
                        link.click();
                    })
                    .catch(err => {
                        console.log(err)
                    });
            },
            uploadNaverOrderExcelFile: async function (e) {
                const formData = new FormData();

                // 파일을 선택하지 않은 경우
                if(e.target.files.length === 0) return;

                let addFiles = e.target.files;

                for (let i = 0; i < addFiles.length; i++) {
                    formData.append('files', addFiles[i]);
                }

                await axios.post("/api/v1/naver-order/uploadExcelsToCloud", formData, config)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            console.log(res.data.data[0]);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : uploadExcelFile');
                    })
            },
            savedExcelDetailData: async function (data) {
                await axios.post("/api/v1/detail-data/one", data, config2)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {

                            console.log(res);
                        }
                    })
            }
        }
    }

    const __handleEventControl = () => {
        return {
            uploadExcelData: function () {
                return {
                    submit: async function (e) {
                        e.preventDefault();
                        await __handleDataConnect().uploadExcelFile(e);
                    }
                }
            },
            downloadExcelData: function () {
                return {
                    submit: async function (e) {
                        e.preventDefault();
                        let data = excelData;

                        await __handleDataConnect().downloadExcelFile(data);
                    }
                }
            },
            uploadNaverOrderExcelData: function () {
                return{
                    submit: async function (e) {
                        e.preventDefault();
                        await __handleDataConnect().uploadNaverOrderExcelFile(e);
                    }
                }
            }
        }
    }

    return (
        <>
            <Container>
                <Header>
                    <Form>
                        <UploadButton htmlFor="upload-file-input">엑셀 파일 업로드</UploadButton>
                        <Input id="upload-file-input" type="file" accept=".xls,.xlsx" onChange={(e) => __handleEventControl().uploadExcelData().submit(e)} multiple />
                    </Form>
                    <Form>
                        <UploadButton htmlFor="download-file-download">엑셀 파일 다운로드</UploadButton>
                        <Input id="download-file-download" onClick={(e) => __handleEventControl().downloadExcelData().submit(e)} multiple />
                    </Form>
                    <Form>
                        <UploadButton htmlFor="order-upload-file">네이버 배송 준비 엑셀 파일 업로드</UploadButton>
                        <Input id="order-upload-file" type="file" accept=".xls,.xlsx" onChange={(e) => __handleEventControl().uploadNaverOrderExcelData().submit(e)} multiple />
                    </Form>
                </Header>
                <DataContainer className="container">
                    <ReceiveLi className="row">
                        <ColElement className="col">
                            <span>구매자명</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>상품명</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>상품코드</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>배송지</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>구매자 연락처</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>배송 메세지</span>
                        </ColElement>
                    </ReceiveLi>
                    {excelData && excelData.map((data) => {
                        return (
                            <ReceiveLi
                                key={data.id}
                                className="row"
                            >
                                <DataText className="col">
                                    <span>{data.buyer}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.productName}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.productCode}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.destination}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.buyerContact}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.productCode}</span>
                                </DataText>
                            </ReceiveLi>
                        )
                    })}
                </DataContainer>
            </Container>
        </>
    );
}

export default ExcelFileUpload;