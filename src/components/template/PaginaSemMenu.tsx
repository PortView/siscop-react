import Conteudo from './Conteudo'
import BarraTopo from './BarraTopo'

interface PaginaProps {
    children?: any
}

export default function PaginaSemMenu(props: PaginaProps) {
    return (

        <div >
            <BarraTopo />
            <Conteudo>
                {props.children}
            </Conteudo>
        </div>
    )
}