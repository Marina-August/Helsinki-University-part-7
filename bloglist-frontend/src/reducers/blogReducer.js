import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import userService from '../services/users'

const initialBlogState = { blogs: [], }
const blogSlice = createSlice({
  name:'blog',
  initialState: initialBlogState,
  reducers: {
    setBlogs(state, action){
      state.blogs = action.payload
    },
    appendBlog(state, action) {
      state.blogs.push(action.payload)
    },
    addlike (state, action) {
      let blogs_ = state.blogs.map(el =>
        el.id !== action.payload.id ? el : action.payload
      )
      const sortedBlogs = [...blogs_].sort((a, b) => b.likes - a.likes)
      state.blogs = [...sortedBlogs]
    },
    deleteB (state, action) {
      let blogs_ = state.blogs.filter((blog) => blog.id !== action.payload)
      blogs_ = blogs_.sort((a, b) => b.likes - a.likes)
      state.blogs = [...blogs_]
    }
  }
})

export const { setBlogs, appendBlog, addlike, deleteB } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
    dispatch(setBlogs(sortedBlogs))
  }
}

export const createBlog = content => {
  return async dispatch => {
    let newBlog = await blogService.create(content)
    const user = await userService.getUserById(newBlog.user)
    newBlog = { ...newBlog, user: user }
    dispatch(appendBlog(newBlog))
  }
}

export const updateBlog = blog => {
  return async dispatch => {
    const updatedBlog = await blogService.update(blog)
    dispatch(addlike(updatedBlog))
  }
}

export const deleteBlog = id => {
  return async dispatch => {
    await blogService.deleteBlog(id)
    dispatch(deleteB(id))
  }
}

export default blogSlice.reducer