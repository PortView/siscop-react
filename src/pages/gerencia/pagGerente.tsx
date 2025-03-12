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
import ReguaDePag from '@/components/template/ReguaDePag'
import { Icon123, IconCalculatorFilled, IconEdit, IconFileText, IconNumber123 } from '@tabler/icons-react'
import InputFormatado from '@/components/template/InputFormatado'

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

  // Estados para controlar a paginação das unidades
  const [paginaAtual, setPaginaAtual] = useState<number>(1)
  const [totalPaginas, setTotalPaginas] = useState<number>(1)
  const [totalItems, setTotalItems] = useState<number>(0)

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

  // Função para buscar UFs disponíveis para o cliente selecionado
  const fetchUfs = async (codcli: number) => {
    try {
      // Buscar o cliente selecionado da lista de clientes
      const clienteSelecionado = clientesData.find(cliente => cliente.codcli === codcli);

      if (clienteSelecionado && clienteSelecionado.lc_ufs && clienteSelecionado.lc_ufs.length > 0) {
        // Transformar a lista de UFs no formato esperado pelo DropDown
        const ufsOptions = clienteSelecionado.lc_ufs.map(ufItem => ({
          id: ufItem.uf,
          label: ufItem.uf
        }));

        setUfsOptions(ufsOptions);

        // Se o checkbox "Todas Ufs" estiver marcado, buscar unidades com "ZZ"
        if (todasUfs) {
          console.log("Cliente selecionado com Todas Ufs marcado, enviando ZZ para API");
          fetchUnidades(codcli, "ZZ", 1);
        } else {
          // Se o checkbox "Todas Ufs" estiver desmarcado, verificar se há uma UF selecionada
          if (ufsOptions.length > 0) {
            const primeiraUf = ufsOptions[0].id.toString();
            setSelectedUf(primeiraUf);

            console.log("Cliente selecionado com Todas Ufs desmarcado, enviando", primeiraUf, "para API");
            fetchUnidades(codcli, primeiraUf, 1);

            console.log("Primeira UF selecionada automaticamente:", primeiraUf);
          }
        }
      } else {
        setUfsOptions([]);
      }
    } catch (error) {
      console.error("Erro ao buscar UFs:", error);
      setUfsOptions([]);
    }
  };

  // Função para buscar unidades com base no cliente e UF selecionados
  const fetchUnidades = async (codcli: number, uf: string, pagina: number = paginaAtual) => {
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
      console.log("Página atual:", pagina)

      const response = await axios.get(`${apiUrl}?codcoor=110&codcli=${codcli}&uf=${uf}&page=${pagina}`, {
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

        // Atualizar os estados de paginação
        setTotalItems(data.pagination.totalItems)
        setTotalPaginas(data.pagination.lastPage)
        setPaginaAtual(data.pagination.currentPage)
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

  // Função para lidar com a mudança no dropdown "Clientes"
  const handleClienteChange = (value: string | null) => {
    console.log("Cliente selecionado:", value)
    setSelectedOption(value)
    setSelectedUf(null) // Limpar a UF selecionada
    setSelectedUnidade(null) // Limpar a unidade selecionada
    setSelectedCodEnd(null) // Limpar o codend selecionado
    setSelectedContrato(null) // Limpar o contrato selecionado
    setUfsOptions([]) // Limpar as opções de UF
    setUnidadesOptions([]) // Limpar as opções de unidades

    // Se nenhum cliente estiver selecionado, reiniciar o estado do checkbox "Todas Ufs"
    if (!value) {
      setTodasUfs(false)
      // Reiniciar os estados de paginação
      setPaginaAtual(1)
      setTotalPaginas(1)
      setTotalItems(0)
      return
    }

    // Buscar UFs disponíveis para o cliente selecionado
    fetchUfs(parseInt(value))
  }

  // Função para lidar com a mudança no checkbox "Todas Ufs"
  const handleTodasUfsChange = (checked: boolean) => {
    console.log("Checkbox 'Todas Ufs' alterado para:", checked)
    setTodasUfs(checked)

    // Verificar se há um cliente selecionado
    if (!selectedOption) {
      return
    }

    const codcli = parseInt(selectedOption)

    // Reiniciar a página para 1 quando mudar o filtro
    setPaginaAtual(1)

    // Se o checkbox for marcado (TRUE), buscar todas as unidades com UF="ZZ"
    if (checked) {
      // Limpar a UF selecionada e desabilitar o dropdown "UFs"
      setSelectedUf(null)
      fetchUnidades(codcli, "ZZ", 1)
    } else {
      // Se o checkbox for desmarcado (FALSE), verificar se há uma UF selecionada
      if (selectedUf) {
        // Se houver uma UF selecionada, buscar unidades com essa UF
        fetchUnidades(codcli, selectedUf, 1)
      } else {
        // Se não houver uma UF selecionada, limpar as opções de unidades
        setUnidadesOptions([])
      }
    }
  }

  // Função para lidar com a mudança no dropdown "UFs"
  const handleUfChange = (value: string | null) => {
    console.log("UF selecionada:", value)
    setSelectedUf(value)
    setSelectedUnidade(null) // Limpar a unidade selecionada
    setSelectedCodEnd(null) // Limpar o codend selecionado
    setSelectedContrato(null) // Limpar o contrato selecionado

    // Verificar se há um cliente selecionado e uma UF selecionada
    if (selectedOption && value) {
      const codcli = parseInt(selectedOption)

      // Reiniciar a página para 1 quando mudar o filtro
      setPaginaAtual(1)

      // Buscar unidades com a UF selecionada
      fetchUnidades(codcli, value, 1)
    } else {
      // Se não houver cliente ou UF selecionados, limpar as opções de unidades
      setUnidadesOptions([])
    }
  }

  // Função para lidar com a mudança no dropdown "Unidades"
  const handleUnidadeChange = (value: string | null) => {
    setSelectedUnidade(value);

    // Armazenar o codend para uso em outras partes da tela
    if (value) {
      setSelectedCodEnd(parseInt(value));

      // Buscar o contrato da unidade selecionada
      const unidadeSelecionada = unidadesData.find(u => u.codend.toString() === value);
      if (unidadeSelecionada) {
        setSelectedContrato(unidadeSelecionada.contrato);
      } else {
        setSelectedContrato(null);
      }
    } else {
      setSelectedCodEnd(null);
      setSelectedContrato(null);
    }

    console.log("Unidade selecionada:", value);
    console.log("codend selecionado:", value ? parseInt(value) : null);
  };

  // Função genérica para outros dropdowns
  const handleDropdownChange = (value: string | null) => {
    console.log("Opção selecionada:", value);
  };

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
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <PaginaSemMenu>
          {/* Avisos de carregamento no topo da página à direita */}
          <div className="fixed top-4 right-4 z-50 text-sm">
            {loading && <div className="text-blue-600 bg-transparent px-4 py-2 rounded">Carregando clientes...</div>}
            {loadingUnidades && <div className="text-blue-600 bg-transparent px-4 py-2 rounded">Carregando unidades...</div>}
          </div>

          <div className="w-[calc(100vw-40px)] ">
            <div className="flex flex-row items-center">
              <div className="flex flex-col mb-2">
                {/* Primeira linha de componentes - Clientes, Uf, Todas Ufs, Bt-Planilhas, Bt-Contrato */}
                <div className="flex flex-center flex-row items-center ">
                  <DropDown
                    largura='380px'
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
                  <CheckBox className="flex ml-2 mr-8"
                    label="Todas Ufs"
                    labelPosition="left"
                    checked={todasUfs}
                    onChange={(checked) => handleTodasUfsChange(checked)}
                    disabled={!selectedOption} // Desabilitar o checkbox quando nenhum cliente estiver selecionado
                  />

                  <Botao
                    texto="Planilhas"
                    className="ml-2"
                    cor="bg-blue-500"
                    redondo={false}
                    tamanho="lg"
                    larguraFixa={150}
                    icone={<IconFileText />}
                    tamanhoIcone={28} // Definindo um tamanho maior para o ícone
                  />
                  <Botao
                    texto={`Contr: ${selectedContrato ? selectedContrato.toString().padStart(5, '0') : ''}`}
                    className="ml-2"
                    cor="bg-blue-500"
                    redondo={false}
                    tamanho="lg"
                    larguraFixa={200}
                  />
                </div>
                {/* Segunda linha de componentes - Unidades, Regua de Paginação */}
                <div className="flex flex-center flex-row items-center">
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
                  <div className="flex ml-2"></div>
                  <ReguaDePag
                    paginaAtual={paginaAtual}
                    totalPaginas={totalPaginas}
                    totalItems={totalItems}
                    mostrarRegua={totalItems > 100}
                    onChange={(pagina) => {
                      setPaginaAtual(pagina);
                      // Verificar se há um cliente selecionado
                      if (selectedOption) {
                        const codcli = parseInt(selectedOption);
                        // Se o checkbox "Todas Ufs" estiver marcado, usar "ZZ" como UF
                        if (todasUfs) {
                          fetchUnidades(codcli, "ZZ", pagina);
                        }
                        // Caso contrário, usar a UF selecionada (se houver)
                        else if (selectedUf) {
                          fetchUnidades(codcli, selectedUf, pagina);
                        }
                      }
                    }}
                  />   </div>
                {/* Terceira linha de componentes - Botoes Editar, Ocorrencias, Custos */}
                <div className="flex flex-row items-center">
                  <Botao
                    texto="Editar"
                    icone={<IconEdit />}
                    className="ml-2"
                    cor="bg-blue-500"
                    redondo={false}
                    tamanho="lg"
                    larguraFixa={180}
                  />
                  <Botao
                    texto="Ocorrências"
                    icone={<IconFileText />}
                    className="ml-2"
                    cor="bg-blue-500"
                    redondo={false}
                    tamanho="lg"
                    larguraFixa={180}
                  />
                  <Botao
                    texto="Custos"
                    icone={<IconFileText />}
                    className="ml-2"
                    cor="bg-blue-500"
                    redondo={false}
                    tamanho="lg"
                    larguraFixa={180}
                  />
                  <Botao
                    texto="Ord.Compra"
                    icone={<IconCalculatorFilled />}
                    className="ml-2"
                    cor="bg-blue-500"
                    redondo={false}
                    tamanho="lg"
                    larguraFixa={180}
                  />
                  <Botao
                    texto="Edit.Tarefas"
                    icone={<IconEdit />}
                    className="ml-2"
                    cor="bg-blue-500"
                    redondo={false}
                    tamanho="lg"
                    larguraFixa={180}
                  />
                  <Botao
                    texto="Rescisão"
                    icone={<IconEdit />}
                    className="ml-2"
                    cor="bg-blue-500"
                    redondo={false}
                    tamanho="lg"
                    larguraFixa={180}
                  />
                  <Botao
                    texto="Pendenciar"
                    icone={<IconEdit />}
                    className="ml-2"
                    cor="bg-blue-500"
                    redondo={false}
                    tamanho="lg"
                    larguraFixa={180}
                  />
                  <div></div>
                </div>
              </div>
              {/* Segunda coluna do painel superior */}
              <div className="flex flex-col bg-zinc-600 shadow-md rounded-md p-4 h-400 ml-10 mb-2">
                {/* Primeira linha da segunda coluna de componentes - Checkboxs */}
                <div className="flex flex-row items-center">
                  <CheckBox className="flex ml-2"
                    label="Cód.Serv."
                    labelPosition="left"
                    checked={true}
                    onChange={(checked) => handleTodasUfsChange(checked)}
                    disabled={false} // Desabilitar o checkbox quando nenhum cliente estiver selecionado
                  />
                  <CheckBox className="flex ml-20 "
                    label="Status"
                    labelPosition="left"
                    checked={true}
                    onChange={(checked) => handleTodasUfsChange(checked)}
                    disabled={false} // Desabilitar o checkbox quando nenhum cliente estiver selecionado
                  />
                  <CheckBox className="flex ml-20"
                    label="Dt.Limite"
                    labelPosition="left"
                    checked={true}
                    onChange={(checked) => handleTodasUfsChange(checked)}
                    disabled={false} // Desabilitar o checkbox quando nenhum cliente estiver selecionado
                  /></div>
                {/* Segunda linha da segunda coluna de componentes - Checkboxs */}
                <div className="flex flex-row items-center mt-5">
                  <CheckBox className="flex ml-2"
                    label="Só serv.não concluidos"
                    labelPosition="left"
                    checked={true}
                    onChange={(checked) => handleTodasUfsChange(checked)}
                    disabled={false} // Desabilitar o checkbox quando nenhum cliente estiver selecionado

                  />
                  <CheckBox className="flex ml-10"
                    label="Novos"
                    labelPosition="left"
                    checked={true}
                    onChange={(checked) => handleTodasUfsChange(checked)}
                    disabled={false} // Desabilitar o checkbox quando nenhum cliente estiver selecionado
                  />
                  <CheckBox className="flex ml-10"
                    label="Suspensos"
                    labelPosition="left"
                    checked={true}
                    onChange={(checked) => handleTodasUfsChange(checked)}
                    disabled={false} // Desabilitar o checkbox quando nenhum cliente estiver selecionado
                  />
                  <CheckBox className="flex ml-10"
                    label="Sem nota"
                    labelPosition="left"
                    checked={true}
                    onChange={(checked) => handleTodasUfsChange(checked)}
                    disabled={false} // Desabilitar o checkbox quando nenhum cliente estiver selecionado
                  />
                  <CheckBox className="flex ml-10"
                    label="Pendência"
                    labelPosition="left"
                    checked={true}
                    onChange={(checked) => handleTodasUfsChange(checked)}
                    disabled={false} // Desabilitar o checkbox quando nenhum cliente estiver selecionado
                  />
                  <CheckBox className="flex ml-10"
                    label="Doc.Internet"
                    labelPosition="left"
                    checked={true}
                    onChange={(checked) => handleTodasUfsChange(checked)}
                    disabled={false} // Desabilitar o checkbox quando nenhum cliente estiver selecionado
                  />
                  <CheckBox className="flex ml-10"
                    label="Só O.S."
                    labelPosition="left"
                    checked={true}
                    onChange={(checked) => handleTodasUfsChange(checked)}
                    disabled={false} // Desabilitar o checkbox quando nenhum cliente estiver selecionado
                  />
                </div>
                {/* Terceira linha da segunda coluna de componentes - Checkboxs  */}
                <div className="flex flex-row items-center mt-5">
                  <div className="flex ml-2">Gerencia Mauro</div>
                <div className="ml-4"></div>
                <InputFormatado
                    label="H.Tramit."
                    tipo="text"
                    valor={""}
                    tamanho={20}
                  
                  />
                  <div className="ml-4"></div>
                  <InputFormatado
                    label="H.Assec."
                    tipo="text"
                    valor={""}
                    tamanho={20}
                  />
                   <div className="ml-8"></div>
                  <InputFormatado
                    label="TE Assec."
                    tipo="text"
                    valor={""}
                    tamanho={20}
                  />
                  <div className="ml-4"></div>
                  <InputFormatado
                    label="TE Assec."
                    tipo="text"
                    valor={""}
                    tamanho={20}
                  />
                </div>
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
      )}
    </RequireAuth>
  )
}