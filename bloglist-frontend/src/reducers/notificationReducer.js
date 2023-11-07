import { createSlice } from '@reduxjs/toolkit'

const initialnotificationState = { message: '', error:'' }
const notificationSlice = createSlice({
  name:'notification',
  initialState: initialnotificationState,
  reducers: {
    removeNotification (state){
      state.message = ''
    },
    setBlogNotification (state, action){
      state.message = action.payload
    },
    removeError (state){
      state.error = ''
    },
    setError (state, action){
      state.error = action.payload
    },
  }
})

export const { setBlogNotification, removeNotification, removeError, setError } = notificationSlice.actions

export const setNotification = ({ message, error }) => {
  if(message){
    return  dispatch => {
      dispatch(setBlogNotification(message))
      setTimeout(() => {
        dispatch(removeNotification())
      }, 5000)
    }
  } else {
    return  dispatch => {
      dispatch(setError(error))
      setTimeout(() => {
        dispatch(removeError())
      }, 5000)
    }
  }
}



export default notificationSlice.reducer