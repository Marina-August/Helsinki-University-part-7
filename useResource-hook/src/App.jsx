import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  const getAll = async () => {
    const response = await axios.get(baseUrl)
    setResources(response.data)
    return response.data
  }

  const create = async(resource) => {
    const getId = () => (100000 * Math.random()).toFixed(0)
    let object = {}
    if(resource.content){
      object = { id:getId(), content:resource.content}
    } else{
      object = { id:getId(), name:resource.name, number:resource.number}
    }
    const response = await axios.post(baseUrl, object)
    return response.data
  }

  const service = {
    create,
    getAll
  }

  return [
    resources, service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')
  const [notes_, setNotes_] = useState(null)
  const [persons_, setPersons_] = useState(null)

  useEffect(()=>{
     noteService.getAll()
     personService.getAll()
  },[])

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
               .then(returnedNotes=>{
                 setNotes_([...notes, returnedNotes ])
               })
   
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
                   .then(returnedPerson=>{
                    setPersons_([...persons, returnedPerson ])
                    })
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes_ ? notes_.map(n => <p key={n.id}>{n.content}</p>) :notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons_? persons_.map(n => <p key={n.id}>{n.name} {n.number}</p>) :persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App