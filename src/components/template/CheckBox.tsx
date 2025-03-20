import { useState } from 'react';

interface CheckBoxProps {
    label?: string;
    labelPosition?: 'left' | 'right';
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    className?: string;
    disabled?: boolean;
    tamanhoFonte?: string; // xs | md | lg | xl | 2xl | 3xl
}

export default function CheckBox({
    label,
    labelPosition = 'right',
    checked: externalChecked,
    onChange,
    className = '',
    disabled = false,
    tamanhoFonte = "md"
}: CheckBoxProps) {
    const [internalChecked, setInternalChecked] = useState(externalChecked || false);
    
    // Usar o valor controlado externamente se fornecido, caso contrário usar o estado interno
    const isChecked = externalChecked !== undefined ? externalChecked : internalChecked;
    
    const handleChange = () => {
        if (disabled) return;
        
        const newValue = !isChecked;
        
        // Atualizar o estado interno se não for controlado externamente
        if (externalChecked === undefined) {
            setInternalChecked(newValue);
        }
        
        // Chamar o callback de onChange se fornecido
        if (onChange) {
            onChange(newValue);
        }
    };

    // Função para determinar o tamanho da fonte com base no parâmetro tamanhoFonte
    function tamanho() {
        if (tamanhoFonte === "xs") return "text-xs"; // 12px
        if (tamanhoFonte === "lg") return "text-lg"; // 18px
        if (tamanhoFonte === "xl") return "text-xl"; // 20px
        if (tamanhoFonte === "2xl") return "text-2xl"; // 24px
        if (tamanhoFonte === "3xl") return "text-3xl"; // 30px
        return "text-sm"; // 14px (padrão para md)
    }
    
    return (
        <div className={`inline-flex items-center ${className}`}>
            {labelPosition === 'left' && label && (
                <span 
                    className={`mr-2 select-none whitespace-nowrap ${tamanho()} ${disabled ? 'text-gray-400' : 'text-white'}`}
                    onClick={!disabled ? handleChange : undefined}
                >
                    {label}
                </span>
            )}
            
            <div 
                className={`
                    relative w-5 h-5 flex items-center justify-center
                    border rounded 
                    ${isChecked ? 'bg-blue-500 border-blue-600' : 'bg-white border-gray-300'} 
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    transition-colors duration-200
                `}
                onClick={!disabled ? handleChange : undefined}
            >
                {isChecked && (
                    <svg 
                        className="w-3 h-3 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="3" 
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                )}
            </div>
            
            {labelPosition === 'right' && label && (
                <span 
                className={`ml-2 select-none whitespace-nowrap ${tamanho()} ${disabled ? 'text-gray-400' : 'text-white'}`}
                    onClick={!disabled ? handleChange : undefined}
                >
                    {label}
                </span>
            )}
        </div>
    );
}