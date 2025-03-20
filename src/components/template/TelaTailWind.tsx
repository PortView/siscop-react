import { IconFileText } from "@tabler/icons-react";
import Botao from "./Botao";
import CheckBox from "./CheckBox";
import DropDown from "./DropDown";
import ReguaDePag from "./ReguaDePag";

export default function TelaTailWind() {
    return (
        <>
            {/* Container principal com flex para garantir que as colunas fiquem lado a lado */}
            <div className="flex flex-col bg-zinc-400 p-1 2xlb:flex-row 2xlb:flex-wrap">
                {/* Primeira coluna com largura fixa */}
                <div className="flex w-[900px] h-[160px] flex-col gap-1 bg-amber-400 p-2 mr-2 mb-2 text-xs">
                    <div className="flex flex-row gap-1">
                        <DropDown
                            largura='280px'
                            placeholder="Clientes"
                            label=""
                            options={[]}
                            onChange={() => { }}
                            tamanhoFonte="xs" //| "md" | "lg" | "xl" | "2xl" | "3xl";
                        />

                        <DropDown
                            largura='120px'
                            placeholder="UF"
                            label=""
                            options={[]}
                            onChange={() => { }}
                            value={null}
                            disabled={false} // Desabilitar o dropdown quando o checkbox estiver marcado
                            tamanhoFonte="xs"
                        />

                        <CheckBox className="flex ml-2 mr-2.5"
                            label="Todas Ufs"
                            labelPosition="left"
                            checked={false}
                            onChange={() => { }}
                            disabled={false} // Desabilitar o checkbox quando nenhum cliente estiver selecionado
                            tamanhoFonte="xs"
                        />
                        <Botao
                            texto="Planilhas"
                            className="ml-2"
                            cor="bg-blue-500"
                            redondo={false}
                            tamanho="xs"
                            larguraFixa={110}
                            icone={<IconFileText />}
                            tamanhoIcone={28} // Definindo um tamanho maior para o ícone
                        />
                        <Botao
                            texto={`Contr:`}
                            className="ml-2"
                            cor="bg-blue-500"
                            redondo={false}
                            tamanho="xs"
                            larguraFixa={120}
                        />
                    </div>

                    <div className="flex flex-row gap-1">
                        <DropDown
                            largura='450px'
                            placeholder="Unidades"
                            label="Unidades"
                            containerClassName="flex mt-2 mb-2"
                            options={[]}
                            onChange={() => { }}
                            value={null}
                        />

                        <ReguaDePag
                            paginaAtual={1}
                            totalPaginas={1}
                            totalItems={0}
                            mostrarRegua={true}
                            onChange={(pagina) => { }}
                        />
                    </div>


                    <div className="flex flex-row gap-1 text-xs">
                        <button className="inline-block h-6 min-w-[100px] bg-blue-300 align-middle">Editar</button>
                        <button className="inline-block h-6 min-w-[100px] bg-blue-300 align-middle">Ocorrencias</button>
                        <button className="inline-block h-6 min-w-[100px] bg-blue-300 align-middle">Custos</button>
                        <button className="inline-block h-6 min-w-[100px] bg-blue-300 align-middle">Ord.Compra</button>
                        <button className="inline-block h-6 min-w-[100px] bg-blue-300 align-middle">Edit.Taref.</button>
                        <button className="inline-block h-6 min-w-[100px] bg-blue-300 align-middle">Rescisão</button>
                        <button className="inline-block h-6 min-w-[100px] bg-blue-300 align-middle">Pendenciar</button>
                    </div>
                </div>

                {/* Segunda coluna com largura fixa */}
                <div className="flex w-[900px] h-[160px] flex-col gap-2 bg-amber-600 p-2 mb-2">
                    <div className="flex flex-row gap-2">
                        <div className="flex h-6 w-16 bg-blue-300"></div>
                        <div className="flex h-6 w-16 bg-blue-300"></div>
                        <div className="flex h-6 w-16 bg-blue-300"></div>
                        <div className="flex h-6 w-16 bg-blue-300"></div>
                        <div className="flex h-6 w-16 bg-blue-300"></div>
                    </div>
                    <div className="flex flex-row gap-2">
                        <div className="flex h-6 w-16 bg-blue-300"></div>
                        <div className="flex h-6 w-16 bg-blue-300"></div>
                        <div className="flex h-6 w-16 bg-blue-300"></div>
                        <div className="flex h-6 w-16 bg-blue-300"></div>
                        <div className="flex h-6 w-16 bg-blue-300"></div>
                    </div>
                </div>
                {/* Elementos adicionais que ocupam toda a largura em resolução menor */}
                <div className="flex h-[500px] w-[900px] bg-blue-200 mr-2 mb-2">Grade Serviço</div>
                <div className="flex h-[500px] w-[900px] bg-green-200 mb-2">Grade Tarefa</div>
                {/* Elemento que ocupa toda a largura disponível */}
                <div className="flex h-[300px] w-[1808px] bg-green-200">Grade Conformidades</div>
            </div>

            <div className="hidden columns-2">
                <p>Well, let me tell you something, ...</p>
                <p className="break-inside-avoid-column">Sure, go ahead, laugh...</p>
                <p>Maybe we can live without...</p>
                <p>Look. If you think this is...</p>
            </div></>
    )
}