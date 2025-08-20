import Calculator from './components/Calculator'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-white text-center mb-8 drop-shadow-lg">
          Interactive Calculator
        </h1>
        <Calculator />
      </div>
    </div>
  )
}

export default App
