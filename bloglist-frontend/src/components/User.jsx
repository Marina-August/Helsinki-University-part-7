
const User = ({ user }) => {
  if (!user) {
    return null
  }
  console.log(user)
  return(
    <div>
      <h1>{user.name}</h1>
      <h2>added blogs</h2>
      {user.blogs.map(el => (
        <li key = {el.id}>{el.title}</li>
      ))}
    </div>
  )
}

export default User