'use client'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface LoginResponse {
  access_token: string
}

// Interface para os dados do usuário retornados pela API ME
interface UserData {
  id: number;
  email: string;
  name: string;
  cod: number;
  tipo: string;
  mvvm: string;
  codcargo: number;
}

export default function Login() {
  const [email, setEmail] = useState('redes01@ameni.com.br')
  const [password, setPassword] = useState('$Redes01')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!email || !password) {
      setError('Por favor, preencha todos os campos')
      setLoading(false)
      return
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_AUTH_URL
      if (!apiUrl) {
        throw new Error('URL da API não configurada')
      }

      const response = await axios.post<LoginResponse>(apiUrl, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (response.data && response.data.access_token) {
        // Salva o token em um cookie com duração de 24 horas
        Cookies.set('auth_token', response.data.access_token, { 
          expires: 1,
          secure: true,
          sameSite: 'lax'
        })

        // Armazena o token também no localStorage
        localStorage.setItem('access_token', response.data.access_token)
        
        // Configura o token para requisições futuras
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`
        
        // Buscar informações do usuário logado
        try {
          const meApiUrl = process.env.NEXT_PUBLIC_API_ME_URL
          if (!meApiUrl) {
            throw new Error('URL da API ME não configurada')
          }

          // Chamada à API ME para obter os dados do usuário
          const userResponse = await axios.get<UserData>(meApiUrl, {
            headers: {
              'Authorization': `Bearer ${response.data.access_token}`
            }
          })

          // Armazena os dados do usuário no localStorage
          if (userResponse.data) {
            localStorage.setItem('usuario_nome', userResponse.data.name)
            localStorage.setItem('usuario_cargo', userResponse.data.tipo)
            localStorage.setItem('usuario_cod', userResponse.data.cod.toString())
            localStorage.setItem('usuario_email', userResponse.data.email)
            localStorage.setItem('usuario_id', userResponse.data.id.toString())
            localStorage.setItem('usuario_codcargo', userResponse.data.codcargo.toString())
            
            // Armazena o objeto completo para uso futuro, se necessário
            localStorage.setItem('usuario_dados', JSON.stringify(userResponse.data))
          }
        } catch (userErr) {
          console.error('Erro ao buscar dados do usuário:', userErr)
          // Não impede o login se falhar ao buscar dados do usuário
        }
        
        // Força o redirecionamento para a página do gerente
        window.location.href = '/gerencia/pagGerente'
      }
    } catch (err: any) {
      console.error('Erro de login:', err)
      if (err.response) {
        setError(err.response.data?.message || 'Email ou senha incorretos')
      } else {
        setError('Erro ao conectar com o servidor')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login SISCOP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Entre para acessar o sistema
          </p>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
