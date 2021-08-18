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
    border-radius: 5px;
    background-color: rgba(000, 102, 153, 0.9);
    box-shadow: 0px 1px 4px 2px rgba(10, 10, 10, 0.4);
`;

const Form = styled.form`
    margin: 10px;
    margin-right: 20px;
`;

const UploadButton = styled.label`
    display: inline-block;
    font-size: 14px;
    padding: 6px;
    color: #666;
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
    padding-top: 15px;
    padding-bottom: 15px;
    vertical-align: middle;
    background-color: rgba(220, 220, 220, 0.5);
    list-style: none;
    margin-top:0;
    margin-left:0;
    padding-left:0;
    left: 0;
`;

const DataListTitle = styled.li`
    font-size: 12px;
    text-align: center;
    display: flex;
    margin-bottom: 5px;
`;

const DataList = styled.li`
    font-size: 10px;
    text-align: center;
    display: flex;
    margin-bottom: 5px;
    margin-left:0;
    padding-left:0;
`;

const DataText = styled.div`
    font-size: 10px;
    width: 30%;
    background: white;
`;

const ColElement = styled.div`
    width: 30%;
`;

const NaverOrderExcelUpload = (props) => {

    const [excelData, setExcelData] = useState(null);

    const config = {
        headers: {
            "content-type": "multipart/form-data"
        }
    };

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

                await axios.post("/api/v1/naver-order/upload", formData, config)
                    .then(res => {
                        console.log(res.data.data);
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
                await axios.post(`/api/v1/naver-order/download`, data, {
                    responseType: 'blob'
                })
                    .then(res => {
                        console.log(res);
                        const url = window.URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `발주서양식.xlsx`);
                        document.body.appendChild(link);
                        link.click();
                    })
                    .catch(err => {
                        console.log(err)
                    });
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
            }
        }
    }

    return (
        <>
            <Container>
                <Header>
                    <Form>
                        <UploadButton htmlFor="upload-file-input">발주서 엑셀 파일 업로드</UploadButton>
                        <Input id="upload-file-input" type="file" accept=".xls,.xlsx" onClick={(e) => e.target.value=''} onChange={(e) => __handleEventControl().uploadExcelData().submit(e)} multiple />
                    </Form>
                    <Form>
                        <UploadButton htmlFor="download-file-input">발주서 엑셀 파일 다운로드</UploadButton>
                        <Input id="download-file-input" onClick={(e) => __handleEventControl().downloadExcelData().submit(e)} multiple />
                    </Form>
                </Header>
                <DataContainer className="container">
                    <DataListTitle className="row">
                        <ColElement className="col">
                            <span>주문번호</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>상품주문번호</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>받는사람</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>전화번호1</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>우편번호</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>주소</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>운송장번호</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>상품명1</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>보내는사람(지정)</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>전화번호1(지정)</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>상품상세1</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>내품수량1</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>배송메시지</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>수량(A타입)</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>총 상품주문번호</span>
                        </ColElement>
                    </DataListTitle>
                    {excelData && excelData.map((data) => {
                        return (
                            <DataList
                                key={data.id}
                                className="row"
                            >
                                <DataText className="col">
                                    <span>{data.orderNumber}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.prodOrderNumber}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.receiver}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.receiverContact1}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.zipCode}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.destination}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.tranportNumber}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.prodName1}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.sender}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.senderContact1}</span>
                                </DataText>
                                <DataText className="col">
                                {data.prodDetailInfos.map((infoData) => {
                                    return(
                                        <>
                                            <span>{infoData.prodDetail1}</span>
                                            <br />
                                        </>
                                    )}
                                )}
                                </DataText>
                                <DataText className="col">
                                {data.prodDetailInfos.map((infoData) => {
                                    return(
                                        <>
                                            <span>{infoData.unit1}</span>
                                            <br />
                                        </>
                                    )}
                                )}
                                </DataText>
                                <DataText className="col">
                                    <span>{data.deliveryMessage}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.unitA}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.prodOrderNumbers}</span>
                                </DataText>
                            </DataList>
                        )
                    })}
                </DataContainer>
            </Container>
        </>
    );
}

export default NaverOrderExcelUpload;