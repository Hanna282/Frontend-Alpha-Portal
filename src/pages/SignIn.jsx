import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import LogotypeLink from '../partials/components/LogotypeLink'

const SignIn = () => {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Invalid email or password - please try again.")
      return
    }

    const result = await signIn(email, password)
    if (!result.success) {
      setError(result.message)
      return
    }

    navigate('/projects')
  }

  return (
    <div className="center-wrapper">
      <div id="signin" >
        <div className="card">
          <div className="card-header">
            <h1>Login</h1>
          </div>
          {error && (
            <div className="error-message">{error}</div>
          )}
          <div className="card-body">
            <form onSubmit={handleSubmit} className="form" method="post" noValidate>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password:</label>
                <input
                  className="form-input"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <button type="submit" className="btn btn-submit">Log In</button>
              </div>
            </form>
            <p className="card-footer">Don’t have an account? <Link to="/auth/signup">Sign Up</Link></p>
          </div>
        </div>
        <div className="logotype-wrapper">
          <LogotypeLink></LogotypeLink>
        </div>
      </div>
    </div>
  )
}

export default SignIn

