import axios from "axios";
import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import moment from 'moment';
import DownloadLoading from "../loading/DownloadLoading";
import DatePicker from "react-datepicker";
import {DateRangePicker, DateRange} from "react-date-range";

import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

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

const DeliveryReadyView = () => {

    const [unReleasedData, setUnReleasedData] = useState(null);
    const [releasedData, setReleasedData] = useState(null);
    const [checkedOrderList, setCheckedOrderList] = useState([]);
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
    // const selectionRange ={
    //         startDate: new Date(),
    //         endDate: new Date(),
    //         key: 'selection',
    //     };

    useEffect(() => {
        async function fetchInit() {
            await __handleDataConnect().getDeliveryReadyUnreleasedData();
            // await __handleDataConnect().getDeliveryReadyReleasedData();
        }
        fetchInit();
    }, []);

    const __handleDataConnect = () => {
        return {
            getDeliveryReadyUnreleasedData: async function () {
                await axios.get("/api/v1/delivery-ready/view/unreleased")
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            setUnReleasedData(res.data.data);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : getDeliveryReadyUnreleasedData');
                    })
            },
            // getDeliveryReadyReleasedData: async function () {
            //     const currentDate = document.getElementById("current-date").value;
            //     await axios.get(`/api/v1/delivery-ready/view/released/${currentDate}`)
            //         .then(res => {
            //             if (res.status == 200 && res.data && res.data.message == 'success') {
            //                 setReleasedData(res.data.data);
            //                 setDownloadOrderList(res.data.data);
            //             }
            //         })
            //         .catch(err => {
            //             console.log(err);
            //             alert('undefined error. : getDeliveryReadyReleasedData');
            //         })
            // },
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

                        // __handleDataConnect().getDeliveryReadyReleasedData();
                        __handleDataConnect().getDeliveryReadyUnreleasedData();
                        __handleDataConnect().getDeliveryReadyRelease();
                        setDownloadLoading(false);
                    })
                    .catch(err => {
                        console.log(err);
                        setDownloadLoading(false);
                    });
            },
            getDeliveryReadyRelease: async function (start, end) {

                var date1 = new Date(start);
                date1.setDate(date1.getDate()+1);
                date1.setHours(0, 0, 0, 0);

                var date2 = new Date(end);
                date2.setDate(date2.getDate()+1)
                date2.setHours(23, 59, 59, 59);
                // date2.setHours(23, 59, 59, 59);
                
                // console.log(date1 + " " + date2);

                date1 = JSON.stringify(date1);
                date2 = JSON.stringify(date2);

                // console.log(date1 + " " + date2);
                
                date1 = date1.substring(1, 11) + " " + date1.substring(12, 20);
                date2 = date2.substring(1, 11) + " " + date2.substring(12, 20);
                
                await axios.get(`/api/v1/delivery-ready/view/release/${date1}&&${date2}`)
                    .then(res => {
                        console.log(res);
                        if (res.status == 200 && res.data && res.data.message == 'success') {
                            setReleasedData(res.data.data);
                            setDownloadOrderList(res.data.data);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : getDeliveryReadyReleased');
                    })

                // await axios.get(`/api/v1/delivery-ready/view/release/${date1}&&${date2}`)
                //     .then(res => {
                //         console.log(res);
                //         if (res.status == 200 && res.data && res.data.message == 'success') {
                //             setReleasedData(res.data.data);
                //             setDownloadOrderList(res.data.data);
                //         }
                //     })
                //     .catch(err => {
                //         console.log(err);
                //         alert('undefined error. : getDeliveryReadyReleased');
                //     })
            }
        }
    }

    const __handleEventControl = () => {
        return {
            downloadOrderFormData: function () {
                return {
                    submit: async function (e) {
                        e.preventDefault();
                        let data = await __handleEventControl().checkedOrderList().getCheckedData();

                        if(data.length || downloadOrderList.length){
                            setDownloadLoading(true);
                            await __handleDataConnect().downloadOrderForm(downloadOrderList.concat(data));
                        }
                        else{
                            alert("no checked order data");
                        }
                    }
                }
            },
            checkedOrderList: function () {
                return {
                    checkAll: function () {
                        if (this.isCheckedAll()) {
                            setCheckedOrderList([]);
                        } else {
                            let checkedList = unReleasedData.map(r => r.deliveryReadyItem.id);
                            setCheckedOrderList(checkedList);
                        }
                    },
                    isCheckedAll: function () {
                        if(unReleasedData){
                            let orderIdList = unReleasedData.map(r => r.deliveryReadyItem.id).sort();
                            checkedOrderList.sort();
                            return JSON.stringify(orderIdList) === JSON.stringify(checkedOrderList);
                        }
                    },
                    isChecked: function (orderId) {
                        return checkedOrderList.includes(orderId);
                    },
                    checkOne: function (e, orderId) {
                        if (e.target.checked) {
                            setCheckedOrderList(checkedOrderList.concat(orderId));
                        } else {
                            setCheckedOrderList(checkedOrderList.filter(r => r !== orderId));
                        }
                    },
                    checkOneLi: function(orderId){
                        if(checkedOrderList.includes(orderId)){
                            setCheckedOrderList(checkedOrderList.filter(r => r !== orderId));
                        }else{
                            setCheckedOrderList(checkedOrderList.concat(orderId));
                        }
                    },
                    getCheckedData: async function () {
                        let dataList = [];

                        if(unReleasedData){
                            unReleasedData.forEach( order => {
                                if (checkedOrderList.includes(order.deliveryReadyItem.id)) {
                                    dataList.push(order);
                                }
                            })
                        }
                        return dataList;
                    }
                }
            },
            changeDatePicker: function () {
                return {
                    changeReleasedData : async function (e) {
                        setCurrentDate(e.target.value);

                        await __handleDataConnect().getDeliveryReadyReleasedData();
                    }
                }
            },
            changeDateRangePicker: function () {
                return {
                    changeReleasedData : async function (date) {
                        setSelectionRange(date.selection);

                        // await __handleDataConnect().getDeliveryReadyReleasedData(date.selection.startDate, date.selection.endDate);
                    }
                    // changeReleasedData : async function (date) {
                    //     setDateRange(date);

                    //     console.log(date);
                        
                    //     await __handleDataConnect().getDeliveryReadyReleasedData(date);
                    // }
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
                        <DataListTitle className="row">
                            <ColElement className="col">
                                <Checkbox
                                    color="primary"
                                    inputProps={{ 'aria-label': '전체 출고 등록' }}
                                    onChange={() => __handleEventControl().checkedOrderList().checkAll()} checked={__handleEventControl().checkedOrderList().isCheckedAll()}
                                />
                                {/* <input type='checkbox' onChange={() => __handleEventControl().checkedOrderList().checkAll()} checked={__handleEventControl().checkedOrderList().isCheckedAll()}></input> */}
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
                                <span>옵션_defalut_name</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>옵션_name</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>옵션_unit</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>상품_name</span>
                            </ColElement>
                        </DataListTitle>
                        {unReleasedData && unReleasedData.map((data, dataIdx) => {
                            return (
                                <DataList
                                    key={dataIdx}
                                    className="row"
                                    onClick={() => __handleEventControl().checkedOrderList().checkOneLi(data.deliveryReadyItem.id)}
                                    checked={__handleEventControl().checkedOrderList().isChecked(data.deliveryReadyItem.id)}
                                >
                                    <DataText className="col">
                                        <Checkbox
                                            color="default"
                                            inputProps={{ 'aria-label': '출고 등록' }}
                                            checked={__handleEventControl().checkedOrderList().isChecked(data.deliveryReadyItem.id)}
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
                        <DateRange
                                editableDateInputs={true}
                                onChange={(date) => __handleEventControl().changeDateRangePicker().changeReleasedData(date)}
                                moveRangeOnFirstSelection={false}
                                local="ko"
                                ranges={[selectionRange]}
                            />
                        <button onClick={() => __handleDataConnect().getDeliveryReadyRelease(selectionRange.startDate, selectionRange.endDate)}>확인</button>
                        <div>
                            <BoardTitle>출고 데이터</BoardTitle>
                            {/* <DatePicker
                                id="date-range" 
                                selectsRange={true}
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => {
                                    __handleEventControl().changeDateRangePicker().changeReleasedData(update)
                                }}
                                withPortal /> */}
                            {/* <input id="current-date" type="date" defaultValue={moment().format("YYYY-MM-DD")} onChange={(e) => __handleEventControl().changeDatePicker().changeReleasedData(e) } value={currentDate}></input> */}
                        </div>
                        <DataListTitle className="row">
                            <ColElement className="col">
                                <span>항목</span>
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
                                <span>옵션_defalut_name</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>옵션_name</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>옵션_unit</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>상품_name</span>
                            </ColElement>
                        </DataListTitle>
                        {releasedData && releasedData.map((data) => {
                            return (
                                <DataList
                                    key={data.id}
                                    className="row"
                                >
                                    <DataText className="col">
                                        <Checkbox disabled checked inputProps={{ 'aria-label': '출고 등록' }} />
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