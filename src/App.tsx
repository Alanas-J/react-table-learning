import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import PaginatedTable from './components/PaginatedTable'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <PaginatedTable></PaginatedTable>
    </div>
  )
}

export default App
