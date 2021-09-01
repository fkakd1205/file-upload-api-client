import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import DownloadLoading from "../loading/DownloadLoading";
import {DateRange} from "react-date-range";
import Dialog from '@material-ui/core/Dialog';
import DeleteForeverTwoToneIcon from '@material-ui/icons/DeleteForeverTwoTone';

import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const Container = styled.div`
    /* font-family: "gowun"; */
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
    overflow: scroll;
`;

const BoardContainer = styled.div`
    height: 50%;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #f3f3f3;
    overflow: scroll;
`;

const BoardTitle = styled.div`
    margin: 10px;
    font-size: large;
    color: rgba(000, 102, 153, 0.9);
    display: inline-block;
`;

const DataListTitle = styled.li`
    font-size: 10px;
    text-align: center;
    display: flex;
    margin-bottom: 8px;
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

const DatePickerForm = styled.form`
    display:inline-block;
`;

const DateSelector = styled.button`
    border-radius: 4px;
    background-color: rgb(255, 255, 255);
    box-shadow: 0 1px 2px 0 rgb(35 57 66 / 21%);
    border: 1px solid transparent;
    text-align: center;
    width: 12%;
    height: 4vh;
    &:hover {
        opacity: 0.6;
        cursor: pointer;
    }
`;

const DatePickerButton = styled.div`
    text-align: center;
    padding: 2%;
    background-color: rgb(229, 232, 237);
    &:hover {
        opacity: 0.6;
        cursor: pointer;
    }
`;

const DeleteBtn = styled.div`
    float:right;
    margin-right: 15px;
    &:hover {
        opacity: 0.4;
        cursor: pointer;
    }
`;

const DeliveryReadyView = () => {

    const [unreleasedData, setUnreleasedData] = useState(null);
    const [releasedData, setReleasedData] = useState(null);
    const [unreleaseCheckedOrderList, setUnreleaseCheckedOrderList] = useState([]);
    const [releaseCheckedOrderList, setReleaseCheckedOrderList] = useState([]);
    const [downloadOrderList, setDownloadOrderList] = useState([]);
    const [currentDate, setCurrentDate] = useState(null);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [selectionRange, setSelectionRange] = useState(
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    );
    const [deliveryReadyDateRangePickerModalOpen, setDeliveryReadyDateRangePickerModalOpen] = useState(false);
    const [selectedDateText, setSelectedDateText] = useState("날짜 선택");

    useEffect(() => {
        async function fetchInit() {
            await __handleDataConnect().getDeliveryReadyUnreleasedData();
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
            getDeliveryReadyReleasedData: async function (start, end) {

                var date1 = new Date(start);
                date1.setDate(date1.getDate() + 1);
                date1.setHours(-15, 0, 0, 0);     // start date 00:00:00 설정

                var date2 = new Date(end);
                date2.setDate(date2.getDate() + 1)
                date2.setHours(8, 59, 59, 59);     // end date 23:59:59 설정

                var originEndDate = new Date(end);
                originEndDate.setDate(originEndDate.getDate() + 1);

                date1 = JSON.stringify(date1);
                date2 = JSON.stringify(date2);
                originEndDate = JSON.stringify(originEndDate);

                date1 = date1.substring(1, 11) + " " + date1.substring(12, 20);
                date2 = date2.substring(1, 11) + " " + date2.substring(12, 20);

                await axios.get(`/api/v1/delivery-ready/view/release/${date1}&&${date2}`)
                    .then(res => {
                        console.log(res);
                        if (res.status == 200 && res.data && res.data.message == 'success') {
                            setReleasedData(res.data.data);
                        }
                        setSelectedDateText(date1.substring(1, 11) + " ~ " + originEndDate.substring(1, 11));
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : getDeliveryReadyReleased');
                    })

                    setDeliveryReadyDateRangePickerModalOpen(false);
                },
            downloadOrderForm: async function (data) {
                await axios.post(`/api/v1/delivery-ready/view/download`, data, {
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

                        __handleDataConnect().getDeliveryReadyUnreleasedData();
                        setDownloadLoading(false);
                    })
                    .catch(err => {
                        console.log(err);
                        setDownloadLoading(false);
                    });
            },
            deleteOrderData: async function (itemId) {
                await axios.get(`/api/v1/delivery-ready/view/deleteOne/${itemId}`)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            __handleDataConnect().getDeliveryReadyUnreleasedData();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : deleteOrderData');
                    })
            }
        }
    }

    const __handleEventControl = () => {
        return {
            downloadOrderFormData: function () {
                return {
                    submit: async function (e) {
                        e.preventDefault();
                        let unreleaseData = await __handleEventControl().unreleaseCheckedOrderList().getCheckedData();
                        let releaseData = await __handleEventControl().releaseCheckedOrderList().getCheckedData();

                        let downloadData = downloadOrderList.concat(unreleaseData);
                        downloadData = downloadData.concat(releaseData);

                        if(downloadOrderList.length || downloadData.length){
                            setDownloadLoading(true);
                            await __handleDataConnect().downloadOrderForm(downloadOrderList.concat(downloadData));
                        }
                        else{
                            alert("no checked order data");
                        }
                    },
                    delete: async function (e) {
                        e.preventDefault();

                        if(unreleaseCheckedOrderList.length == 1){
                            await __handleDataConnect().deleteOrderData(unreleaseCheckedOrderList);
                            setUnreleaseCheckedOrderList([]);
                        }
                        else{
                            alert("only on can be deleted")
                        }
                    }
                }
            },
            unreleaseCheckedOrderList: function () {
                return {
                    checkAll: function () {
                        if (this.isCheckedAll()) {
                            setUnreleaseCheckedOrderList([]);
                        } else {
                            let unreleaseCheckedList = unreleasedData.map(r => r.deliveryReadyItem.id);
                            setUnreleaseCheckedOrderList(unreleaseCheckedList);
                        }
                    },
                    isCheckedAll: function () {
                        if(unreleasedData){
                            let unreleaseOrderIdList = unreleasedData.map(r => r.deliveryReadyItem.id).sort();
                            unreleaseCheckedOrderList.sort();
                            return JSON.stringify(unreleaseOrderIdList) === JSON.stringify(unreleaseCheckedOrderList);
                        }
                    },
                    isChecked: function (unreleaseOrderId) {
                        return unreleaseCheckedOrderList.includes(unreleaseOrderId);
                    },
                    checkOne: function (e, unreleaseOrderId) {
                        if (e.target.checked) {
                            setUnreleaseCheckedOrderList(unreleaseCheckedOrderList.concat(unreleaseOrderId));
                        } else {
                            setUnreleaseCheckedOrderList(unreleaseCheckedOrderList.filter(r => r !== unreleaseOrderId));
                        }
                    },
                    checkOneLi: function(unreleaseOrderId){
                        if(unreleaseCheckedOrderList.includes(unreleaseOrderId)){
                            setUnreleaseCheckedOrderList(unreleaseCheckedOrderList.filter(r => r !== unreleaseOrderId));
                        }else{
                            setUnreleaseCheckedOrderList(unreleaseCheckedOrderList.concat(unreleaseOrderId));
                        }
                    },
                    getCheckedData: async function () {
                        let dataList = [];

                        if(unreleasedData){
                            unreleasedData.forEach( order => {
                                if (unreleaseCheckedOrderList.includes(order.deliveryReadyItem.id)) {
                                    dataList.push(order);
                                }
                            })
                        }
                        return dataList;
                    }
                }
            },
            releaseCheckedOrderList: function () {
                return {
                    checkAll: function () {
                        if (this.isCheckedAll()) {
                            setReleaseCheckedOrderList([]);
                        } else {
                            let releaseCheckedList = releasedData.map(r => r.deliveryReadyItem.id);
                            setReleaseCheckedOrderList(releaseCheckedList);
                        }
                    },
                    isCheckedAll: function () {
                        if(releasedData){
                            let releaseOrderIdList = releasedData.map(r => r.deliveryReadyItem.id).sort();
                            releaseCheckedOrderList.sort();
                            return JSON.stringify(releaseOrderIdList) === JSON.stringify(releaseCheckedOrderList);
                        }
                    },
                    isChecked: function (releaseOrderId) {
                        return releaseCheckedOrderList.includes(releaseOrderId);
                    },
                    checkOne: function (e, releaseOrderId) {
                        if (e.target.checked) {
                            setReleaseCheckedOrderList(releaseCheckedOrderList.concat(releaseOrderId));
                        } else {
                            setReleaseCheckedOrderList(releaseCheckedOrderList.filter(r => r !== releaseOrderId));
                        }
                    },
                    checkOneLi: function(releaseOrderId){
                        if(releaseCheckedOrderList.includes(releaseOrderId)){
                            setReleaseCheckedOrderList(releaseCheckedOrderList.filter(r => r !== releaseOrderId));
                        }else{
                            setReleaseCheckedOrderList(releaseCheckedOrderList.concat(releaseOrderId));
                        }
                    },
                    getCheckedData: async function () {
                        let dataList = [];

                        if(releasedData){
                            releasedData.forEach( order => {
                                if (releaseCheckedOrderList.includes(order.deliveryReadyItem.id)) {
                                    dataList.push(order);
                                }
                            })
                        }
                        return dataList;
                    }
                }
            },
            changeDateRangePicker: function () {
                return {
                    changeReleasedData : async function (date) {
                        setSelectionRange(date.selection);
                    }
                }
            }

        }
    }

    return (
        <>
            <DownloadLoading open={downloadLoading} />
            <Container>
                <Header>
                    <Form>
                        <DownloadButton onClick={(e) => __handleEventControl().downloadOrderFormData().submit(e)}>발주서 양식 다운로드</DownloadButton>
                    </Form>
                </Header>
                <DataContainer>
                    <BoardContainer>
                        <BoardTitle>미출고 데이터</BoardTitle>
                        <DeleteBtn onClick={(e) => __handleEventControl().downloadOrderFormData().delete(e)}>
                            <DeleteForeverTwoToneIcon />
                        </DeleteBtn>
                        <DataListTitle className="row">
                            <ColElement className="col">
                                <Checkbox
                                    color="primary"
                                    inputProps={{ 'aria-label': '전체 출고 등록' }}
                                    onChange={() => __handleEventControl().unreleaseCheckedOrderList().checkAll()} checked={__handleEventControl().unreleaseCheckedOrderList().isCheckedAll()}
                                />
                            </ColElement>
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
                                <span>옵션명1</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>옵션명2</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>옵션 수량</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>상품명</span>
                            </ColElement>
                        </DataListTitle>
                        {unreleasedData && unreleasedData.map((data, unreleasedDataIdx) => {
                            return (
                                <DataList
                                    key={unreleasedDataIdx}
                                    className="row"
                                    onClick={() => __handleEventControl().unreleaseCheckedOrderList().checkOneLi(data.deliveryReadyItem.id)}
                                    checked={__handleEventControl().unreleaseCheckedOrderList().isChecked(data.deliveryReadyItem.id)}
                                >
                                    <DataText className="col">
                                        <Checkbox
                                            color="default"
                                            inputProps={{ 'aria-label': '출고 등록' }}
                                            checked={__handleEventControl().unreleaseCheckedOrderList().isChecked(data.deliveryReadyItem.id)}
                                        />
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.orderNumber}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.prodOrderNumber}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.receiver}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.receiverContact1}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.zipCode}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.destination}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span></span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.prodName}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>스토어명</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>070-0000-0000</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.optionInfo}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.optionManagementCode}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.unit}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.deliveryMessage}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.unitA}</span>
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
                        <Dialog open={deliveryReadyDateRangePickerModalOpen} onClose={() => setDeliveryReadyDateRangePickerModalOpen(false)}>            
                           <DateRange
                                editableDateInputs={false}
                                onChange={(date) => __handleEventControl().changeDateRangePicker().changeReleasedData(date)}
                                moveRangeOnFirstSelection={false}
                                local="ko"
                                ranges={[selectionRange]}
                            />
                            <DatePickerButton onClick={() => __handleDataConnect().getDeliveryReadyReleasedData(selectionRange.startDate, selectionRange.endDate)}>확인</DatePickerButton>
                        </Dialog>
                        <div>
                            <BoardTitle>출고 데이터</BoardTitle>
                            <DateSelector id="select-date-text" onClick={() => setDeliveryReadyDateRangePickerModalOpen(true)}>{selectedDateText}</DateSelector>
                        </div>
                        <DataListTitle className="row">
                            <ColElement className="col">
                                <Checkbox
                                    color="primary"
                                    inputProps={{ 'aria-label': '전체 출고 등록' }}
                                    onChange={() => __handleEventControl().releaseCheckedOrderList().checkAll()} checked={__handleEventControl().releaseCheckedOrderList().isCheckedAll()}
                                />
                                {/* <Checkbox disabled checked inputProps={{ 'aria-label': '출고 등록' }} /> */}
                            </ColElement>
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
                                <span>옵션명1</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>옵션명2</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>옵션 수량</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>상품명</span>
                            </ColElement>
                        </DataListTitle>
                        {releasedData && releasedData.map((data, releasedDataIdx) => {
                            return (
                                <DataList
                                    key={releasedDataIdx}
                                    className="row"
                                    onClick={() => __handleEventControl().releaseCheckedOrderList().checkOneLi(data.deliveryReadyItem.id)}
                                    checked={__handleEventControl().releaseCheckedOrderList().isChecked(data.deliveryReadyItem.id)}
                                >
                                    <DataText className="col">
                                        <Checkbox
                                            color="default"
                                            inputProps={{ 'aria-label': '출고 등록' }}
                                            checked={__handleEventControl().releaseCheckedOrderList().isChecked(data.deliveryReadyItem.id)}
                                        />
                                        {/* <Checkbox disabled checked inputProps={{ 'aria-label': '출고 등록' }} /> */}
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.orderNumber}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.prodOrderNumber}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.receiver}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.receiverContact1}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.zipCode}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.destination}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.tranportNumber}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.prodName}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>스토어명</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>070-0000-0000</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.optionInfo}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.optionManagementCode}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.unit}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.deliveryMessage}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.unitA}</span>
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
                </DataContainer>
            </Container>
        </>
    );
}

export default DeliveryReadyView;