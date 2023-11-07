import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/users'

const initialUserState = { user:null, allUsers:[] }
const userSlice = createSlice({
  name:'user',
  initialState: initialUserState,
  reducers: {
    setUser (state, action){
      state.user = action.payload
    },
    setAllUsers (state, action){
      state.allUsers = action.payload
    }
  }
})

export const { setUser, setAllUsers } = userSlice.actions

// export const login = ({ username, password }) => {
//   return async dispatch => {
//     const user = await loginService.login({
//       username,
//       password,
//     })
//     window.localStorage.setItem('loggedUser', JSON.stringify(user))
//     dispatch (setUser(user))
//   }
// }

export default userSlice.reducer