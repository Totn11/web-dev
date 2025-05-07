import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import ResourceList from './components/ResourceList';

function App() {
  return (
    <Router>
      <div>
        <h1>Student Resource Booking System</h1>
        <Switch>
          <Route path="/" exact component={ResourceList} />
          <Route path="/booking" component={BookingPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;