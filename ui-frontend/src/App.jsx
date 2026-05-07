
import './App.css'
import { GoApp } from './services/bridge'

function App() {
  const sayHello = async () => {
    const response = await GoApp.sayHello("edwino")
    console.log(response)
  }

  const getStats = async ()=>{
    const response = await GoApp.getStats()
    console.log(response.arch)
  }
  return (
    <>
      <button onClick={()=>sayHello()}>SayHello</button>
      <button onClick={()=>getStats()}>Get Stats</button>
    </>
  )
}

export default App
