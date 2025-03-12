interface InputFormatadoProps {
    label?: string;
    tipo: string;
    valor: string | number;
    onInput?: (e: any) => any;
    className?: string;
    tamanho?: number;
}

export default function InputFormatado(props: InputFormatadoProps) {
    return (
        <>
            <label className="m-1">{props.label}</label>
            <input
                type={props.tipo}
                value={props.valor}
                onInput={props.onInput}
                className={`
                    text-gray-600 px-2 
                    w-${props.tamanho} h-11 rounded-md
                    ${props.className ?? ''}
                `}
            />
        </>
    );
}
