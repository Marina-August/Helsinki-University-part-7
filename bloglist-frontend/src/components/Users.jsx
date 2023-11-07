import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Table } from 'react-bootstrap'

const Users =() => {
  const users = useSelector(state => state.user.allUsers)
  const dispatch = useDispatch()

  return(
    <div>
      <Table striped bordered hover>
        <tbody>
          <tr>
            <th>Users</th>
            <th>blogs created</th>
          </tr>
          {users.map(el => (
            <tr key={el.id}>
              <td>
                <Link className='name' to={`/users/${el.id}`}>{el.name}</Link>
              </td>
              <td>
                <p className='quantity'>{el.blogs.length}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Users