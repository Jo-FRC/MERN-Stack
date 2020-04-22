import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';



// Instead of passing in the props and then later get the props.setAlert we destructore and put it direcly
// the props are available thanks to connect we export connect at the end 
const Register = ({ setAlert }) => {
  // useState hook instead of setting state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  // We need the spread operator to get a copy of the formData object
  // And then we change the name in formData obj with e target value
  // e.target.name is in order to change any key of the obj by calling The "name" attribute in html
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  // destructoring formData so you don't have to do formData.email...
  const { name, email, password, password2 } = formData;

  const onSubmit = async e => {
    e.preventDefault();
    if(password !== password2){
      setAlert('Passwords do not match', 'danger');
    } else {
    console.log('SUCCESS');
    }
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={e => onChange(e)}
            required />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
          This site uses Gravatar so if you want a profile image, use a
          Gravatar email
          </small>
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
        <div className="form-group">
          <input
          type="password"
          placeholder="Confirm Password"
          name="password2"
          minLength="6"
          value={password2}
          onChange={e => onChange(e)}
          />
        </div>
          <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
      Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  )
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired
}

export default connect(null, { setAlert })(Register);
