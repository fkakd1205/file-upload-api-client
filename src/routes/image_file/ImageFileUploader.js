import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import BackdropLoading from "../loading/BackdropLoading";
import Image from './Image';
import ImageInfoModal from "./modal/ImageInfoModal";

const Container = styled.div`
    padding-bottom: 100px;
`;

const Header = styled.div`
    background-color: #95a5d3;
    box-shadow: 0px 1px 3px 1px rgb(179 199 219);
`;

const Form = styled.form`
    width: 100%;
    padding: 10px;
`;

const UploadButton = styled.label`
    display: inline-block;
    padding: 6px;
    color: #3D4756;
    padding: 13px 20px;
    background-color: #fdfdfd;
    border-radius: 5px;
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

const BodyContainer = styled.div`
    margin: 10px;
    padding: 10px;
    background-color: #f0f3f9;
    border-radius: 10px;
    min-height: 80vh;
    max-height: 80vh;
    overflow: auto;
`;

const ImageContainer = styled.div`
    margin-top: 25px;
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px);
    grid-gap: 50px;
    list-style: none;
    place-content: center;

    @media only screen and (max-width:1010px){
        grid-gap: 30px;
    }
`;

const Item = styled.div`
    margin-bottom: 10px;
    position: relative;
    &:hover {
        opacity: 0.5;
        cursor: pointer;
    }
`;


const ImageFileUploader = () => {
    const [uploadedImageList, setUploadedImageList] = useState(null);
    const [imageInfoModalOpen, setImageInfoModalOpen] = useState(false);
    const [imageInfo, setImageInfo] = useState(null);
    const [selectedImageData, setSelectedImageData] = useState(null);
    const [backdropLoading, setBackdropLoading] = useState(false);

    useEffect(() => {
    }, [])

    const config = {
        headers: {
            "content-type": "multipart/form-data"
        }
    };

    const __handleDataConnect = () => {
        return {
            uploadFilesToCloud: async function (e) {
                const formData = new FormData();

                // 파일을 선택하지 않은 경우
                if(e.target.files.length === 0) return;

                let addFiles = e.target.files;

                for (let i = 0; i < addFiles.length; i++) {
                    formData.append('files', addFiles[i]);
                }

                await axios.post("/api/v1/file-upload/uploadFilesToCloud", formData, config)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            if (uploadedImageList?.length >= 1) {
                                setUploadedImageList(uploadedImageList.concat(res.data.data));
                            } else {
                                setUploadedImageList(res.data.data);
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : uploadFilesToLocal');
                    })
            }
        }
    }

    const __handleEventControl = () => {
        return {
            uploadFileData: function () {
                return {
                    submit: async function (e) {
                        e.preventDefault();
                    
                        loadingControl().open();
                        await __handleDataConnect().uploadFilesToCloud(e);
                        loadingControl().close();
                    }
                }
            },
            imageInfo: function () {
                return {
                    open: function (e, image) {
                        e.preventDefault();

                        setSelectedImageData(image);
                        setImageInfoModalOpen(true);
                    },
                    close: function () {
                        setImageInfoModalOpen(false);
                    }
                }
            }
        }
    }

    const loadingControl = () => {
        return {
            open : function () {
                setBackdropLoading(true);
            },
            close: function () {
                setBackdropLoading(false);
            }
        }
    }

    return (
        <>
            <Container>
                <Header>
                    <Form>
                        <UploadButton htmlFor="upload-file-input">상품 이미지 업로드</UploadButton>
                        <Input id="upload-file-input" type="file" accept="image/*" onChange={(e) => __handleEventControl().uploadFileData().submit(e)} multiple />
                    </Form>
                </Header>
                <BodyContainer>
                    <ImageContainer>
                        {uploadedImageList?.map((image, index) => {
                            return (
                                <Item key={index} onClick={(e) => __handleEventControl().imageInfo().open(e, image)}>
                                    <Image image={image} index={index} />
                                </Item>
                            )
                        })}
                    </ImageContainer>
                </BodyContainer>
            </Container>

            {imageInfoModalOpen &&
                <ImageInfoModal
                    open={imageInfoModalOpen}
                    onClose={(e) => __handleEventControl().imageInfo().close(e)}
                    selectedImageData={selectedImageData}

                    __handleEventControl={__handleEventControl}
                ></ImageInfoModal>
            }

            {/* Backdrop */}
            <BackdropLoading open={backdropLoading} />
        </>
    );

}

export default ImageFileUploader;