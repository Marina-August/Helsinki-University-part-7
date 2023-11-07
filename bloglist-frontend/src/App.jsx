import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import userService from './services/users'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import { setNotification } from './reducers/notificationReducer.js'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs, createBlog, updateBlog } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import { setAllUsers } from './reducers/userReducer'
import Menu from './components/Menu'
import {
  Routes, Route, Link, useMatch,
  useNavigate
} from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import { Button } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'

const App = () => {
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blog, setBlog] = useState('')
  const notification = useSelector(state => state.notification.message)
  const errorMessage = useSelector(state => state.notification.error)
  const blogs = useSelector(state => state.blog.blogs)
  const user = useSelector(state => state.user.user)
  const users = useSelector(state => state.user.allUsers)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    userService
      .getAll()
      .then(initialUsers => {
        dispatch(setAllUsers(initialUsers))
      })
  },[])

  const usernameHandler = ({ target }) => {
    setUsername(target.value)
  }

  const passwordHandler = ({ target }) => {
    setPassword(target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification({ error: 'Wrong credentials' }))
    }
  }

  const handleNewBlog = async (newBlog) => {
    dispatch(createBlog(newBlog))
    setBlogFormVisible(false)
    dispatch(setNotification({ message: `a new blog ${newBlog.title} by ${newBlog.author} added` }))
  }

  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: blogFormVisible ? '' : 'none' }
    return (
      <div>
        <div style={hideWhenVisible}>
          <Button variant="outline-secondary" id="new_blog"  className="mb-3" onClick={() => setBlogFormVisible(true)}>
            new blog
          </Button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm handleNewBlog={handleNewBlog} />
          <Button variant="outline-secondary"  className="mb-3" onClick={() => setBlogFormVisible(false)}>cancel</Button>
        </div>
      </div>
    )
  }

  const updateHandler = async (blog) => {
    dispatch(updateBlog(blog))
  }

  const match = useMatch('/users/:id')
  const user_ = match
    ? users.find(el => el.id === match.params.id)
    : null

  const matchBlog = useMatch('/:id')
  let blog_ = matchBlog
    ? blogs.find(el => el.id === matchBlog.params.id)
    : null

  return (
    <div className="container">
      {!user && (
        <div>
          <h1>log in to application</h1>
          {errorMessage && <Notification message={errorMessage} error={true} />}
          <LoginForm
            username={username}
            password={password}
            handleLogin={handleLogin}
            handleUsernameChange={usernameHandler}
            handlePasswordChange={passwordHandler}
          />
        </div>
      )}
      {user && (
        <div>
          <Menu/>
          <h2>blogs</h2>
          <Routes>
            <Route  path= "/" element= {
              <div>
                {notification && (
                  <Notification message={notification} error={false} />
                )}
                <h2>create new</h2>
                {blogForm()}
                {blogs.map((blog) => (
                  <div key={blog.id} className='blog_container'>
                    <Link   to={`/${blog.id}`}>
                      {blog.title} {blog.author}
                    </Link>
                  </div>
                ))}
              </div>
            }/>
            <Route path= "/users" element={
              <Users/>
            }/>
            <Route path= "/users/:id" element={
              <User user={user_}/>
            }/>
            <Route path= "/:id" element={
              <div>
                {blog_ && <Blog blog={blog_} updateHandler={updateHandler} user={user}/>}
              </div>
            }/>
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App
