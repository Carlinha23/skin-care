import React from 'react';
//import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { UserProvider } from './UserContext'; 
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import Profile from './Profile';
import NavBar from './Navigation';
import Review from './Review';


function App() {
    return (
      
      <UserProvider>
        <BrowserRouter> {/* Wrap entire app with BrowserRouter */}
          <NavBar />
          <Switch>
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/reviews" component={Review} /> 
            <Route exact path="/" component={Home} />
          </Switch>
        </BrowserRouter>
      </UserProvider>
    );
  }
  
  export default App;
  