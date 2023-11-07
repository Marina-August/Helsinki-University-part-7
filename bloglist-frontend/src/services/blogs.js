import axios from 'axios'
// const baseUrl = '/api/blogs'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (updatedBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.put(
    `${baseUrl}/${updatedBlog.id}`,
    updatedBlog,
    config,
  )
  const response = await request
  return response.data
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.delete(`${baseUrl}/${id}`, config)
  const response = await request
  return response.data
}

const createComment = async (newObject, id) => {
  const config = {
    headers: { Authorization: token },
  }
  console.log(newObject)
  const response = await axios.post(`${baseUrl}/${id}/comments`, newObject, config)
  return response.data
}

const getAllComments = (id) => {
  const request = axios.get(`${baseUrl}/${id}/comments`)
  return request.then((response) => response.data)
}

export default { getAll, create, setToken, update, deleteBlog, createComment, getAllComments }
