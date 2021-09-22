import React from 'react';
import MainComponent from './components/MainComponent';
import Footer from './components/Footer';
import './app.scss';

export const App: React.FC = ():JSX.Element => {
  return (
    <div className='app'>
        <MainComponent/>
        <Footer/>
    </div>
  );
};

export default App;
