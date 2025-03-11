'use client'
import Cookies from 'js-cookie'
import { IconLogout, IconUser } from '@tabler/icons-react'
import Botao from './Botao'
import axios from 'axios'
import { useEffect, useState } from 'react'

/**
 * Componente BarraTopo - Barra superior da aplicação
 * 
 * Este componente exibe uma barra superior com informações do usuário logado
 * e um botão de logout. Os dados do usuário são obtidos diretamente do localStorage,
 * que é preenchido após o login bem-sucedido.
 */
export default function BarraTopo() {
  // Estados para armazenar os dados do usuário
  const [nomeUsuario, setNomeUsuario] = useState<string>('Usuário')
  const [cargoUsuario, setCargoUsuario] = useState<string>('Não definido')

  // Efeito para carregar os dados do usuário do localStorage quando o componente é montado
  useEffect(() => {
    // Tenta obter o nome e cargo do usuário do localStorage
    const nome = localStorage.getItem('usuario_nome')
    const cargo = localStorage.getItem('usuario_cargo')
    
    // Atualiza os estados com os valores do localStorage, se existirem
    if (nome) setNomeUsuario(nome)
    if (cargo) setCargoUsuario(cargo)
  }, [])

  // Função para lidar com o clique no botão de logout
  const handleLogout = () => {
    // Remove o token do cookie e localStorage
    Cookies.remove('auth_token')
    localStorage.removeItem('access_token')
    
    // Remove os dados do usuário do localStorage
    localStorage.removeItem('usuario_nome')
    localStorage.removeItem('usuario_cargo')
    localStorage.removeItem('usuario_cod')
    localStorage.removeItem('usuario_email')
    localStorage.removeItem('usuario_id')
    localStorage.removeItem('usuario_codcargo')
    localStorage.removeItem('usuario_dados')

    // Remove o token do cabeçalho do axios
    delete axios.defaults.headers.common['Authorization']

    // Redireciona para a página de login
    window.location.href = '/login'
  };

  return (
    <div className="flex justify-between items-center w-full bg-gray-800 p-2 shadow-md">
      {/* Logo da aplicação */}
      <div className="flex items-center">
        <span className="text-2xl font-bold text-white">SISCOP - Área do Gerente</span>
      </div>

      {/* Informações do usuário e botão de logout */}
      <div className="flex items-center">
        <div className="flex flex-col mr-4 items-end">
          <div className="flex items-center">
            <IconUser className="w-5 h-5 mr-2 text-gray-300" />
            <span className="text-white font-medium">{nomeUsuario}</span>
          </div>
          <span className="text-gray-300 text-sm">{cargoUsuario}</span>
        </div>
        <Botao
          texto="Sair"
          icone={<IconLogout />}
          tamanhoIcone={20}
          cor="bg-red-600"
          onClick={handleLogout}
          tamanho="md"
          className="text-white"
        />
      </div>
    </div>
  );
}