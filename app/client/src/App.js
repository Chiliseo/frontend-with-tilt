import React from 'react';
// import './App.css';
import Header from './Template/Header'
import Footer from './Template/Footer'
import NavigatorPages from './Routes';
import { Provider } from "./Auth";

function App() {
  return (
    <React.Fragment>
      <Provider>
        <Header />
        <NavigatorPages />
        <Footer />
      </Provider>
    </React.Fragment>
  );
}

export default App;
