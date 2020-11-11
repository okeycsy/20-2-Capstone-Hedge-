import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

function App() {
  function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
  }

  const element = <Welcome name="Hedger" />;
  
  ReactDOM.render(
    element,
    document.getElementById('root')
    );
  return 0;
}

export default App;
