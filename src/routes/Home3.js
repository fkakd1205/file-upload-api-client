import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import Image from './Image';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';

const Container = styled.div`
    font-family: "gowun";
`;

const Header = styled.div`
    color: white;
    width: 100%;
    height: 55px;
    display: flex;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0px 1px 7px 4px rgba(0, 0, 2, 0.2);
    text-align: right;
`;

const Form = styled.form`
    width: 100%;
    margin: 10px;
    margin-right: 20px;
`;

const UploadButton = styled.label`
    display: inline-block;
    padding: 6px;
    color: #999;
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

const ImageContainer = styled.ul`
    margin-top: 25px;
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px);
    grid-gap: 50px;
    list-style: none;

    @media only screen and (max-width:1010px){
        grid-gap: 30px;
    }
`;

// const ImageFile = styled.img`
//     width: 100%;
//     height: 200px;
//     background-size: cover;
//     border-radius: 5px;
//     background-position: center center;
//     transition: opacity 0.1s linear;

//     @media only screen and (max-width:1010px){
//         width: 80%;
//         height: 180px;
//     }
// `;

const Item = styled.li`
    margin-bottom: 10px;
    position: relative;
    &:hover {
        opacity: 0.5;
        cursor: pointer;
    }
`;


const Home3 = () => {
    
    const [images, setImages] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [imageInfo, setImageInfo] = useState(null);

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
                            if (images && images.length >= 1) {
                                setImages(images.concat(res.data.data));
                            } else {
                                setImages(res.data.data);
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
                        await __handleDataConnect().uploadFilesToCloud(e);
                    }
                }
            },
            imageInfo: function (e) {
                return {
                    handleOpen: function (e) {
                        setImageInfo(e.target.title);
                        setOpen(true);
                    },
                    handleClose: function () {
                        setOpen(false);
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
                        <UploadButton htmlFor="upload-file-input">상품 이미지 업로드</UploadButton>
                        <Input id="upload-file-input" type="file" accept="image/*" onChange={(e) => __handleEventControl().uploadFileData().submit(e)} multiple />
                    </Form>
                </Header>
                <ImageContainer>
                    {images && images.map((r, index) => {
                        return (
                            <Item key={index} onClick={(e) => __handleEventControl().imageInfo().handleOpen(e)}>
                                {/* <ImageFile src={r.fileUploadUri} title={r.fileName} /> */}
                                <Image image={r} index={index}/>
                            </Item>
                        )
                    })}
                </ImageContainer>
                <Dialog onClose={() => __handleEventControl().imageInfo().handleClose()} aria-labelledby="customized-dialog-title" open={open}>
                    <MuiDialogTitle id="customized-dialog-title" onClose={() => __handleEventControl().imageInfo().handleClose()}>
                         Info
                    </MuiDialogTitle>
                    <MuiDialogContent dividers>
                        {imageInfo}
                    </MuiDialogContent>
                </Dialog>
            </Container>
        </>
    );

}

export default Home3;