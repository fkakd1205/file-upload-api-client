import React from 'react';
import {HashRouter, BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './routes/Home'
import Home2 from './routes/Home2';
import ImageFileUploader from './routes/ImageFileUploader';
import ExcelFileUpload from './routes/excel/ExcelFileUpload';
import NaverOrderUpload from './routes/excel/NaverOrderUpload';
import NaverOrderExcelUpload from './routes/excel/NaverOrderExcelUpload';
import './App.css';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home}></Route>
      <Route path="/home2" exact component={Home2}></Route>
      <Route path="/Image-upload" exact component={ImageFileUploader}></Route>
      <Route path="/excel-upload" exact component={ExcelFileUpload}></Route>
      <Route path="/order-excel" exact component={NaverOrderUpload}></Route>
      <Route path="/naver-order" exact component={NaverOrderExcelUpload}></Route>
    </Router>
  );
}

export default App;
