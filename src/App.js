import logo from './logo.svg';
import './App.css';
import { Component } from 'react'
import { HashRouter } from 'react-router-dom';
import QueueComponent from './components/QueueComponent'
import { Provider } from 'react-redux'
import configureStore from './redux/store';
import Main from './components/MainComponent';


class App extends Component {

  render() {
    return (
      <Provider store={configureStore()}>
        <HashRouter>
          <div className="App">
            <Main></Main>
          </div>
        </HashRouter>
      </Provider>
    );
  }
}

export default App;
