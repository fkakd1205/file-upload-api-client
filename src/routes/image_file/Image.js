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
            opacity: 1;
        }
    }
`;

const ImageBox = styled.div`
   position: relative;
   padding-bottom: 100%; // 1:1
`;

const ImageWrapper = styled.div`
    width: 100%;
`;

const ImageEl = styled.img`
   position: absolute;
   object-fit: cover;
   width: 100%;
   height: 100%;
   transition: .5s;
   border:1px solid #f1f1f1;
   border-radius: 5px;
`;

const Image = (r) => {
    return (
        <>
            <ImageContainer>
                <ImageWrapper>
                    <ImageBox>
                        <ImageEl src={r.image.fileUploadUri} title={r.image.fileName} />
                        {r.index != null &&
                            <ImageInfo>📦상품 이미지 - {r.index + 1}</ImageInfo>
                        }
                    </ImageBox>
                </ImageWrapper>
            </ImageContainer>
        </>
    );
}

export default Image;