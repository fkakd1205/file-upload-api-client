import React from 'react';
import {HashRouter, BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './routes/Home'
import Home2 from './routes/Home2';
import Home3 from './routes/Home3';
import './App.css';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home}></Route>
      <Route path="/home2" exact component={Home2}></Route>
      <Route path="/home3" exact component={Home3}></Route>
    </Router>
  );
}

export default App;
