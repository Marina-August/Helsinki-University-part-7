import React from 'react'
import '@testing-library/jest-dom'
import {
  fireEvent,
  render,
  screen,
  act,
  waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let component
const blog = {
  title: 'Title',
  author: 'Author',
  url: 'url',
  id: '200',
  likes: 10,
  user: {
    id: '1',
    username: 'Username',
    name: 'Name',
  },
}
const user = {
  token: 'Token',
  username: 'Username',
  name: 'Name',
}

const updateHandler = jest.fn()
const deleteHandler = jest.fn()

beforeEach(() => {
  component = render(
    <Blog
      blog={blog}
      user={user}
      updateHandler={updateHandler}
      deleteHandler={deleteHandler}
    />,
  )
})

test('renders title and author but not URL and likes by default', () => {
  const titleElement = component.getByText('Title')
  const authorElement = component.getByText('Author')
  const urlElement = component.queryByText('url')
  const likesElement = component.queryByText('10')

  expect(titleElement).toBeDefined()
  expect(authorElement).toBeDefined()
  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()
})

test('blog URL and number of likes are shown when the button controlling the shown details has been clicked', async () => {
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  //   const urlElement = component.getByText((content, element) => {
  //     return element.tagName.toLowerCase() === 'a' && element.getAttribute('href') === 'url'
  //   })
  //   const likeComp = screen.getByTestId('like-block')
  //   const likeComponentText = likeComp.textContent
  //   const expectedTextExists = likeComponentText.includes('10')

  const urlElement = component.getByText('url', { exact: false })
  const likesElement = component.getByText('10', { exact: false })

  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()
  //   expect(expectedTextExists).toBe(true)
})


test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
  const user = userEvent.setup()
  const buttonView = screen.getByText('view')
  await user.click(buttonView)

  const buttonLike = screen.getByRole('button', { name: /like/i })
  await user.click(buttonLike)
  await user.click(buttonLike)

  expect(updateHandler.mock.calls).toHaveLength(2)
})
