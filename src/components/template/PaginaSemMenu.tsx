import MenuPrincipal from './MenuPrincipal'
import Cabecalho from './Cabecalho'
import Conteudo from './Conteudo'
import Flex from './Flex'
import BarraTopo from './BarraTopo'



interface PaginaProps {
    children?: any
}

export default function PaginaSemMenu(props: PaginaProps) {
    return (
        <div className={`
            flex h-screen w-screen
            bg-zinc-900 text-white
        `}>
            <Flex col className={`flex-1`}>
                {/* <Cabecalho titulo={props.titulo} subtitulo={props.subtitulo} /> */}
                {/* Componente BarraTopo agora obtém os dados do usuário diretamente do localStorage */}
                <BarraTopo />
                <Conteudo>
                    {props.children}
                </Conteudo>
            </Flex>
        </div>
    )
}