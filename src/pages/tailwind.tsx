// Página para exibir o componente TelaTailWind
import TelaTailWind from '@/components/template/TelaTailWind'
import RequireAuth from '@/components/auth/RequireAuth'

/**
 * Página que renderiza o componente TelaTailWind
 * Esta página está protegida pelo componente RequireAuth, que verifica se o usuário está autenticado
 * 
 * @returns Componente TelaTailWind dentro do wrapper de autenticação
 */
export default function TailWindPage() {
  return (
    <RequireAuth>
      <TelaTailWind />
    </RequireAuth>
  )
}
