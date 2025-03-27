import { IconFileText } from "@tabler/icons-react";
import Botao from "./Botao";
import CheckBox from "./CheckBox";
import DropDown from "./DropDown";
import ReguaDePag from "./ReguaDePag";

export default function TelaTailWind() {
    return (
        <>
            {/* Container principal com largura total e centralização de conteúdo */}
            <div className="w-full flex justify-center">
                {/* Container interno com largura máxima e centralização */}
                <div className="w-full max-w-[1920px] mx-auto">
                    {/* Container do conteúdo - flex-col em telas menores, organizado em telas grandes */}
                    <div className="flex flex-col items-center bg-zinc-400 p-1 gap-1 mb-2">
                        
                        {/* Área superior - containers lado a lado em telas grandes */}
                        <div className="w-full flex flex-col 2xlb:flex-row 2xl:justify-center gap-1">
                            {/* Primeira coluna com largura fixa */}

                            <div className="flex w-[940px] h-[140px] flex-col p-1 bg-amber-400 text-xs rounded-md shadow-md">
                                <div className="flex flex-row">
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

                                    <CheckBox className="flex ml-1 mr-1"
                                        label="Todas Ufs"
                                        labelPosition="left"
                                        checked={false}
                                        onChange={() => { }}
                                        disabled={false} // Desabilitar o checkbox quando nenhum cliente estiver selecionado
                                        tamanhoFonte="xs"
                                    />
                                    <Botao
                                        texto="Planilhas"
                                        className="ml-1"
                                        cor="bg-blue-500"
                                        redondo={false}
                                        tamanho="xs"
                                        larguraFixa={110}
                                        icone={<IconFileText />}
                                        tamanhoIcone={28} // Definindo um tamanho maior para o ícone
                                    />
                                    <Botao
                                        texto={`Contr:`}
                                        className="ml-1"
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
                                        containerClassName="flex mt-1 mb-1"
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
                            <div className="flex w-[940px] h-[140px] 2xlb:w-[820px] flex-col gap-1 bg-amber-600 p-2 rounded-md shadow-md">
                                <div className="flex flex-row gap-1">
                                    <div className="flex h-6 w-16 bg-blue-300"></div>
                                    <div className="flex h-6 w-16 bg-blue-300"></div>
                                    <div className="flex h-6 w-16 bg-blue-300"></div>
                                    <div className="flex h-6 w-16 bg-blue-300"></div>
                                    <div className="flex h-6 w-16 bg-blue-300"></div>
                                </div>
                                <div className="flex flex-row gap-1">
                                    <div className="flex h-6 w-16 bg-blue-300"></div>
                                    <div className="flex h-6 w-16 bg-blue-300"></div>
                                    <div className="flex h-6 w-16 bg-blue-300"></div>
                                    <div className="flex h-6 w-16 bg-blue-300"></div>
                                    <div className="flex h-6 w-16 bg-blue-300"></div>
                                </div>
                            </div>
                        </div>

                        {/* Área do meio - containers lado a lado em telas grandes */}
                        <div className="w-full flex flex-col 2xlb:flex-row 2xl:justify-center gap-1">
                            <div className="flex w-[940px] h-[360px] bg-blue-200 rounded-md shadow-md">Grade Serviço</div>
                            <div className="flex w-[940px] h-[360px] 2xlb:w-[820px] bg-green-200 rounded-md shadow-md">Grade Tarefa</div>
                        </div>

                        {/* Área inferior - container único embaixo */}
                        <div className="w-full flex justify-center">
                            <div className="flex h-[360px] w-full max-w-[1764px] bg-orange-300 rounded-md shadow-md">Grade Conformidades</div>
                        </div>

                    </div>
                </div>
            </div>














            <div className="hidden columns-2">
                <p>Well, let me tell you something, ...</p>
                <p className="break-inside-avoid-column">Sure, go ahead, laugh...</p>
                <p>Maybe we can live without...</p>
                <p>Look. If you think this is...</p>
            </div>
        </>
    )
}