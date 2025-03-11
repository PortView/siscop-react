'use client'
import { useState, useEffect } from 'react'
// Importando os ícones do Tabler
import { IconChevronsLeft, IconChevronLeft, IconChevronRight, IconChevronsRight } from '@tabler/icons-react'

// Interface para as propriedades do componente
interface ReguaDePagProps {
  // Página atual
  paginaAtual?: number;
  // Total de páginas
  totalPaginas?: number;
  // Total de itens
  totalItems?: number;
  // Função para mudar de página
  onChange?: (pagina: number) => void;
  // Flag para indicar se a régua deve ser exibida
  mostrarRegua?: boolean;
}

/**
 * Componente ReguaDePag - Régua de paginação para navegação entre páginas
 * 
 * Este componente exibe uma régua de paginação com 5 elementos:
 * 1. Botão para primeira página
 * 2. Botão para página anterior
 * 3. Input de texto para digitar/mostrar o número da página
 * 4. Botão para próxima página
 * 5. Botão para última página
 * 
 * A régua só é exibida quando o número de itens for maior que 100 (controlado pela prop mostrarRegua)
 * Os botões de primeira e última página são desabilitados quando estiver na primeira ou última página
 */
export default function ReguaDePag({
  paginaAtual = 1,
  totalPaginas = 1,
  totalItems = 0,
  onChange = () => {},
  mostrarRegua
}: ReguaDePagProps) {
  // Estado para controlar o valor do input de página
  const [paginaInput, setPaginaInput] = useState<string>(paginaAtual.toString())

  // Atualiza o input quando a página atual mudar externamente
  useEffect(() => {
    setPaginaInput(paginaAtual.toString())
  }, [paginaAtual])

  // Função para ir para a primeira página
  const irParaPrimeiraPagina = () => {
    if (paginaAtual > 1) {
      onChange(1)
    }
  }

  // Função para ir para a página anterior
  const irParaPaginaAnterior = () => {
    if (paginaAtual > 1) {
      onChange(paginaAtual - 1)
    }
  }

  // Função para ir para a próxima página
  const irParaProximaPagina = () => {
    if (paginaAtual < totalPaginas) {
      onChange(paginaAtual + 1)
    }
  }

  // Função para ir para a última página
  const irParaUltimaPagina = () => {
    if (paginaAtual < totalPaginas) {
      onChange(totalPaginas)
    }
  }

  // Função para lidar com a mudança no input de página
  const handlePaginaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permite apenas números
    const value = e.target.value.replace(/[^0-9]/g, '')
    setPaginaInput(value)
  }

  // Função para lidar com o pressionamento de tecla no input de página
  const handlePaginaInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navegarParaPagina()
    }
  }

  // Função para lidar com o blur do input de página
  const handlePaginaInputBlur = () => {
    navegarParaPagina()
  }

  // Função para navegar para a página digitada no input
  const navegarParaPagina = () => {
    let pagina = parseInt(paginaInput || '1')
    
    // Garante que a página esteja dentro dos limites
    if (isNaN(pagina) || pagina < 1) {
      pagina = 1
    } else if (pagina > totalPaginas) {
      pagina = totalPaginas
    }
    
    // Atualiza o input e navega para a página
    setPaginaInput(pagina.toString())
    onChange(pagina)
  }

  // Se não deve mostrar a régua, retorna null
  if (!mostrarRegua) {
    return null
  }

  return (
    <div className="flex items-center space-x-2 ml-2">
      {/* Botão para primeira página */}
      <button
        onClick={irParaPrimeiraPagina}
        disabled={paginaAtual === 1}
        className={`w-8 h-8 flex items-center justify-center rounded-md ${
          paginaAtual === 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        title="Primeira página"
      >
        {/* Ícone com tamanho aumentado usando classes do Tailwind */}
        <IconChevronsLeft className="w-5 h-5" />
      </button>

      {/* Botão para página anterior */}
      <button
        onClick={irParaPaginaAnterior}
        disabled={paginaAtual === 1}
        className={`w-8 h-8 flex items-center justify-center rounded-md ${
          paginaAtual === 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        title="Página anterior"
      >
        {/* Ícone com tamanho aumentado usando classes do Tailwind */}
        <IconChevronLeft className="w-5 h-5" />
      </button>

      {/* Input para digitar o número da página */}
      <div className="flex items-center">
        <input
          type="text"
          value={paginaInput}
          onChange={handlePaginaInputChange}
          onKeyDown={handlePaginaInputKeyDown}
          onBlur={handlePaginaInputBlur}
          className="w-12 h-8 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          title="Página atual"
        />
        <span className="ml-1 text-gray-200">/ {totalPaginas}</span>
      </div>

      {/* Botão para próxima página */}
      <button
        onClick={irParaProximaPagina}
        disabled={paginaAtual === totalPaginas}
        className={`w-8 h-8 flex items-center justify-center rounded-md ${
          paginaAtual === totalPaginas
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        title="Próxima página"
      >
        {/* Ícone com tamanho aumentado usando classes do Tailwind */}
        <IconChevronRight className="w-5 h-5" />
      </button>

      {/* Botão para última página */}
      <button
        onClick={irParaUltimaPagina}
        disabled={paginaAtual === totalPaginas}
        className={`w-8 h-8 flex items-center justify-center rounded-md ${
          paginaAtual === totalPaginas
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        title="Última página"
      >
        {/* Ícone com tamanho aumentado usando classes do Tailwind */}
        <IconChevronsRight className="w-5 h-5" />
      </button>
    </div>
  )
}