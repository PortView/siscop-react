interface InputFormatadoProps {
    label?: string;
    tipo: string;
    valor: string | number;
    onInput?: (e: any) => any;
    className?: string;
    tamanho?: number;
    step?: number;
}

export default function InputFormatado(props: InputFormatadoProps) {
    return (
        <>
            <label className="mr-2 text-xs text-white">{props.label}</label>
            <input
                type={props.tipo}
                value={props.valor}
                onInput={props.onInput}
                step={props.step}
                className={`
                    text-black text-xs
                    w-${props.tamanho} h-8 rounded-md
                    ${props.className ?? ''}
                `}
            />
        </>
    );
}
