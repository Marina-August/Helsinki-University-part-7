import axios from 'axios'

const baseUrl = 'http://localhost:3003/api/users'

const getUserById = async(id) => {
  console.log('id', id)
  console.log(`${baseUrl}/${id}`)
  const response = await axios.get(`${baseUrl}/${id}`)
  console.log(response)
  return response.data
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

export default { getUserById, getAll }
