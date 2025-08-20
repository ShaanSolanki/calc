import { useState, useCallback } from 'react'

const Calculator = () => {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForValue, setWaitingForValue] = useState(false)
  const [history, setHistory] = useState([])

  // Handle number input
  const inputNumber = useCallback((num) => {
    if (waitingForValue) {
      setDisplay(String(num))
      setWaitingForValue(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }, [display, waitingForValue])

  // Handle decimal point
  const inputDecimal = useCallback(() => {
    if (waitingForValue) {
      setDisplay('0.')
      setWaitingForValue(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }, [display, waitingForValue])

  // Clear all
  const clear = useCallback(() => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForValue(false)
  }, [])

  // Clear entry
  const clearEntry = useCallback(() => {
    setDisplay('0')
  }, [])

  // Handle operations
  const performOperation = useCallback((nextOperation) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      let result

      switch (operation) {
        case '+':
          result = currentValue + inputValue
          break
        case '-':
          result = currentValue - inputValue
          break
        case '*':
          result = currentValue * inputValue
          break
        case '/':
          if (inputValue === 0) {
            setDisplay('Error')
            setPreviousValue(null)
            setOperation(null)
            setWaitingForValue(true)
            return
          }
          result = currentValue / inputValue
          break
        default:
          return
      }

      // Add to history
      const calculation = `${currentValue} ${operation} ${inputValue} = ${result}`
      setHistory(prev => [calculation, ...prev.slice(0, 9)]) // Keep last 10 calculations

      setDisplay(String(result))
      setPreviousValue(result)
    }

    setWaitingForValue(true)
    setOperation(nextOperation)
  }, [display, operation, previousValue])

  // Calculate result
  const calculate = useCallback(() => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const currentValue = previousValue
      let result

      switch (operation) {
        case '+':
          result = currentValue + inputValue
          break
        case '-':
          result = currentValue - inputValue
          break
        case '*':
          result = currentValue * inputValue
          break
        case '/':
          if (inputValue === 0) {
            setDisplay('Error')
            setPreviousValue(null)
            setOperation(null)
            setWaitingForValue(true)
            return
          }
          result = currentValue / inputValue
          break
        default:
          return
      }

      // Add to history
      const calculation = `${currentValue} ${operation} ${inputValue} = ${result}`
      setHistory(prev => [calculation, ...prev.slice(0, 9)])

      setDisplay(String(result))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForValue(true)
    }
  }, [display, operation, previousValue])

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
      {/* Calculator */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 rounded-3xl shadow-2xl min-w-[320px]">
        {/* Display */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-inner">
          <div className="text-gray-600 text-lg min-h-[1.5rem] mb-2 text-right">
            {previousValue !== null && operation 
              ? `${previousValue} ${operation}` 
              : ''
            }
          </div>
          <div className="text-gray-800 text-4xl font-bold min-h-[3rem] text-right overflow-hidden break-words">
            {display}
          </div>
        </div>
        
        {/* Buttons */}
        <div className="grid grid-cols-4 gap-4">
          {/* Row 1 */}
          <button
            onClick={clear}
            className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-orange-400 hover:to-pink-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-xl"
          >
            AC
          </button>
          <button
            onClick={clearEntry}
            className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-orange-400 hover:to-pink-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-xl"
          >
            CE
          </button>
          <button
            onClick={clearHistory}
            className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-orange-400 hover:to-pink-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-xl"
          >
            CH
          </button>
          <button
            onClick={() => performOperation('/')}
            className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-xl"
          >
            ÷
          </button>
          
          {/* Row 2 */}
          <button
            onClick={() => inputNumber(7)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-xl"
          >
            7
          </button>
          <button
            onClick={() => inputNumber(8)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-xl"
          >
            8
          </button>
          <button
            onClick={() => inputNumber(9)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-xl"
          >
            9
          </button>
          <button
            onClick={() => performOperation('*')}
            className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-xl"
          >
            ×
          </button>
          
          {/* Row 3 */}
          <button
            onClick={() => inputNumber(4)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-xl"
          >
            4
          </button>
          <button
            onClick={() => inputNumber(5)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-xl"
          >
            5
          </button>
          <button
            onClick={() => inputNumber(6)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-xl"
          >
            6
          </button>
          <button
            onClick={() => performOperation('-')}
            className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-xl"
          >
            -
          </button>
          
          {/* Row 4 */}
          <button
            onClick={() => inputNumber(1)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-xl"
          >
            1
          </button>
          <button
            onClick={() => inputNumber(2)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-xl"
          >
            2
          </button>
          <button
            onClick={() => inputNumber(3)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-xl"
          >
            3
          </button>
          <button
            onClick={() => performOperation('+')}
            className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-xl"
          >
            +
          </button>
          
          {/* Row 5 */}
          <button
            onClick={() => inputNumber(0)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-xl"
          >
            0
          </button>
          <button
            onClick={inputDecimal}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-xl"
          >
            .
          </button>
          <button
            onClick={calculate}
            className="col-span-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-xl"
          >
            =
          </button>
        </div>
      </div>
      
      {/* History Panel */}
      <div className="bg-white rounded-2xl p-6 shadow-2xl min-w-[300px] max-h-[600px] flex flex-col">
        <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800">History</h3>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="bg-gradient-to-r from-red-400 to-pink-400 hover:from-pink-400 hover:to-red-400 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {history.length === 0 ? (
            <div className="text-center text-gray-500 italic py-8">
              No calculations yet
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((calc, index) => (
                <div
                  key={index}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 text-gray-700 font-mono border-l-4 border-purple-500 hover:translate-x-1 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {calc}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Calculator
