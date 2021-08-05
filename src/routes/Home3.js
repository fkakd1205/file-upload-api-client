import axios from "axios";
import React, { useEffect, useState } from "react";

const Home3 = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [imageTitle, setImageTitle] = useState(null);

    useEffect(() => {
        
    }, [])

    const __handleDataConnect = () => {
        return {
            uploadFilesToCloud: async function (e) {
                const formData = new FormData();
                formData.append('files', e.target.files[0]);

                await axios.post("/api/v1/file-upload/uploadFilesToCloud", formData)
                    .then(res => {
                        if (res.status == 200 && res.data && res.data.message == 'success') {
                            setImageSrc(res.data.data[0].fileUploadUri);
                            setImageTitle(res.data.data[0].fileName);

                            console.log(res);
                        }
                    })
                    .catch(err => {
                        alert('undefined error. : uploadFilesToCloud');
                    })
            }
        }
    }

    const __handleEventControl = () => {
        return {
            uploadFileData: function() {
                return {
                    submit: async function (e) {
                        e.preventDefault();
                        console.log("hi");
                        await __handleDataConnect().uploadFilesToCloud(e);
                    }
                }
            }
        }
    }

    // __handleDataConnenct, __handleEventControl 사용x
    // const uploadFilesToCloud = async function (e) {
    //     const formData = new FormData();
    //     formData.append('files', e.target.files[0]);

    //     await axios.post("/api/v1/file-upload/uploadFilesToCloud", formData)
    //             .then(res => {
    //                 if (res.status == 200 && res.data && res.data.message == 'success') {
    //                     setImageSrc(res.data.data[0].fileUploadUri);
    //                     setImageTitle(res.data.data[0].fileName);
    //                 }
    //             })
    //             .catch(err => {
    //                 alert('undefined error. : uploadFilesToCloud');
    //             })
    // }

    return (
        <>
            <div>
                {/* __handleDataConnenct, __handleEventControl 사용x
                 <form>
                    <input id="upload-file-input" type="file" accept="image/*" onChange={(e) => uploadFilesToCloud(e)} multiple />
                    <input type="button" value="확인" />
                </form>
                */}

                <form>
                    <input id="upload-file-input" type="file" accept="image/*" onChange={(e) => __handleEventControl().uploadFileData().submit(e)} multiple />
                    <input type="button" value="확인" />
                </form>
                <div>
                    <img src={imageSrc} title={imageTitle}/>
                </div>
            </div>
        </>
    );

}

export default Home3;