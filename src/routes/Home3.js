import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { Button } from '@material-ui/core';

const Container = styled.div`
    color: black;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    align-items: center;
    padding: 0px 10px;
    background-color: rgba(96, 125, 139, 0.67);
    box-shadow: 0px 1px 5px 2px rgba(107, 133, 146, 0.8);
`;

const Form = styled.form`
    width: 100%;
    align-items: center;
    margin: 10px;
`;

const Input = styled.input`
    font-size: 20px;
    width: 100%;
    font-family: "gowun";
`;

const ImageFile = styled.img`
    width: 100%;
    border-radius: 2px;
`;

const ImageContainer = styled.ul`
    display: flex;
    :not(:last-child){
        margin-bottom: 50px;
    }
`;

const Item = styled.li`
    text-align: center;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px);
    margin-right: 40px;
    box-shadow: 0px 1px 5px 2px rgba(0, 0, 0, 0.2);
    transition: opacity 0.1s linear;
    &:hover {
        ${ImageFile} {
            opacity: 0.5;
        }
    }
`;


const Home3 = () => {
    
    const [images, setImages] = useState(null);

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

                let addFiles = e.target.files;

                for (let i = 0; i < addFiles.length; i++) {
                    formData.append('files', addFiles[i]);
                }

                await axios.post("/api/v1/file-upload/uploadFilesToCloud", formData, config)
                    .then(res => {
                        if (res.status == 200 && res.data && res.data.message == 'success') {
                            if (images && images.length >= 1) {
                                setImages(images.concat(res.data.data));
                            } else {
                                setImages(res.data.data);
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : uploadFilesToCloud');
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
            }
        }
    }

    return (
        <>
            <Container>
                <Form>
                    <Input id="upload-file-input" type="file" accept="image/*" onChange={(e) => __handleEventControl().uploadFileData().submit(e)} multiple label="upload"/>
                </Form>
                <ImageContainer>
                    {images && images.map((r, index) => {
                        return (
                            <div>
                                <Button color="primary">상품{index+1}</Button>
                                <Item key={index}>
                                    <ImageFile src={r.fileUploadUri} title={r.fileName}/>
                                </Item>
                            </div>
                        )
                    })}
                </ImageContainer>
            </Container>
        </>
    );

}

export default Home3;