// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

/** 
 * Extra credit 2:
  const [name, setName] = React.useState(
    () => window.localStorage.getItem('name') ?? initialName,
  )
 */

// function useLocalStorageState(key, initialValue = '') {
//   const [name, setName] = React.useState(
//     () => window.localStorage.getItem(key) ?? initialValue,
//   )

//   React.useEffect(() => {
//     window.localStorage.setItem(key, name)
//   }, [key, name])

//   return [name, setName]
// }

function useLocalStorageState(key, initialValue = '') {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      try {
        return JSON.parse(valueInLocalStorage)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  const prevKeyRef = React.useRef(key)

  console.log('state', initialValue, state)
  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}

function Greeting({initialValue = ''}) {
  const [name, setName] = useLocalStorageState('name', initialValue)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialValue='James' />
}

export default App
