import { useState, useCallback, useEffect } from 'react'

const Calculator = () => {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForValue, setWaitingForValue] = useState(false)
  const [history, setHistory] = useState([])
  const [memory, setMemory] = useState(0)
  const [scientificMode, setScientificMode] = useState(false)
  const [theme, setTheme] = useState('default')
  const [showHistory, setShowHistory] = useState(true)
  const [showMemory, setShowMemory] = useState(true)
  const [layout, setLayout] = useState('standard') // 'standard' or 'compact'

  // Handle number input
  const inputNumber = useCallback((num) => {
    if (waitingForValue) {
      setDisplay(String(num))
      setWaitingForValue(false)
    } else {
      // Prevent numbers from being too long
      if (display.length < 12) {
        setDisplay(display === '0' ? String(num) : display + num)
      }
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
        case '^':
          result = Math.pow(currentValue, inputValue)
          break
        case '%':
          result = currentValue * (inputValue / 100)
          break
        default:
          return
      }

      // Round to avoid floating point precision issues
      result = Math.round(result * 100000000) / 100000000

      // Add to history
      const calculation = `${currentValue} ${operation} ${inputValue} = ${result}`
      setHistory(prev => [calculation, ...prev.slice(0, 14)]) // Keep last 15 calculations

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
        case '^':
          result = Math.pow(currentValue, inputValue)
          break
        case '%':
          result = currentValue * (inputValue / 100)
          break
        default:
          return
      }

      // Round to avoid floating point precision issues
      result = Math.round(result * 100000000) / 100000000

      // Add to history
      const calculation = `${currentValue} ${operation} ${inputValue} = ${result}`
      setHistory(prev => [calculation, ...prev.slice(0, 14)])

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

  // Memory functions
  const memoryAdd = useCallback(() => {
    const currentValue = parseFloat(display)
    setMemory(prev => prev + currentValue)
  }, [display])

  const memorySubtract = useCallback(() => {
    const currentValue = parseFloat(display)
    setMemory(prev => prev - currentValue)
  }, [display])

  const memoryRecall = useCallback(() => {
    setDisplay(String(memory))
  }, [memory])

  const memoryClear = useCallback(() => {
    setMemory(0)
  }, [])

  // Scientific functions
  const calculateSquare = useCallback(() => {
    const currentValue = parseFloat(display)
    const result = currentValue * currentValue
    setDisplay(String(result))
    setHistory(prev => [`sqr(${currentValue}) = ${result}`, ...prev.slice(0, 14)])
  }, [display])

  const calculateSquareRoot = useCallback(() => {
    const currentValue = parseFloat(display)
    if (currentValue < 0) {
      setDisplay('Error')
      return
    }
    const result = Math.sqrt(currentValue)
    setDisplay(String(result))
    setHistory(prev => [`√(${currentValue}) = ${result}`, ...prev.slice(0, 14)])
  }, [display])

  const calculatePower = useCallback(() => {
    performOperation('^')
  }, [performOperation])

  const calculateSin = useCallback(() => {
    const currentValue = parseFloat(display)
    const result = Math.sin(currentValue * (Math.PI / 180)) // Convert to radians
    setDisplay(String(Math.round(result * 100000000) / 100000000))
    setHistory(prev => [`sin(${currentValue}) = ${result}`, ...prev.slice(0, 14)])
  }, [display])

  const calculateCos = useCallback(() => {
    const currentValue = parseFloat(display)
    const result = Math.cos(currentValue * (Math.PI / 180)) // Convert to radians
    setDisplay(String(Math.round(result * 100000000) / 100000000))
    setHistory(prev => [`cos(${currentValue}) = ${result}`, ...prev.slice(0, 14)])
  }, [display])

  const calculateTan = useCallback(() => {
    const currentValue = parseFloat(display)
    const result = Math.tan(currentValue * (Math.PI / 180)) // Convert to radians
    setDisplay(String(Math.round(result * 100000000) / 100000000))
    setHistory(prev => [`tan(${currentValue}) = ${result}`, ...prev.slice(0, 14)])
  }, [display])

  const calculateLog = useCallback(() => {
    const currentValue = parseFloat(display)
    if (currentValue <= 0) {
      setDisplay('Error')
      return
    }
    const result = Math.log10(currentValue)
    setDisplay(String(Math.round(result * 100000000) / 100000000))
    setHistory(prev => [`log(${currentValue}) = ${result}`, ...prev.slice(0, 14)])
  }, [display])

  const calculateLn = useCallback(() => {
    const currentValue = parseFloat(display)
    if (currentValue <= 0) {
      setDisplay('Error')
      return
    }
    const result = Math.log(currentValue)
    setDisplay(String(Math.round(result * 100000000) / 100000000))
    setHistory(prev => [`ln(${currentValue}) = ${result}`, ...prev.slice(0, 14)])
  }, [display])

  const calculateFactorial = useCallback(() => {
    const currentValue = parseFloat(display)
    if (currentValue < 0 || !Number.isInteger(currentValue)) {
      setDisplay('Error')
      return
    }
    let result = 1
    for (let i = 2; i <= currentValue; i++) {
      result *= i
    }
    setDisplay(String(result))
    setHistory(prev => [`${currentValue}! = ${result}`, ...prev.slice(0, 14)])
  }, [display])

  // Percentage function
  const calculatePercentage = useCallback(() => {
    performOperation('%')
  }, [performOperation])

  // Toggle negative/positive
  const toggleSign = useCallback(() => {
    if (display !== '0' && display !== 'Error') {
      setDisplay(display.startsWith('-') ? display.substring(1) : '-' + display)
    }
  }, [display])

  // Backspace function
  const backspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
    }
  }, [display])

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (/[0-9]/.test(e.key)) {
        inputNumber(parseInt(e.key))
      } else if (e.key === '.') {
        inputDecimal()
      } else if (e.key === '+') {
        performOperation('+')
      } else if (e.key === '-') {
        performOperation('-')
      } else if (e.key === '*') {
        performOperation('*')
      } else if (e.key === '/') {
        performOperation('/')
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault()
        calculate()
      } else if (e.key === 'Escape') {
        clear()
      } else if (e.key === 'Backspace') {
        backspace()
      } else if (e.key === '%') {
        calculatePercentage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [inputNumber, inputDecimal, performOperation, calculate, clear, display, backspace, calculatePercentage])

  // Theme classes
  const getThemeClass = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gradient-to-br from-gray-800 to-gray-900'
      case 'light':
        return 'bg-gradient-to-br from-gray-200 to-gray-300'
      case 'purple':
        return 'bg-gradient-to-br from-purple-700 to-indigo-700'
      default:
        return 'bg-gradient-to-br from-purple-600 to-blue-600'
    }
  }

  const getButtonThemeClass = (type = 'number') => {
    switch (theme) {
      case 'dark':
        return type === 'number' 
          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
          : type === 'operation'
          ? 'bg-blue-700 hover:bg-blue-600 text-white'
          : type === 'scientific'
          ? 'bg-indigo-700 hover:bg-indigo-600 text-white'
          : 'bg-red-700 hover:bg-red-600 text-white'
      case 'light':
        return type === 'number' 
          ? 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200' 
          : type === 'operation'
          ? 'bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-200'
          : type === 'scientific'
          ? 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border border-indigo-200'
          : 'bg-red-100 hover:bg-red-200 text-red-800 border border-red-200'
      case 'purple':
        return type === 'number' 
          ? 'bg-purple-500 hover:bg-purple-400 text-white' 
          : type === 'operation'
          ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
          : type === 'scientific'
          ? 'bg-pink-500 hover:bg-pink-400 text-white'
          : 'bg-red-500 hover:bg-red-400 text-white'
      default:
        return type === 'number' 
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white' 
          : type === 'operation'
          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-cyan-400 hover:to-blue-500 text-white'
          : type === 'scientific'
          ? 'bg-gradient-to-r from-indigo-500 to-purple-400 hover:from-purple-400 hover:to-indigo-500 text-white'
          : 'bg-gradient-to-r from-pink-500 to-orange-400 hover:from-orange-400 hover:to-pink-500 text-white'
    }
  }

  // Dynamic layout classes
  const getLayoutClass = () => {
    return layout === 'compact' 
      ? 'grid-cols-5 gap-2' 
      : scientificMode 
        ? 'grid-cols-6 gap-2' 
        : 'grid-cols-4 gap-3'
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 max-w-7xl mx-auto p-3 lg:p-5 h-full">
      {/* Calculator */}
      <div className={`${getThemeClass()} p-5 lg:p-6 rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl w-full lg:w-auto flex-1 lg:flex-none lg:min-w-[500px]`}>
        {/* Display */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-5 mb-4 lg:mb-5 shadow-inner">
          <div className="text-gray-600 text-sm lg:text-lg min-h-[1.2rem] lg:min-h-[1.5rem] mb-1 lg:mb-2 text-right font-mono">
            {previousValue !== null && operation 
              ? `${previousValue} ${operation}` 
              : ''
            }
          </div>
          <div className="text-gray-800 text-3xl lg:text-5xl font-bold min-h-[3rem] lg:min-h-[4rem] text-right overflow-hidden break-words font-mono">
            {display}
          </div>
          {showMemory && (
            <div className="text-xs lg:text-sm text-gray-500 mt-1 lg:mt-2 flex justify-between">
              <span>Memory: {memory}</span>
              <span className="text-xs">{scientificMode ? 'Scientific Mode' : 'Standard Mode'}</span>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="flex flex-col lg:flex-row justify-between mb-4 gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setScientificMode(!scientificMode)}
              className={`px-3 lg:px-4 py-2 rounded-lg ${getButtonThemeClass('scientific')} font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm`}
            >
              {scientificMode ? 'Standard' : 'Scientific'}
            </button>
            <button
              onClick={() => setLayout(layout === 'standard' ? 'compact' : 'standard')}
              className={`px-3 lg:px-4 py-2 rounded-lg ${getButtonThemeClass()} font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm`}
            >
              {layout === 'standard' ? 'Compact' : 'Standard'}
            </button>
            <button
              onClick={() => setShowMemory(!showMemory)}
              className={`px-3 lg:px-4 py-2 rounded-lg ${getButtonThemeClass()} font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm`}
            >
              {showMemory ? 'Hide Memory' : 'Show Memory'}
            </button>
          </div>
          <div className="flex gap-2 justify-center">
            {['default', 'dark', 'light', 'purple'].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-3 py-1 rounded-lg ${theme === t ? 
                  t === 'light' ? 'bg-gray-300 text-gray-800' : 
                  t === 'dark' ? 'bg-gray-700 text-white' : 
                  t === 'purple' ? 'bg-purple-600 text-white' : 
                  'bg-purple-500 text-white' 
                  : 'bg-gray-200'} font-bold shadow-md transition-all text-xs`}
                title={`${t.charAt(0).toUpperCase() + t.slice(1)} theme`}
              >
                {t.charAt(0).toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        
        {/* Buttons */}
        <div className={`grid ${getLayoutClass()}`}>
          {/* Memory buttons */}
          <button
            onClick={memoryClear}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass()}`}
            title="Memory Clear"
          >
            MC
          </button>
          <button
            onClick={memoryRecall}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass()}`}
            title="Memory Recall"
          >
            MR
          </button>
          <button
            onClick={memoryAdd}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass()}`}
            title="Memory Add"
          >
            M+
          </button>
          <button
            onClick={memorySubtract}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass()}`}
            title="Memory Subtract"
          >
            M-
          </button>
          
          {/* Backspace button in compact mode */}
          {layout === 'compact' && (
            <button
              onClick={backspace}
              className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass('operation')}`}
              title="Backspace"
            >
              ⌫
            </button>
          )}
          
          {/* Row 1 */}
          <button
            onClick={clear}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass()}`}
          >
            AC
          </button>
          <button
            onClick={clearEntry}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass()}`}
          >
            CE
          </button>
          <button
            onClick={clearHistory}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass()}`}
          >
            CH
          </button>
          <button
            onClick={() => performOperation('/')}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass('operation')}`}
          >
            ÷
          </button>
          
          {/* Scientific buttons in compact layout */}
          {layout === 'compact' && scientificMode && (
            <>
              <button
                onClick={calculateSquare}
                className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass('scientific')}`}
                title="Square"
              >
                x²
              </button>
              <button
                onClick={calculateSquareRoot}
                className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass('scientific')}`}
                title="Square Root"
              >
                √
              </button>
            </>
          )}
          
          {/* Row 2 */}
          <button
            onClick={() => inputNumber(7)}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass('number')}`}
          >
            7
          </button>
          <button
            onClick={() => inputNumber(8)}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass('number')}`}
          >
            8
          </button>
          <button
            onClick={() => inputNumber(9)}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass('number')}`}
          >
            9
          </button>
          <button
            onClick={() => performOperation('*')}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass('operation')}`}
          >
            ×
          </button>
          
          {/* More scientific buttons in compact layout */}
          {layout === 'compact' && scientificMode && (
            <>
              <button
                onClick={calculatePower}
                className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass('scientific')}`}
                title="Power"
              >
                x^y
              </button>
              <button
                onClick={calculatePercentage}
                className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass('scientific')}`}
                title="Percentage"
              >
                %
              </button>
            </>
          )}
          
          {/* Row 3 */}
          <button
            onClick={() => inputNumber(4)}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass('number')}`}
          >
            4
          </button>
          <button
            onClick={() => inputNumber(5)}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass('number')}`}
          >
            5
          </button>
          <button
            onClick={() => inputNumber(6)}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass('number')}`}
          >
            6
          </button>
          <button
            onClick={() => performOperation('-')}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass('operation')}`}
          >
            -
          </button>
          
          {/* Row 4 */}
          <button
            onClick={() => inputNumber(1)}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass('number')}`}
          >
            1
          </button>
          <button
            onClick={() => inputNumber(2)}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass('number')}`}
          >
            2
          </button>
          <button
            onClick={() => inputNumber(3)}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass('number')}`}
          >
            3
          </button>
          <button
            onClick={() => performOperation('+')}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass('operation')}`}
          >
            +
          </button>
          
          {/* Row 5 */}
          <button
            onClick={toggleSign}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass('number')}`}
          >
            +/-
          </button>
          <button
            onClick={() => inputNumber(0)}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass('number')}`}
          >
            0
          </button>
          <button
            onClick={inputDecimal}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass('number')}`}
          >
            .
          </button>
          <button
            onClick={calculate}
            className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base ${getButtonThemeClass('operation')}`}
          >
            =
          </button>

          {/* Scientific functions (only show in scientific mode and standard layout) */}
          {scientificMode && layout === 'standard' && (
            <>
              <button
                onClick={calculateSquare}
                className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass('scientific')}`}
                title="Square"
              >
                x²
              </button>
              <button
                onClick={calculateSquareRoot}
                className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass('scientific')}`}
                title="Square Root"
              >
                √
              </button>
              <button
                onClick={calculatePower}
                className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass('scientific')}`}
                title="Power"
              >
                x^y
              </button>
              <button
                onClick={calculatePercentage}
                className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass('scientific')}`}
                title="Percentage"
              >
                %
              </button>
              
              {/* Second row of scientific functions */}
              <button
                onClick={calculateSin}
                className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass('scientific')}`}
                title="Sine"
              >
                sin
              </button>
              <button
                onClick={calculateCos}
                className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass('scientific')}`}
                title="Cosine"
              >
                cos
              </button>
              <button
                onClick={calculateTan}
                className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass('scientific')}`}
                title="Tangent"
              >
                tan
              </button>
              <button
                onClick={() => setDisplay(String(Math.PI))}
                className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass('scientific')}`}
                title="Pi"
              >
                π
              </button>
              
              {/* Third row of scientific functions */}
              <button
                onClick={calculateLog}
                className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass('scientific')}`}
                title="Logarithm base 10"
              >
                log
              </button>
              <button
                onClick={calculateLn}
                className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass('scientific')}`}
                title="Natural logarithm"
              >
                ln
              </button>
              <button
                onClick={calculateFactorial}
                className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass('scientific')}`}
                title="Factorial"
              >
                n!
              </button>
              <button
                onClick={backspace}
                className={`font-bold py-2 lg:py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xs lg:text-sm ${getButtonThemeClass('operation')}`}
                title="Backspace"
              >
                ⌫
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* History Panel */}
      <div className={`${showHistory ? 'flex' : 'hidden'} lg:flex bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-xl lg:shadow-2xl w-full lg:w-80 flex-col`}>
        <div className="flex justify-between items-center mb-3 pb-2 border-b-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">History</h3>
          <div className="flex gap-2">
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="bg-gradient-to-r from-red-400 to-pink-400 hover:from-pink-400 hover:to-red-400 text-white font-bold py-1 px-2 rounded shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 text-xs"
                title="Clear History"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setShowHistory(false)}
              className="lg:hidden bg-gray-200 hover:bg-gray-300 font-bold py-1 px-2 rounded shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {history.length === 0 ? (
            <div className="text-center text-gray-500 italic py-8 text-sm">
              No calculations yet
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((calc, index) => (
                <div
                  key={index}
                  className="bg-gray-50 hover:bg-gray-100 rounded p-3 text-sm text-gray-700 font-mono border-l-4 border-purple-500 hover:translate-x-1 transition-all duration-200 shadow-sm hover:shadow-md"
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