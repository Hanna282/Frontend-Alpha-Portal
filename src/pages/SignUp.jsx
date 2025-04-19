import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom';
import LogotypeLink from '../partials/components/LogotypeLink';

const SignUp = () => {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAndConditions: false
  })

  const validateField = (name, value, form) => {
    let error = "";

    switch (name) {
      case "firstName":
        if (!value)
          error = "First name is required.";
        else if (value.length < 2)
          error = "Must be at least 2 characters.";
        break;
      case "lastName":
        if (!value)
          error = "Last name is required.";
        else if (value.length < 2)
          error = "Must be at least 2 characters.";;
        break;
      case "email":
        if (!value)
          error = "Email is required.";
        else if (value.length < 5)
          error = "Must be at least 5 characters.";
        else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value))
          error = "Invalid email.";
        break;
      case "password":
        if (!value)
          error = "Password is required.";
        else if (value.length < 8)
          error = "Must be at least 8 characters.";
        else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])/.test(value))
          error = "Must contain one uppercase and lowecase letter, a number and a special character.";
        break;
      case "confirmPassword":
        if (!value || form.confirmPassword !== form.password)
          error = "Passwords do not match.";
        break;
      case 'termsAndConditions':
        if (!value)
          error = 'You must accept the terms and condition'
        break
      default:
        break;
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }))
  }

  const validateForm = () => {
    const newErrors = {};

    if (!form.firstName)
      newErrors.firstName = "First name is required.";
    else if (form.firstName.length < 2)
      newErrors.firstName = "Must be at least 2 characters.";

    if (!form.lastName)
      newErrors.lastName = "Last name is required.";
    else if (form.lastName.length < 2)
      newErrors.lastName = "Must be at least 2 characters.";

    if (!form.email)
      newErrors.email = "Email is required.";
    else if (form.email.length < 5)
      newErrors.email = "Must be at least 5 characters.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      newErrors.email = "Invalid email format.";

    if (!form.password)
      newErrors.password = "Password is required.";
    else if (form.password.length < 8)
      newErrors.password = "Must be at least 8 characters.";
    else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])/.test(form.password))
      newErrors.password = "Invalid password.";

    if (!form.confirmPassword || form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Passwords do not match.";

    if (!form.termsAndConditions)
      newErrors.termsAndConditions = 'You must accept the terms and condition'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    const updatedForm = { ...form, [name]: newValue }

    setForm(updatedForm)
    validateField(name, newValue, updatedForm)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm())
      return

    const result = await signUp(form)
    if (!result.success) {
      setErrorMessage(result.message);
    } else {
      navigate('/aut/signin')
    }
  }

  return (
    <div id="signup" >
      <div className="card">
        <div className="card-header">
          <h1>Create Account</h1>
        </div>
        <div>{errorMessage && <p className="error-message">{errorMessage}</p>}</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="form" method="post" noValidate>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={`form-input ${errors.firstName ? 'input-validation-error' : ''}`}
                placeholder="Enter your first name"
                required
              />
              {errors.firstName && <span className="field-validation-error">{errors.firstName}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={`form-input ${errors.lastName ? 'input-validation-error' : ''}`}
                placeholder="Enter your last name"
                required
              />
              {errors.lastName && <span className="field-validation-error">{errors.lastName}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'input-validation-error' : ''}`}
                placeholder="Enter your email address"
                required
              />
              {errors.email && <span className="field-validation-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Password:</label>
              <input
                type="password"
                className={`form-input ${errors.password ? 'input-validation-error' : ''}`}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              {errors.password && <span className="field-validation-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className={`form-input ${errors.confirmPassword ? 'input-validation-error' : ''}`}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
              {errors.confirmPassword && <span className="field-validation-error">{errors.confirmPassword}</span>}
            </div>
            <div className="form-checkbox-group">
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  className="form-checkbox-input"
                  name="termsAndConditions"
                  checked={form.termsAndConditions}
                  onChange={handleChange}
                />
                <span className="form-checkbox-box"></span>
              </label>
              <label>I accept <a href="#">Terms and Conditions</a></label>
              <div>
                {errors.termsAndConditions && <span className="field-validation-error">{errors.termsAndConditions}</span>}
              </div>
            </div>
            <div>
              <button type="submit" className="btn btn-submit">Create Account</button>
            </div>
          </form>
          <p className="card-footer">
            Already have an account? <Link to="/auth/signin">Login</Link>
          </p>
        </div>
      </div>
      <div className="logotype-wrapper">
        <LogotypeLink></LogotypeLink>
      </div>
    </div>
  )
}

export default SignUp