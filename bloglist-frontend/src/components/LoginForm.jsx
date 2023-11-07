import { Table, Form, Button } from 'react-bootstrap'

const LoginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleLogin,
}) => {
  return (
    <form onSubmit={handleLogin}>
      <Form.Group>
        <Form.Label>username:</Form.Label>
        <Form.Control
          type="text"
          id="username"
          value={username}
          name="Username"
          onChange={handleUsernameChange}
          className="mb-3"
        />
        <Form.Label>password:</Form.Label>
        <Form.Control
          type="password"
          id="password"
          value={password}
          name="Password"
          onChange={handlePasswordChange}
          className="mb-3"
        />
        <Button variant="outline-secondary"  id="login-button" type="submit">
        login
        </Button>
      </Form.Group>
    </form>
  )
}

export default LoginForm
