import React from 'react';
import axios from 'axios';

class Home extends React.Component {

   state = {
      image: null,
      formData: '',
      imageUri: null
   };

   getFiles = async () => {

      await axios.get("/api/v1/test/api-test")
         .then(res => {
            this.setState({
               image: res.data.image
            })
         });
   };

   uploadFile = async (e) => {
      const formData = new FormData();
      
      formData.append('files', e.target.files[0]);
      const res = await axios.post("/api/v1/file-upload/uploadFilesToCloud", formData);
      console.log(res);
      this.getFile(res);
   }

   getFile = ({data}) => {

      this.setState({
         imageUri: data.data.map(img => {
            return img.fileUploadUri;
         })
      });
   }

   componentDidMount() {
      this.getFiles();
   }

   render() {

      return (
         <div>
            Home1
            <div>
               <img src={this.state.image} />
            </div>
            <div>
               <img src={this.state.imageUri} />
            </div>
            <div>
               <form id="upload-file-form" encType="multipart/form-data" method="post">
                  <input id="upload-file-input" type="file" name="uploadfile" accept="image/*" onChange={this.uploadFile} multiple/>
                  <input type="button" value="확인" />
               </form>
            </div>
         </div>
      );
   }
}

export default Home;