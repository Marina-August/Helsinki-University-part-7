import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../reducers/userReducer'
import {  Button } from 'react-bootstrap'

const Menu = () => {
  const user = useSelector(state => state.user.user)
  const dispatch = useDispatch()

  const logOutHandler = () => {
    window.localStorage.removeItem('loggedUser')
    dispatch(setUser(null))
  }

  const padding = {
    padding: 5
  }
  return (
    <div className='menu'>
      <Link style={padding} to="/">blogs</Link>
      <Link style={padding} to="/users">users</Link>
      <h3>{user.name} logged in</h3>
      <Button variant="light" id="login-button" type="submit" onClick={logOutHandler}>
        logout
      </Button>
    </div>
  )
}

export default Menu