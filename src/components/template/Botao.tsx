export interface BotaoProps {
	icone?: any;
	texto?: string;
	cor?: string;
	tamanho?: "xs" | "md" | "lg" | "xl" | "2xl" | "3xl";
	redondo?: boolean;
	onClick?: (e: any) => void;
	className?: string;
	larguraFixa?: number;
	tamanhoIcone?: number;
}

export default function Botao(props: BotaoProps) {
	function tamanho() {
		if (props.tamanho === "xs") return 9;
		if (props.tamanho === "lg") return 14;
		if (props.tamanho === "xl") return 16;
		if (props.tamanho === "2xl") return 20;
		if (props.tamanho === "3xl") return 24;
		return 11;
	}

	function tamanhoIconePadrao() {
		if (props.tamanho === "xs") return 16;
		if (props.tamanho === "lg") return 20;
		if (props.tamanho === "xl") return 24;
		if (props.tamanho === "2xl") return 28;
		if (props.tamanho === "3xl") return 32;
		return 18; 
	}

	return (
		<button
			className={`
            flex items-center h-${tamanho()}
			justify-center
            hover:bg-opacity-80 select-none
            ${props.redondo ? "rounded-full" : "rounded-md"}
            ${props.redondo && `justify-center w-${tamanho()}`}
            ${props.cor ?? "bg-blue-500"}
            ${`text-${props.tamanho ?? "base"}`}
            ${props.className ?? ""}
        `}
			onClick={props.onClick}
			style={props.larguraFixa ? { width: `${props.larguraFixa}px` } : {}}
		>
			{props.icone && (
				<div style={{ 
					display: 'flex', 
					alignItems: 'center', 
					fontSize: props.tamanhoIcone || tamanhoIconePadrao(),
					//transform: 'scale(1.2)' 
				}}>
					{props.icone}
				</div>
			)}
			{props.texto}
		</button>
	);
}
