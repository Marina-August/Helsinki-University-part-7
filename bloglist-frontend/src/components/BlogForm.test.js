import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> ', async () => {
  const handleNewBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm handleNewBlog={handleNewBlog} />)

  const inputTitle = screen.getByPlaceholderText('title')
  const inputAuthor = screen.getByPlaceholderText('author')
  const inputUrl = screen.getByPlaceholderText('url')
  const createButton = screen.getByText('create')

  await user.type(inputTitle, 'Blog title')
  await user.type(inputAuthor, 'Blog author')
  await user.type(inputUrl, 'Blog url')
  await user.click(createButton)

  expect(handleNewBlog.mock.calls).toHaveLength(1)
  expect(handleNewBlog.mock.calls[0][0].title).toBe('Blog title')
  expect(handleNewBlog.mock.calls[0][0].author).toBe('Blog author')
  expect(handleNewBlog.mock.calls[0][0].url).toBe('Blog url')
})
