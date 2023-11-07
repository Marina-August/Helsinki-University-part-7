import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const BlogForm = ({ handleNewBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const newBlog = {
      title,
      author,
      url,
    }
    handleNewBlog(newBlog)
    setAuthor(''), setTitle('')
    setURL('')
  }

  return (
    <form onSubmit={addBlog}>
      <Form.Group>
        <Form.Label>title:</Form.Label>
        <Form.Control
          type="text"
          id="title"
          value={title}
          name="Title"
          placeholder="title"
          className="mb-3"
          onChange={({ target }) => setTitle(target.value)}
        />
        <Form.Label>author:</Form.Label>
        <Form.Control
          type="text"
          id="author"
          value={author}
          name="Author"
          placeholder="author"
          className="mb-3"
          onChange={({ target }) => setAuthor(target.value)}
        />
        <Form.Label>url:</Form.Label>
        <Form.Control
          type="text"
          id="url"
          value={url}
          name="URL"
          placeholder="url"
          className="mb-3"
          onChange={({ target }) => setURL(target.value)}
        />
        <Button variant="outline-secondary"  className="mb-3" id="create-button" type="submit">
        create
        </Button>
      </Form.Group>
    </form>
  )
}

export default BlogForm
