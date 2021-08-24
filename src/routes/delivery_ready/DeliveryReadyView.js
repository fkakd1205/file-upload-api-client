import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from 'styled-components';

const Container = styled.div`
    font-family: "gowun";
    height: 100vh;
    background-color: rgb(147, 167, 194, 0.3);
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

const DownloadButton = styled.label`
    display: inline-block;
    font-size: 14px;
    padding: 6px;
    color: #555;
    vertical-align: middle;
    background-color: #fdfdfd;
    border-radius: 3px;
    transition: opacity 0.1s linear;
    &:hover {
        opacity: 0.8;
        cursor: pointer;
    }
`;

const DataContainer = styled.div`
    margin: 10px 20px;
    height:90%;
    overflow: hidden;
`;

const BoardContainer = styled.div`
    height: 50%;
    margin-bottom: 10px;
    background-color: #f3f3f3;
    overflow: scroll;
`;

const BoardTitle = styled.div`
    margin: 10px;
    font-size: large;
    color: rgba(000, 102, 153, 0.9);
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

const DeliveryReadyView = (props) => {

    const [unreleasedData, setUnreleasedData] = useState(null);
    const [releasedData, setReleasedData] = useState(null);

    useEffect(() => {
        async function fetchInit() {
            await __handleDataConnect().getDeliveryReadyUnreleasedData();
            await __handleDataConnect().getDeliveryReadyReleasedData();
        }

        fetchInit();
    }, []);

    const __handleDataConnect = () => {
        return {
            getDeliveryReadyUnreleasedData: async function () {
                await axios.get("/api/v1/delivery-ready/view/unreleased")
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            setUnreleasedData(res.data.data);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : getDeliveryReadyUnreleasedData');
                    })
            },
            getDeliveryReadyReleasedData: async function () {
                await axios.get("/api/v1/delivery-ready/view/released")
                    .then(res => {
                        if (res.status == 200 && res.data && res.data.message == 'success') {
                            setReleasedData(res.data.data);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : getDeliveryReadyReleasedData');
                    })
            },
        }
    }

    const __handleEventControl = () => {
        return {
        
        }
    }

    return (
        <>
            <Container>
                <Header>
                    <Form>
                        <DownloadButton onClick={(e) => __handleEventControl().downloadOrder().submit(e)}>발주서 양식 다운로드</DownloadButton>
                    </Form>
                </Header>
                <DataContainer>
                    <BoardContainer>
                        <BoardTitle>미출고 데이터</BoardTitle>
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
                                <span>옵션관리코드</span>
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
                                <span>옵션_code</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>옵션_defalut_name</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>옵션_management_name</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>옵션_stock_unit</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>상품_management_name</span>
                            </ColElement>
                        </DataListTitle>
                        {unreleasedData && unreleasedData.map((data) => {
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
                                        <span>{data.prodName}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>스토어명</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>070-0000-0000</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.optionInfo}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.optionManagementCode}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.unit}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryMessage}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.unitA}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.optionCode}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.optionDefaultName}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.optionManagementName}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.optionStockUnit}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.prodManagementName}</span>
                                    </DataText>
                                </DataList>
                            )
                        })}
                    </BoardContainer>
                    <BoardContainer>
                        <BoardTitle>출고 데이터</BoardTitle>
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
                                <span>옵션관리코드</span>
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
                        </DataListTitle>
                        {releasedData && releasedData.map((data) => {
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
                                        <span>{data.prodName}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>스토어명</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>070-0000-0000</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.optionInfo}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.optionManagementCode}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.unit}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryMessage}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.unitA}</span>
                                    </DataText>
                                </DataList>
                            )
                        })}
                    </BoardContainer>
                </DataContainer>
            </Container>
        </>
    );
}

export default DeliveryReadyView;