import { useState } from 'react'
import Header from './components/Header'
import TodoList from './components/TodoList'
import TodoEditor from './components/TodoEditor'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <Header />
      <TodoEditor />
      <TodoList />
    </div>
  )
}

export default App
