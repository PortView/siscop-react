'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import axios from 'axios'
import TableConform from "../../components/template/TableConform"
import RequireAuth from "../../components/auth/RequireAuth"
import PaginaSemMenu from '@/components/template/PaginaSemMenu'
import DropDown from '@/components/template/DropDown'
import Botao from '@/components/template/Botao'
import CheckBox from '@/components/template/CheckBox'

interface Cliente {
  codcli: number;
  fantasia: string;
  lc_ufs: { uf: string }[];
}

interface UnidadeResponse {
  folowups: Array<{
    contrato: number;
    codend: number;
    cadimov: {
      tipo: string;
      uf: string;
    }
  }>;
  pagination: {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    lastPage: number;
  }
}

export default function PagGerente() {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [selectedUf, setSelectedUf] = useState<string | null>(null)
  const [selectedUnidade, setSelectedUnidade] = useState<string | null>(null)
  const [selectedCodEnd, setSelectedCodEnd] = useState<number | null>(null)
  const [selectedContrato, setSelectedContrato] = useState<number | null>(null)
  const [clientesOptions, setClientesOptions] = useState<{ id: string | number; label: string }[]>([])
  const [ufsOptions, setUfsOptions] = useState<{ id: string | number; label: string }[]>([])
  const [unidadesOptions, setUnidadesOptions] = useState<{ id: string | number; label: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingUnidades, setLoadingUnidades] = useState(false)
  const [clientesData, setClientesData] = useState<Cliente[]>([])
  const [unidadesData, setUnidadesData] = useState<Array<{
    contrato: number;
    codend: number;
    cadimov: {
      tipo: string;
      uf: string;
    }
  }>>([])
  // Estado para controlar o checkbox "Todas Ufs"
  // Inicializado como false para garantir que esteja desmarcado no carregamento da página
  const [todasUfs, setTodasUfs] = useState(false)

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const token = Cookies.get('auth_token')
    if (!token) {
      window.location.href = '/login'
    } else {
      // Buscar os clientes da API
      fetchClientes(token)
    }
  }, [])

  const fetchClientes = async (token: string) => {
    try {
      setLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_CLIENTES_URL
      
      if (!apiUrl) {
        console.error("URL da API de clientes não definida no arquivo .env.local")
        return
      }

      const response = await axios.get(`${apiUrl}?codcoor=110`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data && Array.isArray(response.data)) {
        // Armazenar os dados completos dos clientes
        setClientesData(response.data)
        
        // Transformar os dados da API no formato esperado pelo DropDown
        // Usando "fantasia" como label e "codcli" como id
        const options = response.data.map((cliente: Cliente) => ({
          id: cliente.codcli,
          label: cliente.fantasia
        }))
        
        setClientesOptions(options)
      } else {
        console.error("Formato de resposta da API inválido:", response.data)
        setClientesOptions([])
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error)
      setClientesOptions([])
    } finally {
      setLoading(false)
    }
  }

  // Função para buscar unidades com base no cliente e UF selecionados
  const fetchUnidades = async (codcli: number, uf: string) => {
    try {
      setLoadingUnidades(true)
      setUnidadesOptions([]) // Limpar as opções anteriores
      setSelectedCodEnd(null) // Limpar o codend selecionado anteriormente
      setSelectedContrato(null) // Limpar o contrato selecionado anteriormente
      
      const token = Cookies.get('auth_token')
      if (!token) {
        console.error("Token de autenticação não encontrado")
        return
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_UNIDADES_URL
      
      if (!apiUrl) {
        console.error("URL da API de unidades não definida no arquivo .env.local")
        return
      }

      // Log para depuração - usar o parâmetro uf diretamente
      console.log("Parâmetro UF recebido na função:", uf)
      
      const response = await axios.get(`${apiUrl}?codcoor=110&codcli=${codcli}&uf=${uf}&page=1`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = response.data as UnidadeResponse;
      
      if (data && data.folowups && Array.isArray(data.folowups)) {
        // Armazenar os dados completos das unidades
        setUnidadesData(data.folowups)
        
        // Transformar os dados da API no formato esperado pelo DropDown
        // Usando o formato contrato + UF + tipo como texto de exibição e codend como valor interno
        const options = data.folowups.map((unidade) => ({
          id: unidade.codend.toString(),
          // Novo formato padronizado: contrato + UF + tipo, independente do estado do checkbox "Todas Ufs"
          label: `${unidade.contrato} ${unidade.cadimov.uf} ${unidade.cadimov.tipo}`
        }))
        
        setUnidadesOptions(options)
        
        // Se houver unidades disponíveis, selecionar automaticamente a primeira
        if (options.length > 0) {
          const primeiraUnidade = options[0].id.toString()
          setSelectedUnidade(primeiraUnidade)
          // Armazenar o codend para uso em outras partes da tela
          setSelectedCodEnd(parseInt(primeiraUnidade))
          // Armazenar o contrato da primeira unidade
          const unidadeSelecionada = data.folowups.find(u => u.codend.toString() === primeiraUnidade)
          if (unidadeSelecionada) {
            setSelectedContrato(unidadeSelecionada.contrato)
          }
          console.log("Primeira unidade selecionada automaticamente:", primeiraUnidade)
        } else {
          setSelectedUnidade(null)
        }
      } else {
        console.error("Formato de resposta da API de unidades inválido:", response.data)
        setUnidadesOptions([])
        setSelectedUnidade(null)
      }
    } catch (error) {
      console.error("Erro ao buscar unidades:", error)
      setUnidadesOptions([])
      setSelectedUnidade(null)
    } finally {
      setLoadingUnidades(false)
    }
  }

  const handleClienteChange = (value: string | null) => {
    setSelectedOption(value)
    console.log("Cliente selecionado:", value)
    
    // Limpar a UF selecionada anteriormente
    setSelectedUf(null)
    // Limpar as unidades selecionadas anteriormente
    setSelectedUnidade(null)
    setSelectedCodEnd(null)
    setSelectedContrato(null)
    setUnidadesOptions([])
    
    // Se nenhum cliente estiver selecionado, reiniciar o estado do checkbox "Todas Ufs"
    if (!value) {
      console.log("Cliente desmarcado, reiniciando estado do checkbox Todas Ufs")
      setTodasUfs(false)
      return
    }
    
    // Se um cliente foi selecionado, buscar as UFs disponíveis
    if (value) {
      const codcli = parseInt(value)
      const clienteSelecionado = clientesData.find(cliente => cliente.codcli === codcli)
      
      if (clienteSelecionado && clienteSelecionado.lc_ufs && clienteSelecionado.lc_ufs.length > 0) {
        // Transformar a lista de UFs no formato esperado pelo DropDown
        const ufsOptions = clienteSelecionado.lc_ufs.map(ufItem => ({
          id: ufItem.uf,
          label: ufItem.uf
        }))
        
        setUfsOptions(ufsOptions)
        
        // Se o checkbox "Todas Ufs" estiver marcado, buscar unidades com "ZZ"
        if (todasUfs) {
          // Log para depuração
          console.log("Cliente selecionado com Todas Ufs marcado, enviando ZZ para API")
          fetchUnidades(codcli, "ZZ")
        } else {
          // Selecionar automaticamente a primeira UF disponível
          if (ufsOptions.length > 0) {
            const primeiraUf = ufsOptions[0].id.toString()
            // Atualizar o estado e chamar a função de mudança para garantir que todas as ações associadas sejam executadas
            setSelectedUf(primeiraUf)
            
            // Buscar unidades para o cliente e UF selecionados
            console.log("Cliente selecionado com Todas Ufs desmarcado, enviando", primeiraUf, "para API")
            fetchUnidades(codcli, primeiraUf)
            
            console.log("Primeira UF selecionada automaticamente:", primeiraUf)
          }
        }
      } else {
        setUfsOptions([])
      }
    } else {
      // Se nenhum cliente estiver selecionado, limpar as UFs
      setUfsOptions([])
    }
  }

  const handleUfChange = (value: string | null) => {
    setSelectedUf(value)
    console.log("UF selecionada:", value)
    
    // Limpar as unidades selecionadas anteriormente
    setSelectedUnidade(null)
    setSelectedCodEnd(null)
    setSelectedContrato(null)
    setUnidadesOptions([])
    
    // Se um cliente e uma UF estiverem selecionados, buscar as unidades
    if (selectedOption && value) {
      const codcli = parseInt(selectedOption)
      console.log("UF alterada, enviando", value, "para API")
      fetchUnidades(codcli, value)
    }
  }
  
  const handleUnidadeChange = (value: string | null) => {
    setSelectedUnidade(value)
    
    // Armazenar o codend para uso em outras partes da tela
    if (value) {
      setSelectedCodEnd(parseInt(value))
      
      // Buscar o contrato da unidade selecionada
      const unidadeSelecionada = unidadesData.find(u => u.codend.toString() === value)
      if (unidadeSelecionada) {
        setSelectedContrato(unidadeSelecionada.contrato)
      } else {
        setSelectedContrato(null)
      }
    } else {
      setSelectedCodEnd(null)
      setSelectedContrato(null)
    }
    
    console.log("Unidade selecionada:", value)
    console.log("codend selecionado:", value ? parseInt(value) : null)
  }
  
  // Função genérica para outros dropdowns
  const handleDropdownChange = (value: string | null) => {
    console.log("Opção selecionada:", value)
  }

  // Função para lidar com a mudança no checkbox "Todas Ufs"
  const handleTodasUfsChange = (checked: boolean) => {
    console.log("Checkbox Todas Ufs alterado para:", checked)
    
    // Atualizar o estado do checkbox
    setTodasUfs(checked)
    
    // Se um cliente estiver selecionado
    if (selectedOption) {
      const codcli = parseInt(selectedOption)
      
      // Se o checkbox for marcado (TRUE), buscar todas as unidades com UF="ZZ"
      if (checked) {
        // Limpar a UF selecionada e desabilitar o dropdown "UFs"
        setSelectedUf(null)
        
        // Buscar todas as unidades com UF="ZZ"
        console.log("Estado do checkbox Todas Ufs:", checked)
        console.log("Parâmetro UF enviado para API:", "ZZ")
        fetchUnidades(codcli, "ZZ")
      } 
      // Se o checkbox for desmarcado (FALSE), buscar unidades com a UF selecionada
      else {
        const clienteSelecionado = clientesData.find(cliente => cliente.codcli === codcli)
        
        // Habilitar o dropdown "UFs" e selecionar automaticamente a primeira UF disponível
        if (clienteSelecionado && clienteSelecionado.lc_ufs && clienteSelecionado.lc_ufs.length > 0) {
          const primeiraUf = clienteSelecionado.lc_ufs[0].uf
          setSelectedUf(primeiraUf)
          
          // Buscar unidades para o cliente e UF selecionados
          console.log("Estado do checkbox Todas Ufs:", checked)
          console.log("Parâmetro UF enviado para API:", primeiraUf)
          fetchUnidades(codcli, primeiraUf)
        }
      }
    }
    // Se nenhum cliente estiver selecionado, o checkbox já estará desabilitado pela propriedade disabled no componente
  }

  const handleLogout = () => {
    // Remove o token do cookie e localStorage
    Cookies.remove('auth_token')
    localStorage.removeItem('access_token')

    // Remove o token do cabeçalho do axios
    delete axios.defaults.headers.common['Authorization']

    // Redireciona para a página de login
    window.location.href = '/login'
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-100">
        {/* <nav className="bg-white shadow-lg">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-800">SISCOP - Área do Gerente</h1>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </nav> */}
        <PaginaSemMenu titulo="Gerente" subtitulo="Pagina do Gerente">
          {/* Avisos de carregamento no topo da página à direita */}
          <div className="fixed top-4 right-4 z-50 text-sm">
            {loading && <div className="text-blue-600 bg-transparent px-4 py-2 rounded">Carregando clientes...</div>}
            {loadingUnidades && <div className="text-blue-600 bg-transparent px-4 py-2 rounded">Carregando unidades...</div>}
          </div>

          <div className="w-[calc(100vw-40px)] mx-auto">
            <div className="flex flex-col">
            <div className="flex flex-center flex-row items-center ">
              <DropDown 
                largura='300px'
                placeholder="Clientes"
                label=""
                options={clientesOptions}
                onChange={handleClienteChange}
              />
              <div className="ml-2">
              <DropDown
                largura='140px'
                placeholder="UF"
                label=""
                options={ufsOptions}
                onChange={handleUfChange}
                value={selectedUf}
                disabled={todasUfs} // Desabilitar o dropdown quando o checkbox estiver marcado
              />
      </div>
      <CheckBox className="flex ml-2"
      label="Todas Ufs"
      labelPosition="left"
      checked={todasUfs}
      onChange={(checked) => handleTodasUfsChange(checked)}
      disabled={!selectedOption} // Desabilitar o checkbox quando nenhum cliente estiver selecionado
      />
                <Botao
                  texto={`Contr: ${selectedContrato ? selectedContrato.toString().padStart(5, '0') : ''}`}
                  className="ml-2"
                  cor="bg-blue-500"
                  redondo={false}
                  tamanho="xl"
                  larguraFixa={200}
                />
              </div>
              <div className="flex flex-center flex-row ">
              <DropDown
                largura='550px'
                placeholder="Unidades"
                label="Unidades"
                containerClassName="flex mt-2 mb-2"
                options={unidadesOptions.map(option => ({
                  id: option.id,
                  label: option.label
                }))}
                onChange={handleUnidadeChange}
                value={selectedUnidade ? unidadesOptions.find(opt => opt.id.toString() === selectedUnidade)?.label || null : null}
              />
              </div>
                        
                        </div>
            
            <div className="flex flex-col bg-slate-400 shadow-md rounded-md p-4">
              <DropDown
                largura='300px'
                placeholder="Selecione um CNPJ"
                label=""
                containerClassName="flex flex-row items-center bg-zinc-600 p-5 mb-1 border border-solid border-red-600 rounded-md w-full"
                options={[
                  { id: "1", label: "1 - Item 01" },
                  { id: "2", label: "2 - Item 02" },
                  { id: "3", label: "3 - Item 030" }
                ]}
                onChange={handleDropdownChange}
              />
              <TableConform
                codimov={selectedCodEnd || 22769}
                web={false}
                relatorio={false}
                cnpj=""
                temcnpj={false}
              />
            </div>

          </div>
        </PaginaSemMenu>
      </div>
    </RequireAuth>
  )
}