import React, { useEffect, useState } from "react";
import styled from 'styled-components';

const ImageInfo = styled.span`
    bottom: 5px;
    left: 10px;
    position: absolute;
    opacity: 0;
    padding: 4px;
    width: 70%;
    border-radius: 5px;
    background-position: center center;
`;

const ImageContainer = styled.div`
    margin-bottom: 5px;
    position: relative;

    &:hover {
        ${ImageInfo} {
            opacity: 0.8;
        }
    }
`;

const ImageFile = styled.img`
    width: 100%;
    height: 200px;
    background-size: cover;
    border-radius: 5px;
    background-position: center center;
    transition: opacity 0.1s linear;

    @media only screen and (max-width:1010px){
        width: 80%;
        height: 180px;
    }
`;

const Image = (r) => {
    return(
        <>
            <ImageContainer>
                <ImageFile src={r.image.fileUploadUri} title={r.image.fileName} />
                <ImageInfo>📦상품 이미지 - {r.index+1}</ImageInfo>
            </ImageContainer>
        </>
    );
}

export default Image;