import axios from "axios";
import React, { useEffect, useState } from "react";
import styled, {css} from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import DownloadLoading from "../loading/DownloadLoading";
import { DateRange } from "react-date-range";
import Dialog from '@material-ui/core/Dialog';
import DeleteForeverTwoToneIcon from '@material-ui/icons/DeleteForeverTwoTone';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

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
    background-color: #90a0ad;
    box-shadow: 0px 2px 4px 2px rgba(10, 10, 10, 0.3);
`;

const Form = styled.form`
    margin: 10px;
    margin-right: 20px;
`;

const DownloadButton = styled.button`
    display: inline-block;
    border: 1px solid transparent;
    font-size: 17px;
    padding: 8px;
    color: white;
    vertical-align: middle;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.5);
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

    & .fixed-header {
        position: sticky;
        top: -1px;
        z-index:10;
        background-color: #f3f3f3;
    }
`;

const BoardContainer = styled.div`
    height: 40%;
    margin-bottom: 10px;
    /* padding: 10px; */
    background-color: #f3f3f3;
    overflow: auto;
    border-radius: 5px;
`;

const BoardTitle = styled.div`
    margin: 10px;
    font-size: large;
    color: rgba(000, 102, 153, 0.9);
    display: inline-block;
    width: 100%;
`;

const DataList = styled.li`
    font-size: 10px;
    display: flex;
    text-align: center;
    margin-bottom: 2px;
    height: 40px;
    background-color: white;

    overflow: auto;
    width: 2000px;

    & .delete-btn {
        background-color: rgba(217, 50, 50, 0.2);
    }

    & .cancel-btn {
        background-color: #b0bec5;
    }

    & .large-cell {
        width: 100%;
    }

    & .midium-cell {
        width: 60%;
    }

    & .small-cell {
        width: 15%;
        overflow: hidden;
    }

    & .option-code-btn {
        &:hover {
            opacity: 0.8;
            cursor: pointer;
            background-color: #9bb6d170;
        }
    }

    // 체크 항목 하이라이트
    ${(props) => props.checked ?
        css`
            background-color: #9bb6d130;
        `
        :
        css`
            &:hover{
                background: #9bb6d110;
            }
        `
    }
`;

const DataText = styled.div`
    font-size: 10px;
    width: 20%;
    overflow: auto;
    border-right: 1px solid #f5f5f5;
`;

const ColElement = styled.div`
    width: 20%;
    overflow: hidden;
`;

const DateSelector = styled.button`
    float: right;
    border-radius: 4px;
    background-color: #f3f3f3;
    box-shadow: 0 1px 2px 0 rgb(35 57 66 / 21%);
    border: 1px solid transparent;
    text-align: center;
    width: 230px;
    height: 4vh;
    margin-right: 15px;

    &:hover {
        opacity: 0.6;
        cursor: pointer;
    }
`;

const DatePickerButton = styled.div`
    text-align: center;
    padding: 10px;
    background-color: rgb(229, 232, 237);
    &:hover {
        opacity: 0.6;
        cursor: pointer;
    }
`;
const CheckDataText = styled.span`
    font-size: 13px;
    margin: 0 15px;
`;

const CancelBtn = styled.button`
    width: 10%;
    font-size: 13px;
    border-radius: 3px;
    border: none;
    overflow: auto;
    border-right: 1px solid #f5f5f5;
    background-color: inherit;
`;

const GroupTitle = styled.div`
    font-size: 1.3rem;
    font-weight: 700;
    padding:15px;
    margin-bottom: 10px;

    .closeButton {
        float: right;
        top: -5px;
    }
`;

const OptionLi = styled.li`
    margin-bottom: 6px;
    display: flex;
    border-radius: 10px;

    .form-title {
        background: rgb(147, 167, 194, 0.7);
    }

    .form-control {
        &:hover {
            cursor: pointer;
        }
    } 

    // 체크 항목 하이라이트
    ${(props) => props.checked ?
        css`
            background-color: #9bb6d150;
        `
        :
        css`
            &:hover{
                background: #9bb6d130;
            }
        `
    }
`;

const OptionInfoLi = styled.li`
    display: flex;
    border-radius: 10px;
    margin-bottom: 5px;

    .info-title {
        background: rgb(255, 253, 226);
        font-size: large;
    }
`;

const OptionInfoTitle = styled.div`
    padding: 2px;
    margin-bottom: 15px;
    border-bottom: 2px solid rgb(241, 241, 241);
`;

const NameGroup = styled.div`
    padding: 0 15px;
`;

const ModalText = styled.div`
    overflow: hidden;
    min-height: 30px;
    height: auto;
    font-size: 15px;
    border: 1px solid #ced4da;
    background: rgb(147, 167, 194, 0.2);
    width: 25%;
    padding: 2px;
    text-align: center;
`;

const OptionContainer = styled.div`
`;

const ChangeBtn = styled.button`
    margin: 10px;
`;

const OptionDataList = styled.div`
    height: 50vh;
    overflow: auto;
`;

const DeliveryReadyView = (props) => {

    const [unreleasedData, setUnreleasedData] = useState(null);
    const [releasedData, setReleasedData] = useState(null);
    const [unreleaseCheckedOrderList, setUnreleaseCheckedOrderList] = useState([]);
    const [releaseCheckedOrderList, setReleaseCheckedOrderList] = useState([]);
    const [downloadOrderList, setDownloadOrderList] = useState([]);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [selectionRange, setSelectionRange] = useState(
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    );
    const [deliveryReadyDateRangePickerModalOpen, setDeliveryReadyDateRangePickerModalOpen] = useState(false);
    const [deliveryReadyOptionManagementModalOpen, setDeliveryReadyOptionManagementModalOpen] = useState(false);
    const [selectedDateText, setSelectedDateText] = useState("날짜 선택");
    const [deliveryReadyOptionInfo, setDeliveryReadyOptionInfo] = useState(null);
    const [originOptionInfo, setOriginOptionInfo] = useState(null);
    const [originOptionManagementCode, setOriginOptionManagementCode] = useState(null);
    const [changedOptionManagementCode, setChangedOptionManagementCode] = useState(null);
    
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('sm');

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

                setReleaseCheckedOrderList([]);

                await axios.get(`/api/v1/delivery-ready/view/release/${date1}&&${date2}`)
                    .then(res => {
                        if (res.status == 200 && res.data && res.data.message == 'success') {
                            setReleasedData(res.data.data);
                        }
                        setSelectedDateText(date1.substring(0, 10) + " ~ " + originEndDate.substring(1, 11));
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
            },
            changeToUnreleaseData: async function (itemId) {
                await axios.get(`/api/v1/delivery-ready/view/updateOne/${itemId}`)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            __handleDataConnect().getDeliveryReadyUnreleasedData();
                            __handleDataConnect().getDeliveryReadyReleasedData(selectionRange.startDate, selectionRange.endDate);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : changeToUnreleasedData');
                    })
            },
            getOptionManagementCode: async function () {
                await axios.get(`/api/v1/delivery-ready/view/searchList/productInfo`)
                    .then(res => {
                        if(res.status === 200 && res.data && res.data.message === 'success') {
                            setDeliveryReadyOptionInfo(res.data.data);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : getOptionManagementCode');
                    })
            },
            changeItemOptionManagementCode: async function (itemId, optionCode) {
                await axios.get(`/api/v1/delivery-ready/view/updateOption/${itemId}&&${optionCode}`)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            setDeliveryReadyOptionManagementModalOpen(false);
                            __handleDataConnect().getDeliveryReadyUnreleasedData();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : changeItemOptionManagementCode');
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

                        if (downloadOrderList.length || downloadData.length) {
                            setDownloadLoading(true);
                            await __handleDataConnect().downloadOrderForm(downloadOrderList.concat(downloadData));
                        }
                        else {
                            alert("no checked order data");
                        }
                    },
                    delete: async function (e, itemId) {
                        e.stopPropagation();

                        await __handleDataConnect().deleteOrderData(itemId);
                        setUnreleaseCheckedOrderList([]);
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
                        if (unreleasedData && unreleasedData.length) {
                            let unreleaseOrderIdList = unreleasedData.map(r => r.deliveryReadyItem.id).sort();
                            unreleaseCheckedOrderList.sort();

                            return JSON.stringify(unreleaseOrderIdList) === JSON.stringify(unreleaseCheckedOrderList);
                        } else return false;
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
                    checkOneLi: function (unreleaseOrderId) {
                        if (unreleaseCheckedOrderList.includes(unreleaseOrderId)) {
                            setUnreleaseCheckedOrderList(unreleaseCheckedOrderList.filter(r => r !== unreleaseOrderId));
                        } else {
                            setUnreleaseCheckedOrderList(unreleaseCheckedOrderList.concat(unreleaseOrderId));
                        }
                    },
                    getCheckedData: async function () {
                        let dataList = [];

                        if (unreleasedData) {
                            unreleasedData.forEach(order => {
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
                        } else if (releasedData) {
                            let releaseCheckedList = releasedData.map(r => r.deliveryReadyItem.id);
                            setReleaseCheckedOrderList(releaseCheckedList);
                        }
                    },
                    isCheckedAll: function () {
                        if (releasedData && releasedData.length) {
                            let releaseOrderIdList = releasedData.map(r => r.deliveryReadyItem.id).sort();
                            releaseCheckedOrderList.sort();

                            return JSON.stringify(releaseOrderIdList) === JSON.stringify(releaseCheckedOrderList);
                        } else return false;
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
                    checkOneLi: function (releaseOrderId) {
                        if (releaseCheckedOrderList.includes(releaseOrderId)) {
                            setReleaseCheckedOrderList(releaseCheckedOrderList.filter(r => r !== releaseOrderId));
                        } else {
                            setReleaseCheckedOrderList(releaseCheckedOrderList.concat(releaseOrderId));
                        }
                    },
                    getCheckedData: async function () {
                        let dataList = [];

                        if (releasedData) {
                            releasedData.forEach(order => {
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
                    changeReleasedData: async function (date) {
                        setSelectionRange(date.selection);
                    }
                }
            },
            changeDeliveryReadyItem: function () {
                return {
                    changeToUnreleaseData: async function (e, itemId) {
                        e.stopPropagation();

                        await __handleDataConnect().changeToUnreleaseData(itemId);
                    },
                    changeOptionManagementCode: async function (e, optionInfo) {
                        e.stopPropagation();

                        setChangedOptionManagementCode(null);
                        setDeliveryReadyOptionManagementModalOpen(true);
                        setOriginOptionInfo(optionInfo);
                        setOriginOptionManagementCode(optionInfo.optionManagementCode);

                        await __handleDataConnect().getOptionManagementCode();
                    },
                    changeItemOption: async function () {
                        await __handleDataConnect().changeItemOptionManagementCode(originOptionInfo.id, changedOptionManagementCode);
                    }
                } 
            },
            optionInfoList: function () {
                return {
                    checkOneLi: function (optionCode) {
                        setChangedOptionManagementCode(optionCode);
                    },
                    isChecked: function (optionCode) {
                        return releaseCheckedOrderList.includes(optionCode);
                    }
                }
            }
        }
    }

    return (
        <>
            <Dialog
                open={deliveryReadyOptionManagementModalOpen}
                onClose={() => setDeliveryReadyOptionManagementModalOpen(false)}
                fullWidth={fullWidth}
                maxWidth={maxWidth}
            >
                <OptionContainer>
                    <div style={{ borderBottom: '2px solid #f1f1f1' }}>
                        <GroupTitle>옵션리스트
                            <IconButton aria-label="close" className="closeButton" onClick={() => setDeliveryReadyOptionManagementModalOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </GroupTitle>
                        <NameGroup>
                            <OptionInfoTitle>
                                <OptionInfoLi>
                                    <ModalText className="info-title">
                                        <span>현재</span>
                                    </ModalText>
                                    <ModalText className="info-title">
                                        <span>{originOptionManagementCode}</span>
                                    </ModalText>
                                    <ModalText className="info-title">
                                        <span>변경</span>
                                    </ModalText>
                                    <ModalText className="info-title">
                                        <span>{changedOptionManagementCode}</span>
                                    </ModalText>
                                </OptionInfoLi>
                                <div>
                                    <ChangeBtn 
                                    onClick={() => __handleEventControl().changeDeliveryReadyItem().changeItemOption()}
                                    >
                                        <span>확인</span>
                                    </ChangeBtn>
                                </div>
                            </OptionInfoTitle>
                            <OptionLi className="input-group">
                                <ModalText className="form-title">
                                    <span>옵션관리코드</span>
                                </ModalText>
                                <ModalText className="form-title">
                                    <span>상품명</span>
                                </ModalText>
                                <ModalText className="form-title">
                                    <span>옵션명1</span>
                                </ModalText>
                                <ModalText className="form-title">
                                    <span>옵션명2</span>
                                </ModalText>
                            </OptionLi>
                            <OptionDataList>
                            {deliveryReadyOptionInfo?.map((data) => {
                                return (
                                    <OptionLi 
                                        key={data.id}
                                        className="input-group mb-3"
                                        onClick={() => __handleEventControl().optionInfoList().checkOneLi(data.optionCode)}
                                    >
                                        <ModalText className="form-control">
                                            <span>
                                                {data.optionCode}
                                            </span>
                                        </ModalText>
                                        <ModalText className="form-control">
                                            <span>
                                                {data.prodDefaultName}
                                            </span>
                                        </ModalText>
                                        <ModalText className="form-control">
                                            <span>
                                                {data.optionDefaultName}
                                            </span>
                                        </ModalText>
                                        <ModalText className="form-control">
                                            <span>
                                                {data.optionManagementName}
                                            </span>
                                        </ModalText>
                                    </OptionLi>
                                )
                            })}
                            </OptionDataList>
                        </NameGroup>
                    </div>
                </OptionContainer>
            </Dialog>

            <DownloadLoading open={downloadLoading} />
            <Container>
                <Header>
                    <Form>
                        <DownloadButton onClick={(e) => __handleEventControl().downloadOrderFormData().submit(e)}>발주서 다운</DownloadButton>
                    </Form>
                </Header>
                <DataContainer>
                    <BoardTitle>
                        <span>미출고 데이터</span>
                        <CheckDataText>[✔️ : {unreleaseCheckedOrderList.length} / {unreleasedData ? unreleasedData.length : 0}개]</CheckDataText>
                    </BoardTitle>
                    <BoardContainer>
                        <DataList className="row fixed-header">
                            <ColElement className="col small-cell">
                                <Checkbox
                                    color="primary"
                                    inputProps={{ 'aria-label': '전체 출고 등록' }}
                                    onChange={() => __handleEventControl().unreleaseCheckedOrderList().checkAll()} checked={__handleEventControl().unreleaseCheckedOrderList().isCheckedAll()}
                                />
                            </ColElement>
                            <ColElement className="col midium-cell">
                                <span>주문번호</span>
                            </ColElement>
                            <ColElement className="col midium-cell">
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
                            <ColElement className="col large-cell">
                                <span>주소</span>
                            </ColElement>
                            {/* <ColElement className="col">
                                <span>운송장번호</span>
                            </ColElement> */}
                            <ColElement className="col large-cell">
                                <span>상품명1</span>
                            </ColElement>
                            <ColElement className="col midium-cell">
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
                            {/* <ColElement className="col">
                                <span>수량(A타입)</span>
                            </ColElement> */}
                            <ColElement className="col">
                                <span>*상품명</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>*옵션명1</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>*옵션명2</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>*옵션 수량</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>보내는사람(지정)</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>전화번호1(지정)</span>
                            </ColElement>
                            <CancelBtn className="col">
                                <span></span>
                            </CancelBtn>
                        </DataList>
                        {unreleasedData?.map((data, unreleasedDataIdx) => {
                            return (
                                <DataList
                                    key={unreleasedDataIdx}
                                    className="row"
                                    onClick={() => __handleEventControl().unreleaseCheckedOrderList().checkOneLi(data.deliveryReadyItem.id)}
                                    checked={__handleEventControl().unreleaseCheckedOrderList().isChecked(data.deliveryReadyItem.id)}
                                >
                                    <DataText className="col small-cell">
                                        <Checkbox
                                            color="default"
                                            inputProps={{ 'aria-label': '출고 등록' }}
                                            checked={__handleEventControl().unreleaseCheckedOrderList().isChecked(data.deliveryReadyItem.id)}
                                        />
                                    </DataText>
                                    <DataText className="col midium-cell">
                                        <span>{data.deliveryReadyItem.orderNumber}</span>
                                    </DataText>
                                    <DataText className="col midium-cell">
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
                                    <DataText className="col large-cell">
                                        <span>{data.deliveryReadyItem.destination}</span>
                                    </DataText>
                                    {/* <DataText className="col">
                                        <span></span>
                                    </DataText> */}
                                    <DataText className="col large-cell">
                                        <span>{data.deliveryReadyItem.prodName}</span>
                                    </DataText>
                                    <DataText className="col midium-cell">
                                        <span>{data.deliveryReadyItem.optionInfo}</span>
                                    </DataText>
                                    <DataText className="col option-code-btn" onClick={(e) => __handleEventControl().changeDeliveryReadyItem().changeOptionManagementCode(e, data.deliveryReadyItem)}>
                                        <span>{data.deliveryReadyItem.optionManagementCode}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.unit}</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>{data.deliveryReadyItem.deliveryMessage}</span>
                                    </DataText>
                                    {/* <DataText className="col">
                                        <span>{data.deliveryReadyItem.unitA}</span>
                                    </DataText> */}
                                    <DataText className="col">
                                        <span>{data.prodManagementName}</span>
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
                                        <span>스토어명</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>070-0000-0000</span>
                                    </DataText>
                                    <CancelBtn className="col delete-btn" onClick={(e) => __handleEventControl().downloadOrderFormData().delete(e, data.deliveryReadyItem.id)}>
                                        <DeleteForeverTwoToneIcon />
                                    </CancelBtn>
                                </DataList>
                            )
                        })}
                    </BoardContainer>

                    <BoardTitle>
                        <span>출고 데이터</span>
                        <CheckDataText>[✔️ : {releaseCheckedOrderList.length} / {releasedData ? releasedData.length : 0}개]</CheckDataText>
                        <DateSelector onClick={() => setDeliveryReadyDateRangePickerModalOpen(true)}>🗓 {selectedDateText}</DateSelector>
                    </BoardTitle>
                    <BoardContainer>
                        <Dialog
                            open={deliveryReadyDateRangePickerModalOpen}
                            onClose={() => setDeliveryReadyDateRangePickerModalOpen(false)}
                        >
                            <DateRange
                                editableDateInputs={false}
                                onChange={(date) => __handleEventControl().changeDateRangePicker().changeReleasedData(date)}
                                moveRangeOnFirstSelection={false}
                                local="ko"
                                ranges={[selectionRange]}
                            />
                            <DatePickerButton onClick={() => __handleDataConnect().getDeliveryReadyReleasedData(selectionRange.startDate, selectionRange.endDate)}>확인</DatePickerButton>
                        </Dialog>

                        <DataList className="row fixed-header">
                            <ColElement className="col small-cell">
                                <Checkbox
                                    color="primary"
                                    inputProps={{ 'aria-label': '전체 출고 등록' }}
                                    onChange={() => __handleEventControl().releaseCheckedOrderList().checkAll()} checked={__handleEventControl().releaseCheckedOrderList().isCheckedAll()}
                                />
                                {/* <Checkbox disabled checked inputProps={{ 'aria-label': '출고 등록' }} /> */}
                            </ColElement>
                            <ColElement className="col midium-cell">
                                <span>주문번호</span>
                            </ColElement>
                            <ColElement className="col midium-cell">
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
                            <ColElement className="col large-cell">
                                <span>주소</span>
                            </ColElement>
                            {/* <ColElement className="col">
                                <span>운송장번호</span>
                            </ColElement> */}
                            <ColElement className="col large-cell">
                                <span>상품명1</span>
                            </ColElement>
                            <ColElement className="col midium-cell">
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
                            {/* <ColElement className="col">
                                <span>수량(A타입)</span>
                            </ColElement> */}
                            <ColElement className="col">
                                <span>*상품명</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>*옵션명1</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>*옵션명2</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>*옵션 수량</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>보내는사람(지정)</span>
                            </ColElement>
                            <ColElement className="col">
                                <span>전화번호1(지정)</span>
                            </ColElement>
                            <CancelBtn className="col">
                                <span></span>
                            </CancelBtn>
                        </DataList>
                        {releasedData && releasedData.map((data, releasedDataIdx) => {
                            return (
                                <DataList
                                    key={releasedDataIdx}
                                    className="row"
                                    onClick={() => __handleEventControl().releaseCheckedOrderList().checkOneLi(data.deliveryReadyItem.id)}
                                    checked={__handleEventControl().releaseCheckedOrderList().isChecked(data.deliveryReadyItem.id)}
                                >
                                    <DataText className="col small-cell">
                                        <Checkbox
                                            color="default"
                                            inputProps={{ 'aria-label': '출고 등록' }}
                                            checked={__handleEventControl().releaseCheckedOrderList().isChecked(data.deliveryReadyItem.id)}
                                        />
                                        {/* <Checkbox disabled checked inputProps={{ 'aria-label': '출고 등록' }} /> */}
                                    </DataText>
                                    <DataText className="col midium-cell">
                                        <span>{data.deliveryReadyItem.orderNumber}</span>
                                    </DataText>
                                    <DataText className="col midium-cell">
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
                                    <DataText className="col large-cell">
                                        <span>{data.deliveryReadyItem.destination}</span>
                                    </DataText>
                                    {/* <DataText className="col">
                                        <span>{data.deliveryReadyItem.tranportNumber}</span>
                                    </DataText> */}
                                    <DataText className="col large-cell">
                                        <span>{data.deliveryReadyItem.prodName}</span>
                                    </DataText>
                                    <DataText className="col midium-cell">
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
                                    {/* <DataText className="col">
                                        <span>{data.deliveryReadyItem.unitA}</span>
                                    </DataText> */}
                                    <DataText className="col">
                                        <span>{data.prodManagementName}</span>
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
                                        <span>스토어명</span>
                                    </DataText>
                                    <DataText className="col">
                                        <span>070-0000-0000</span>
                                    </DataText>
                                    <CancelBtn className="col cancel-btn" onClick={(e) => __handleEventControl().changeDeliveryReadyItem().changeToUnreleaseData(e, data.deliveryReadyItem.id)}>
                                        취소
                                    </CancelBtn>
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