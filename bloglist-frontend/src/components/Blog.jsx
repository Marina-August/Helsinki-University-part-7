import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { deleteBlog } from '../reducers/blogReducer'
import { setUser } from '../reducers/userReducer'
import blogService from '../services/blogs'
import { Button } from 'react-bootstrap'

const Blog = ({ blog, updateHandler, user }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [like, setLike] = useState(blog.likes)
  const dispatch = useDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  useEffect (() => {
    blogService
      .getAllComments(blog.id)
      .then(initialComments => {
        setComments(initialComments)
      })
  },[])

  if (!blog) {
    return null
  }

  const addLike = () => {
    let like_ = blog.likes
    const blog_ = { ...blog, likes: ++like_ }
    setLike(blog_.likes)
    updateHandler(blog_)
  }

  const removeBlog = async () => {
    if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
      try {
        dispatch(deleteBlog(blog.id))
      } catch (error) {
        console.error('Error deleting person:', error)
      }
    }
  }

  const addComment = async (event) => {
    event.preventDefault()
    const newComment ={
      text: comment
    }
    const response =await blogService.createComment(newComment, blog.id)
    const comments_ = [...comments, response]
    setComments(comments_)
    setComment('')
  }
  return (
    <div >
      <div className="blog_title">
        {blog.title}
        <div data-testid="author" id="author">
          {blog.author}
        </div>
      </div>
      <div>
        <a href={blog.url}>{blog.url}</a>
        <p id="likes_count">
          {like}{''} likes
          <Button variant="outline-secondary"  className="ml-3" id="like_button" onClick={addLike}>
              like
          </Button>
        </p>
        <p> added by {blog.user.name}</p>
        {user.username === blog.user.username ? (
          <button
            id="remove_button"
            className="remove_button"
            onClick={removeBlog}
          >
              remove
          </button>
        ) : (
          ''
        )}
      </div>
      <h2>comments</h2>
      <form onSubmit={addComment}>
        <input
          type="text"
          value={comment}
          name="Comment"
          placeholder="comment"
          onChange={({ target }) => setComment(target.value)}
        />
        <button>add comment</button>
      </form>
      {comments.map(el => (
        <li key={el.id}>{el.text}</li>
      ))}
    </div>
  )
}


export default Blog
