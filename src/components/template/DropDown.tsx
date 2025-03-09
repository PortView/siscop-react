import { useState, useEffect, useRef } from "react"

interface DropDownProps {
    label?: string;
    options: { id: string | number; label: string }[];
    placeholder?: string;
    onChange?: (value: string | null) => void;
    largura?: string;
    containerClassName?: string;
    value?: string | null;
}

export default function DropDown({
    label,
    options = [],
    placeholder = "Selecione uma opção",
    onChange,
    largura = "",
    containerClassName = "flex flex-row items-center bg-zinc-600 p-5 mb-1 border border-solid border-red-600 rounded-md w-full",
    value
}: DropDownProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState<string | null>(value || null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredOptions, setFilteredOptions] = useState(options)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Atualizar opções filtradas quando as opções mudarem
    useEffect(() => {
        setFilteredOptions(options)
    }, [options])

    // Fechar dropdown quando clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
                if (!selectedOption) {
                    setSearchTerm("")
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [selectedOption])

    // Filtrar opções quando o termo de busca mudar
    useEffect(() => {
        if (searchTerm) {
            const filtered = options.filter(option =>
                option.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredOptions(filtered)
        } else {
            setFilteredOptions(options)
        }
    }, [searchTerm, options])

    // Focar no input quando o dropdown abrir
    useEffect(() => {
        if (isDropdownOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isDropdownOpen])

    // Atualiza o estado interno quando o valor externo muda
    useEffect(() => {
        if (value !== undefined) {
            setSelectedOption(value)
        }
    }, [value])

    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsDropdownOpen(!isDropdownOpen)
        if (!isDropdownOpen) {
            if (!selectedOption) {
                setSearchTerm("")
            }
            setFilteredOptions(options)
        }
    }

    const handleOptionSelect = (option: { id: string | number; label: string }) => {
        setSelectedOption(option.label)
        setSearchTerm("")
        setIsDropdownOpen(false)
        if (onChange) {
            onChange(option.id.toString())
        }
    }

    const handleClearSelection = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedOption(null)
        setSearchTerm("")
        if (onChange) {
            onChange(null)
        }
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
        if (!isDropdownOpen) {
            setIsDropdownOpen(true)
        }
    }

    const handleInputClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!isDropdownOpen) {
            setIsDropdownOpen(true)
        }
    }

    // Determinar o estilo de largura com base no parâmetro
    const getWidthStyle = (width: string) => {
        if (!width || width === "w-full") {
            return {}
        }

        // Se for uma classe Tailwind, não aplicar estilo inline
        if (width.startsWith('w-')) {
            return {}
        }

        // Caso contrário, aplicar como estilo inline
        return { width }
    }

    return (
        <div>
            <div className={containerClassName}>
                {label && <span className="text-white mr-4 whitespace-nowrap">{label}</span>}

                <div className="relative w-full" ref={dropdownRef}>
                    <div 
                        className={`flex items-center border border-blue-500 rounded-md bg-white ${largura.startsWith('w-') ? largura : ''}`}
                        style={getWidthStyle(largura)}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            className="w-full px-3 py-2 text-gray-700 focus:outline-none rounded-md"
                            placeholder={selectedOption ? "" : placeholder}
                            value={selectedOption || searchTerm}
                            onChange={handleInputChange}
                            onClick={handleInputClick}
                            readOnly={!!selectedOption}
                        />
                        {selectedOption && (
                            <button
                                type="button"
                                className="px-2 text-gray-400 hover:text-gray-600"
                                onClick={handleClearSelection}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        <button
                            type="button"
                            className="px-2 text-gray-400"
                            onClick={toggleDropdown}
                        >
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    {isDropdownOpen && (
                        <div
                            className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
                            style={getWidthStyle(largura)}
                        >
                            <div className="max-h-60 overflow-y-auto">
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((option, index) => (
                                        <div
                                            key={option.id}
                                            onClick={() => handleOptionSelect(option)}
                                            className={`px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer ${selectedOption === option.label ? 'bg-blue-500 text-white' : ''} ${index === 0 ? 'rounded-t-md' : ''} ${index === filteredOptions.length - 1 ? 'rounded-b-md' : ''}`}
                                        >
                                            {option.label}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-sm text-gray-500">Nenhum resultado encontrado</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}