import { CondensadorasRepository } from "../../repositories/interfaces/condensadoras/condensadoras-repository";
import { EvaporadorasRepository } from "../../repositories/interfaces/evaporadoras/evaporadoras-repository";
import { ManutencoesCorretivasRepository } from "../../repositories/interfaces/manutencoes/manutencoes-corretivas-repository";
import { ManutencoesPreventivasRepository } from "../../repositories/interfaces/manutencoes/manutencoes-preventivas-repository";
import { manutencao_status, manutencao_tipo, ManutencoesRepository } from "../../repositories/interfaces/manutencoes/manutencoes-repository";
import { RelatoriosRepository } from "../../repositories/interfaces/relatorios/relatorios-repository";

// FUNCIONAMENTO DAS MANUTENÇÕES ################################################################################################################
// Inicialmente, o usuário pode decidir realizar a manutenção de apenas uma condensadora, evaporadora ou ambos juntos;

// A manutenção possui dois tipos: CORRETIVAS e PREVENTIVAS ...
//  Corretiva: É realizada somente quando algum defeito acontece e é preciso realizar a sua CORREÇÃO;
//  Preventiva: É realizada periodicamente, conforme o período de cada TAREFA, a fim de evitar/PREVENIR possíveis defeitos em um tempo futuro;

// #############################################################################################################################################

// FUNCIONAMENTO DO CÓDIGO
// Existe uma tabela no banco para as manutenções em geral, onde os dados comuns aos dois tipos são mantidos;
// Existem mais duas tabelas, cada uma referente aos tipos de manutenções mencionados anteriormente (CORRETIVA e PREVENTIVA);
// Em um determinado momento do código, haverá uma divisão onde, a depender do tipo de manutenção, o fluxo correspondente será escolhido;

// Não se preocupe ... o restante do código está comentado para que você, eu do futuro ou outra pessoa totalmente perdida (ainda), consiga entender o que está acontecendo aqui ...
// Então, bora lá ...

// #############################################################################################################################################

// Interface
interface CreateManutencaoRequest {
    tipo: manutencao_tipo;
    status: manutencao_status;
    tec_responsavel: string;
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
export class CreateManutencaoService {
  
  // Recebendo o repositório no construtor
  constructor(
    private manutencoesRepository: ManutencoesRepository,
    private manutecoesCorretivasRepository: ManutencoesCorretivasRepository,
    private manutencoesPreventivasRepository: ManutencoesPreventivasRepository,
    private condensadorasRepository: CondensadorasRepository,
    private evaporadorasRepository: EvaporadorasRepository,
    private relatoriosRepository: RelatoriosRepository
  ) {}

  // Executando o service
  async execute(request: CreateManutencaoRequest) {
    
    // Dados do service
    const { tipo, status, tec_responsavel, custo, previsao_termino, id_condensadora, id_evaporadora, item_array, descricao_array, item_preventiva, tarefas_array } = request;

    // Variáveis de controle para salvarmos a condensadora e evaporadaora, caso existam;
    // Elas iniciam como "undefined". Porém, caso após a seguinte verificação, constatarmos que elas existem, deixam de ser undefined;
    let condensadora, evaporadora;

    // Se o usuário inseriou o id_condensadora, precisamos verificar se o id corresponde a uma condensadora existente
    if (id_condensadora) {

        // Buscando ...
        condensadora = await this.condensadorasRepository.find({ id: id_condensadora });

        // Se ela não existir, retorna um erro
        if (!condensadora) {
            return new Error("Condensadora inexistente!")
        }
    }

    // O mesmo para a evaporadora ...
    if (id_evaporadora) {

        // Buscando ...
        evaporadora = await this.evaporadorasRepository.find({ id: id_evaporadora });

        // Se ela não existir, retorna um erro
        if (!evaporadora) {
            return new Error("Evaporadora inexistente!")
        }
    }

    const data = new Date(Object(previsao_termino))

    // Criando a manutenção...
    const manutencao = await this.manutencoesRepository.create({
        tipo, 
        status, 
        tec_responsavel, 
        custo, 
        previsao_termino:data, 
        id_condensadora, 
        id_evaporadora
    })

    if (manutencao instanceof Error) {
        return new Error("Erro ao criar manutenção");
    }

    // Agora vamos para a divisão ...
    // MANUTENÇÃO CORRETIVA ################################################################################################################
    if (tipo == "corretiva") {

        // Se ela é corretiva, então significa dizer que os DISPOSITIVOS e EQUIPAMENTOS os quais iremos realizar a manutenção estão defeituosos
        // Então iremos alterar seus status

        // Aqui estamos verificando se a condensadora não é undefined, ou seja, utilizando os dados das verificaçoes realizadas anteriormente
        if (condensadora) {

            // Guardaremos o status anterior
            let status_anterior = Object(condensadora).status_anterior;

            // Se estiver com o status "normal", se torna defeito
            if (Object(condensadora).status == "normal") {
                
                // Guardando o status atual que será o antigo
                status_anterior = Object(condensadora).status;

                // Agora vamos alterar seu status
                Object(condensadora).status = "defeito";
            }
            
            // Agora iremos atualizar no banco a condensadora com os novos dados
            try {
                await this.condensadorasRepository.update({
                    id: Object(condensadora).id,
                    status: Object(condensadora).status,
                    status_anterior: status_anterior
                })
            } catch (err) {
                return err;
            }
        }

        // O mesmo vale para evaporadora
        if (evaporadora) {

            // Guardaremos o status anterior
            let status_anterior = Object(evaporadora).status;

            // Se estiver com o status "normal", se torna defeito
            if (Object(evaporadora).status == "normal") {
                
                // Guardando o status atual que será o antigo
                status_anterior = Object(evaporadora).status;

                // Agora vamos alterar seu status
                Object(evaporadora).status = "defeito";
            }

            // Agora vamos alterar seu status
            Object(evaporadora).status = "defeito";

            // Agora iremos atualizar no banco a evaporadora com os novos dados
            try {
                await this.evaporadorasRepository.update({
                    id: Object(evaporadora).id,
                    status: Object(evaporadora).status,
                    status_anterior: status_anterior
                })
            } catch (err) {
                return err;
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