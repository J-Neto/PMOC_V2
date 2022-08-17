import { CondensadorasRepository } from "../../repositories/interfaces/condensadoras/condensadoras-repository";
import { EvaporadorasRepository } from "../../repositories/interfaces/evaporadoras/evaporadoras-repository";
import { ManutencoesCorretivasRepository } from "../../repositories/interfaces/manutencoes/manutencoes-corretivas-repository";
import { ManutencoesPreventivasRepository } from "../../repositories/interfaces/manutencoes/manutencoes-preventivas-repository";
import { manutencao_status, manutencao_tipo, ManutencoesRepository } from "../../repositories/interfaces/manutencoes/manutencoes-repository";

// FUNCIONAMENTO DAS MANUTENÇÕES ################################################################################################################
// Inicialmente, o usuário pode decidir realizar a manutenção de apenas uma condensadora, evaporadora ou ambos juntos;

// A manutenção possui dois tipos: CORRETIVAS e PREVENTIVAS ...
//  Corretiva: É realizada somente quando algum defeito acontece e é preciso realizar a sua CORREÇÃO;
//  Preventiva: É realizada periodicamente, conforme o período de cada TAREFA, a fim de evitar/PREVENIR possíveis defeitos em um tempo futuro;

// #############################################################################################################################################

// FUNCIONAMENTO DO CÓDIGO
// Aqui o negócio é uma parada um pouco diferente
// Quando decidimos trocar a condensadora ou evaporadora da manutenção, também estamos alterando o seu status para o anterior
// Então é interessante sabermos se a manutenção pode ter uma evaporadora/condensadora atual e uma nova que será inserida
// #############################################################################################################################################

// Interface
interface UpdateManutencaoRequest {
    id: string;
    tipo?: manutencao_tipo;
    status?: manutencao_status;
    tec_responsavel?: string;
    custo?: number;
    previsao_termino?: string;
    id_condensadora?: string;
    id_evaporadora?: string;

    // Itens e descrição da corretiva
    item_array?: Array<string>;
    descricao_array?: Array<string>;

    // Itens e descrição da preventiva
    item_preventiva?: string;
    tarefas_array?: Array<string>;
}

// Service
export class UpdateManutencaoService {
  
  // Recebendo o repositório no construtor
  constructor(
    private manutencoesRepository: ManutencoesRepository,
    private manutecoesCorretivasRepository: ManutencoesCorretivasRepository,
    private manutencoesPreventivasRepository: ManutencoesPreventivasRepository,
    private condensadorasRepository: CondensadorasRepository,
    private evaporadorasRepository: EvaporadorasRepository
  ) {}

  // Executando o service
  async execute(request: UpdateManutencaoRequest) {
    
    // Dados do service
    const { id, tipo, status, tec_responsavel, custo, previsao_termino, id_condensadora, id_evaporadora, item_array, descricao_array, item_preventiva, tarefas_array } = request;

    // Vamos verificar se a manutenção que queremos atualizar existe de fato
    // Variável de controle para a manutencao_atual
    let manutencao_atual = await this.manutencoesRepository.find({ id });
    if (!manutencao_atual) {
        return new Error("Manutenção inexistente!")
    }

    // Variáveis de controle para salvarmos a condensadora e evaporadaora, caso existam;
    // Elas iniciam como "undefined". Porém, caso após a seguinte verificação, constatarmos que elas existem, deixam de ser undefined;
    let condensadora, evaporadora, condensadora_nova, evaporadora_nova;

    // Se o usuário inseriu o id_condensadora, precisamos verificar se o id corresponde a uma condensadora existente
    if (id_condensadora) {

        // Buscando se a condensadora nova existe...
        condensadora_nova = await this.condensadorasRepository.find({ id: id_condensadora });

        // Se ela não existir, retorna um erro
        if (!condensadora_nova) {
            return new Error("Condensadora inexistente!")
        }
    }

    // O mesmo para a evaporadora ...
    if (id_evaporadora) {

        // Buscando ...
        evaporadora_nova = await this.evaporadorasRepository.find({ id: id_evaporadora });

        // Se ela não existir, retorna um erro
        if (!evaporadora_nova) {
            return new Error("Evaporadora inexistente!")
        }
    }

    const data = new Date(Object(previsao_termino))

    let custo_final = custo;
    if (custo) {
        custo_final = +custo;
    }

    // Atualizando a manutenção...
    const manutencao = await this.manutencoesRepository.update({
        id,
        tipo, 
        status, 
        tec_responsavel, 
        custo: custo_final, 
        previsao_termino:data, 
        id_condensadora, 
        id_evaporadora
    })

    // Agora vamos para a divisão ...
    // MANUTENÇÃO CORRETIVA ################################################################################################################
    if (tipo == "corretiva") {

        // Se ela é corretiva, então significa dizer que os DISPOSITIVOS e EQUIPAMENTOS os quais iremos realizar a manutenção estão defeituosos
        // Então iremos alterar seus status

        // Se ela tiver inserido uma condensadora nova, iremos alterar o status da antiga
        if (condensadora_nova) {
            // Se a condensadora nova não existir, ela não irá chegar neste ponto, pois a verificação de segurança já nos garante isso
            // Vamos salvar o seu status antigo
            const status_anterior = Object(condensadora_nova).status;
            
            // Então alteramos seu status atual para "defeito"
            await this.condensadorasRepository.update({
                id: Object(condensadora_nova).id,
                status: "defeito",
                status_anterior
            })

            // Agora iremos verificar se a manutenção atual possui alguma condensadora
            if (manutencao_atual) {
                condensadora = await this.condensadorasRepository.find({ id: Object(manutencao_atual).id_condensadora })

                // Se ela tiver ...
                if(condensadora) {
                    // ... Iremos reverter o status atual para o anterior
                    await this.condensadorasRepository.update({
                        id: Object(condensadora).id,
                        status: Object(condensadora).status_anterior
                    })
                }
            }
        }

        // O mesmo vale para evaporadora
        // Se ela tiver inserido uma evaporadora nova, iremos alterar o status da antiga
        if (evaporadora_nova) {

            // Status antigo
            const status_anterior = Object(evaporadora_nova).status;

            // Se existe, então alteramos seu status para "defeito"
            await this.evaporadorasRepository.update({
                id: Object(evaporadora_nova).id,
                status: "defeito",
                status_anterior
            })

            // Agora iremos verificar se a manutenção atual possui alguma evaporadora
            if (manutencao_atual) {
                evaporadora = await this.evaporadorasRepository.find({ id: Object(manutencao_atual).id_evaporadora })

                // Se ela tiver ...
                if(evaporadora) {
                    // ... Iremos reverter o status atual para o anterior
                    await this.evaporadorasRepository.update({
                        id: Object(evaporadora).id,
                        status: Object(evaporadora).status_anterior
                    })
                }
            }        
        }

        // Criando a manutenção CORRETIVA
        // Seu funcionamento dá-se da seguinte maneira:
        // Os itens selecionados vem em uma lista, onde os iremos percorrer e criar uma nova manutenção CORRETIVA para cada item

        // Variável de controle
        let i = 0;

        // Verificando se os itens da corretiva foram inseridos
        if (item_array) {

            // Percorrendo os itens
            for (let id_item of item_array) {
                
                // Pegando o id da manutenção e a descrição do item
                const id_manutencao = Object(manutencao).id;
                
                if (descricao_array) {
                    const descricao = descricao_array[i];

                    i =+1;

                    try {
                        // Criando a manutenção corretiva
                        const manutencao_corretiva = await this.manutecoesCorretivasRepository.create({
                            id_manutencao,
                            id_item,
                            descricao,
                            previsao_termino:data
                        })
                    } catch (err) {
                        return err;
                    }
                }
            }
        }
    }

    // MANUTENÇÃO PREVENTIVA ################################################################################################################
    if (tipo == "preventiva") {

        // Se ela é PREVENTIVA, então ela não está com defeito. Apenas é realizada a fim de evitar os possíveis defeitos.
        // Logo, não há necessidade de alterar seu status

        //  A manutenção preventiva acontece mediante as tarefas que são realizadas na manutenção
        // Cada tarefa possui um período específico

        // As tarefas vem em um array e iremos percorrer este array para criar as manutenções PREVENTIVAS
        
        // Verificando se os itens da preventiva foram inseridos
        if (tarefas_array) {

            // Percorrendo cada tarefa por vez
            for (let id_tarefa of tarefas_array) {
                
                // Pegando o id da manutenção e o item o qual possui as tarefas a serem realizadas no mesmo
                const id_manutencao = Object(manutencao).id;

                // Verificação de segurança para caso o item tenha sido enviado
                if (item_preventiva) {

                    // Criando a manutenção preventiva
                    try {
                        const manutencao_preventiva = await this.manutencoesPreventivasRepository.create({
                            id_manutencao,
                            id_tarefa,
                            id_item:item_preventiva,
                            previsao_termino:data
                        })
                    } catch (err) {
                        return err;
                    }
                }
            }
        }
    }

    // Retornando a manutenção criada para o controller
    return manutencao;

  }
}