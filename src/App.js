import React from 'react';
import { HashRouter, BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './routes/Home'
import Home2 from './routes/Home2';
import ImageFileUploader from './routes/ImageFileUploader';
import ExcelFileUpload from './routes/excel/ExcelFileUpload';
import NaverOrderUpload from './routes/excel/NaverOrderUpload';
import NaverOrderExcelUpload from './routes/excel/NaverOrderExcelUpload';
import DeliveryReadyUpload from './routes/delivery_ready/DeliveryReadyUpload';
import './App.css';
import DeliveryReadyView from './routes/delivery_ready/DeliveryReadyView';

import { ThemeProvider } from "@material-ui/core/styles";
import { unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';

const theme = unstable_createMuiStrictModeTheme();

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Route path="/" exact component={Home}></Route>
        <Route path="/home2" exact component={Home2}></Route>
        <Route path="/image-upload" exact component={ImageFileUploader}></Route>
        <Route path="/excel-upload" exact component={ExcelFileUpload}></Route>
        <Route path="/order-excel" exact component={NaverOrderUpload}></Route>
        <Route path="/naver-order" exact component={NaverOrderExcelUpload}></Route>
        <Route path="/delivery-ready" exact component={DeliveryReadyUpload}></Route>
        <Route path="/delivery-ready-view" exact component={DeliveryReadyView}></Route>
      </ThemeProvider>
    </Router>
  );
}

export default App;
