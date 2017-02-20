import React from 'react';
import { Link } from 'react-router'

export default class App extends React.Component {
  render () {
    return (
      <div>
        <h1>It Works!</h1>
        <p>This React project just works including <span className="redBg">module</span> local styles.</p>
        <p>Enjoy!</p>
        <a href='http://localhost:3000/auth/linkedin'>Login with LinkedIn</a>
        <Link to={'/notfound'}>Not Found</Link>
      </div>
    )
  }
}
