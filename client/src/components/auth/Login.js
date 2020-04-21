import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  // useState hook instead of setting state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // We need the spread operator to get a copy of the formData object
  // And then we change the name in formData obj with e target value
  // e.target.name is in order to change any key of the obj by calling The "name" attribute in html
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  // destructoring formData so you don't have to do formData.email...
  const { email, password } = formData;

  const onSubmit = async e => {
    e.preventDefault();
    console.log('SUCCESS');
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
          type="password"
          placeholder="Password"
          name="password"
          minLength="6"
          value={password}
          onChange={e => onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
      Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  )
}

export default Login
