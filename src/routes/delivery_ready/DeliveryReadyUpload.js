import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from 'styled-components';

const Container = styled.div`
    /* font-family: "gowun"; */
`;

const Header = styled.div`
    color: white;
    width: 100%;
    height: 55px;
    display: flex;
    border-radius: 5px;
    background-color: rgb(153, 191, 204, 0.9);
    box-shadow: 0px 1px 4px 2px rgba(10, 10, 10, 0.2);
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
    margin-bottom: 2px;
    margin-left:0;
    padding-left:0;
    height: 40px;
`;

const DataText = styled.div`
    font-size: 10px;
    width: 30%;
    background: white;
    overflow: scroll;
    border-right: 1px solid #f5f5f5;
`;

const ColElement = styled.div`
    width: 30%;
`;

const DeliveryReadyUpload = (props) => {

    const [excelData, setExcelData] = useState(null);
    const [formData, setFormData] = useState(new FormData());

    const config = {
        headers: {
            "content-type": "multipart/form-data"
        }
    };

    const __handleDataConnect = () => {
        return {
            uploadExcelFile: async function (e) {

                // νμΌμ μ ννμ§ μμ κ²½μ°
                if(e.target.files.length === 0) return;

                let addFiles = e.target.files;

                for (let i = 0; i < addFiles.length; i++) {
                    formData.append('file', addFiles[i]);
                }

                setFormData(formData);

                await axios.post("/api/v1/delivery-ready/upload", formData, config)
                    .then(res => {
                        console.log(res.data.data);
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            setExcelData(res.data.data);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : uploadExcelFile');
                    })
            },
            storeExcelFile: async function (e) {
                await axios.post("/api/v1/delivery-ready/store", formData, config)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            console.log(formData);
                            props.history.replace('/delivery-ready-view');
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : storeExcelFile');
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
            storeExcelData: function () {
                return {
                    submit: async function (e) {
                        e.preventDefault();
                        await __handleDataConnect().storeExcelFile(e);
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
                        <UploadButton htmlFor="upload-file-input">λ°°μ‘μ€λΉ μμ νμΌ μλ‘λ</UploadButton>
                        <Input id="upload-file-input" type="file" accept=".xls,.xlsx" onClick={(e) => e.target.value=''} onChange={(e) => __handleEventControl().uploadExcelData().submit(e)} />
                    </Form>

                    <Form>
                        <UploadButton onClick={(e) => __handleEventControl().storeExcelData().submit(e)}>λ°°μ‘μ€λΉ μμ νμΌ μ μ₯</UploadButton>
                    </Form>
                </Header>
                <DataContainer className="container">
                    <DataListTitle className="row">
                        <ColElement className="col">
                            <span>μνμ£Όλ¬Έλ²νΈ</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>μ£Όλ¬Έλ²νΈ</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>νλ§€μ±λ</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>κ΅¬λ§€μλͺ</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>κ΅¬λ§€μID</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>μμ·¨μΈλͺ</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>κ²°μ μΌ</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>μνλ²νΈ</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>μνλͺ</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>μ΅μμ λ³΄</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>μ΅μκ΄λ¦¬μ½λ</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>μλ</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>λ°μ£ΌνμΈμΌ</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>λ°μ‘κΈ°ν</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>λ°°μ‘λΉ λ¬Άμλ²νΈ</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>νλ§€μ μνμ½λ</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>νλ§€μ λ΄λΆμ½λ1</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>νλ§€μ λ΄λΆμ½λ2</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>μμ·¨μΈμ°λ½μ²1</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>μμ·¨μΈμ°λ½μ²2</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>λ°°μ‘μ§</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>κ΅¬λ§€μμ°λ½μ²</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>μ°νΈλ²νΈ</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>λ°°μ‘λ©μΈμ§</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>μΆκ³ μ§</span>
                        </ColElement>
                        <ColElement className="col">
                            <span>μ£Όλ¬ΈμΌμ</span>
                        </ColElement>
                    </DataListTitle>
                    {excelData && excelData.map((data) => {
                        return (
                            <DataList
                                key={data.id}
                                className="row"
                            >
                                <DataText className="col">
                                    <span>{data.prodOrderNumber}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.orderNumber}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.salesChannel}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.buyer}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.buyerId}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.receiver}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.paymentDate}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.prodNumber}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.prodName}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.optionInfo}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.optionManageCode}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.unit}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.orderConfirmationDate}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.shipmentDueDate}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.shipmentCostBundleNumber}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.sellerProdCode}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.sellerInnerCode1}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.sellerInnerCode2}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.receiverContact1}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.receiverContact2}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.destination}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.buyerContact}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.zipCode}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.deliveryMessage}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.releaseArea}</span>
                                </DataText>
                                <DataText className="col">
                                    <span>{data.orderDateTime}</span>
                                </DataText>
                            </DataList>
                        )
                    })}
                </DataContainer>
            </Container>
        </>
    );
}

export default DeliveryReadyUpload;