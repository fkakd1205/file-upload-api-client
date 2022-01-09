import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import Image from "../Image";
import CancelIcon from '@mui/icons-material/Cancel';

const BodyWrapper = styled.div`
`;

const GroupTitle = styled.div`
    padding:15px;
    background-color: #a5acc1;
    color: white;
`;

const DataContainer = styled.div`
    padding: 10px;
`;

const Item = styled.div`
    display: grid;
    grid-template-columns: 30% 70%;
    column-gap: 10px;
    align-items: center;
    justify-items: center;
`;

const InfoGroup = styled.div`
    display: grid;
    grid-template-columns: 100%;
    padding: 10px;
`;

const InfoTitle = styled.div`
    font-size: 1.2rem;
    font-weight: 500;
    width: 100%;
`;

const DataWrapper = styled.div`
    width: 100%;
`;

const InfoData = styled.span`
    overflow: auto;
`;

const CloseBtn = styled.span`
    float: right;

    &:hover{
        transform: scale(1.1);
        cursor: pointer;
    }

    &:active{
        transition: 0s;
        transform: scale(1.05);
    }
`;

const Title = styled.div`
    font-size: 1.3rem;
    font-weight: 600;
    display: inline;
`;

const ImageInfoModal = (props) => {
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('lg');

    return (
        <>  
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={props.open}
                onClose={() => props.__handleEventControl().imageInfo().close()}
            >
                <BodyWrapper>
                    <GroupTitle>
                        <Title>Image Info</Title>
                        <CloseBtn><CancelIcon type="button" sx={{ fontSize: 33 }} onClick={(e) => props.__handleEventControl().imageInfo().close()} /></CloseBtn>
                    </GroupTitle>
                    <DataContainer>
                        <Item>
                            <DataWrapper>
                                <Image image={props.selectedImageData}/>
                            </DataWrapper>
                            <DataWrapper>
                                <InfoGroup>
                                    <InfoTitle>* File Name</InfoTitle>
                                    <InfoData>{props.selectedImageData.fileName}</InfoData>
                                </InfoGroup>
                                <InfoGroup>
                                    <InfoTitle>* File Type</InfoTitle>
                                    <InfoData>{props.selectedImageData.fileType}</InfoData>
                                </InfoGroup>
                                <InfoGroup>
                                    <InfoTitle>* File URI</InfoTitle>
                                    <InfoData>{props.selectedImageData.fileUploadUri}</InfoData>
                                </InfoGroup>
                                <InfoGroup>
                                    <InfoTitle>* File Size</InfoTitle>
                                    <InfoData>{props.selectedImageData.size}</InfoData>
                                </InfoGroup>
                            </DataWrapper>
                        </Item>
                    </DataContainer>
                </BodyWrapper>
            </Dialog>
        </>
    )
}

export default ImageInfoModal;