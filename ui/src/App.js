import './App.css'
import { useQuery } from '@apollo/client'
import { GET_BUGS } from './graphql.js'

function App({ noBugs = '🚫🐛' }) {
  const { loading, error, data } = useQuery(GET_BUGS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  return (
    <div className="App">
      <header className="App-header">
        <p>Bug tracker</p>
      </header>
      <main>
        <ul>
          {data.bugs.length ? (
            data.bugs.map((bug) => (
              <li key={`bug-${bug.id}`}>
                <h3>{bug.title}</h3>
                <p>{bug.description}</p>
              </li>
            ))
          ) : (
            <li>{noBugs}</li>
          )}
        </ul>
      </main>
    </div>
  )
}

export default App
