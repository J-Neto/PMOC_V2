import { CondensadorasRepository } from "../../repositories/interfaces/condensadoras/condensadoras-repository";
import { EvaporadorasRepository } from "../../repositories/interfaces/evaporadoras/evaporadoras-repository";
import { ManutencoesCorretivasRepository } from "../../repositories/interfaces/manutencoes/manutencoes-corretivas-repository";
import { ManutencoesPreventivasRepository } from "../../repositories/interfaces/manutencoes/manutencoes-preventivas-repository";
import { ManutencoesRepository } from "../../repositories/interfaces/manutencoes/manutencoes-repository";
import { RelatoriosRepository } from "../../repositories/interfaces/relatorios/relatorios-repository";

// Interface
interface FinishManutencaoRequest {
    id: string;
    finalizado: boolean;
}

// Service
export class FinishManutencaoService {
  
  // Recebendo o repositório no construtor
  constructor(
    private manutencoesRepository: ManutencoesRepository,
    private condensadorasRepository: CondensadorasRepository,
    private evaporadorasRepository: EvaporadorasRepository,
    private manutencoesCorretivasRepository: ManutencoesCorretivasRepository,
    private manutencoesPreventivasRepository: ManutencoesPreventivasRepository

  ) {}

  // Executando o service
  async execute(request: FinishManutencaoRequest) {

    // Dados do service
    const { id, finalizado } = request;

    // Buscando para verificar se a manutenção existe
    const manutencao = await this.manutencoesRepository.find({ id });

    if (!manutencao) {
        return new Error("Manutenção inexistente!");
    }

    // Se finalizado == true
    if (finalizado){
      
      // status
      const status_manu = "realizado";

      // Atualizad o status e salva
      try {
        await this.manutencoesRepository.finish({
          id,
          status: status_manu
        })
      } catch (err) {
        return err;
      }
    
      // Data do termino
      const termino = new Date();

      // Se ela for corretiva, iremos atualizar os status dos dispositivos da manutenção
      if (Object(manutencao).tipo == "corretiva") {
        
        // Buscando todas as manutenções corretivas
        const corretivas = await this.manutencoesCorretivasRepository.findByManutencao({ id_manu: Object(manutencao).id });

        // Percorrendo todas as corretivas
        for (let corretiva of Object(corretivas)) {

          // Atualizando a data de término de cada manutenção
          await this.manutencoesCorretivasRepository.update({
            id: Object(corretiva).id,
            data_termino: termino
          })
        }

        // Verificando se ele tem condensadora
        if (Object(manutencao).id_condensadora) {

          // Buscando ...
          const condensadora = await this.condensadorasRepository.find({ id: Object(manutencao).id_condensadora });

          // Se a condensadora existir
          if (condensadora) {

            // Se o seu status for "defeito", então atualizaremos para normal
            if (Object(condensadora).status == "defeito") {

              // Salvando status atual que será o anterior
              const status_anterior = Object(condensadora).status;
  
              try {
                await this.condensadorasRepository.update({
                  id: Object(condensadora).id,
                  status: "normal",
                  status_anterior
                })
              } catch (err) {
                return err;
              }
            }
          }
        }

        // Verificando se ele tem evaporadora
        if (Object(manutencao).id_evaporadora) {

          // Buscando ...
          const evaporadora = await this.evaporadorasRepository.find({ id: Object(manutencao).id_evaporadora });

          // Se a evaporadora existir
          if (evaporadora) {

            // Se o seu status for "defeito", então atualizaremos para normal
            if (Object(evaporadora).status == "defeito") {

              // Salvando status atual que será o anterior
              const status_anterior = Object(evaporadora).status;
  
              try {
                await this.evaporadorasRepository.update({
                  id: Object(evaporadora).id,
                  status: "normal",
                  status_anterior
                })
              } catch (err) {
                return err;
              }
            }
          }
        }
      }

      // ##########################################################################################################################################
      // Se ela for preventiva ...
      // 1 - Buscaremos todas as preventivas relacionadas
      // 2 - Iremos verificar as frequências das tarefas
      // 3 - Então iremos atualizar o campo "data_agendado" e o status para "agendado"
      // 4 - Por fim, criaremos uma nova manutenção preventiva para cada tarefa de acordo com sua frequência
      // Mais detalhes em cada seção específica do código, rlx ...

      // Se ela for preventiva ...
      if (Object(manutencao).tipo == "preventiva") {

        // Buscando todas as manutenções preventivas
        const preventivas = await this.manutencoesPreventivasRepository.findByManutencao({ id_manu: Object(manutencao).id });
        
        // Percorrendo todas as preventivas
        for (let preventiva of Object(preventivas)) {

          // Atualizando a data de término de cada manutenção
          await this.manutencoesPreventivasRepository.update({
            id: Object(preventiva).id,
            data_termino: termino
          });

          // Se a frequencia da tarefa da manutenção preventiva for mensal
          if (Object(preventiva).tarefa.frequencia == "mensal") {

            // Criando a data do agendamento para o próximo mês
            const agendado = new Date();
            agendado.setMonth(Object(preventiva).data_termino.getMonth() + 1);

            await this.manutencoesPreventivasRepository.update({
              id: Object(preventiva).id,
              data_agendado: agendado,
            })

            // Criando a nova manutenção preventiva AGENDADA
            // Alguns dados permanecem os mesmos da manutenção ATUAL            
            const tipo = Object(manutencao).tipo;
            const status = "agendado";
            const tec_responsavel = Object(manutencao).tec_responsavel;
            const id_condensadora = Object(manutencao).id_condensadora;
            const id_evaporadora = Object(manutencao).id_evaporadora;

            // A seguir, será feito o cálculo para saber o prazo da manutenção ATUAL 
            // Data de quando foi criada
            const p_data_criacao = Object(preventiva).created_at;
            // Data de quando deveria terminar
            const p_previsao_termino = Object(preventiva).previsao_termino;
            // Desconsiderando as horas
            p_data_criacao.setHours(0,0,0);
            p_previsao_termino.setHours(0,0,0);

            // Realizando o cálculo para obtenção do prazo dado para a manutenção ATUAL
            const prazo = Math.abs(((p_data_criacao.getTime() - p_previsao_termino.getTime())/(1000 * 3600 * 24)));

            // Com base no prazo da manutenção atual, estabelecendo o prazo para a NOVA manutenção que será agendada
            const previsao_termino = Object(preventiva).data_agendado;
            previsao_termino.setDate(previsao_termino.getDate() + prazo);

            // Data do agendamento
            const data_agendado = new Date();
            data_agendado.setMonth(data_agendado.getMonth() + 1)

            // Cria a nova manutenção
            const manutencaoNova = await this.manutencoesRepository.create({
              tipo,
              status,
              tec_responsavel,
              id_condensadora,
              id_evaporadora,
              previsao_termino,
              data_agendado
            })

            // Variáveis para a tabela da manutenção PREVENTIVA
            const id_manutencao = Object(manutencaoNova).id;
            const id_item = Object(preventiva).id_item;
            const id_tarefa = Object(preventiva).id_tarefa;

            // Cria uma manutenção preventiva
            const manutencao_preventiva = await this.manutencoesPreventivasRepository.create({
              id_manutencao,
              id_item,
              id_tarefa,
              previsao_termino
            });
          }

          // Se a frequencia da tarefa da manutenção preventiva for trimestral
          if (Object(preventiva).tarefa.frequencia == "trimestral") {

            // Criando a data do agendamento para o próximo mês
            const agendado = new Date();
            agendado.setMonth(Object(preventiva).data_termino.getMonth() + 3);

            await this.manutencoesPreventivasRepository.update({
              id: Object(preventiva).id,
              data_agendado: agendado,
            })

            // Criando a nova manutenção preventiva AGENDADA
            // Alguns dados permanecem os mesmos da manutenção ATUAL            
            const tipo = Object(manutencao).tipo;
            const status = "agendado";
            const tec_responsavel = Object(manutencao).tec_responsavel;
            const id_condensadora = Object(manutencao).id_condensadora;
            const id_evaporadora = Object(manutencao).id_evaporadora;

            // A seguir, será feito o cálculo para saber o prazo da manutenção ATUAL 
            // Data de quando foi criada
            const p_data_criacao = Object(preventiva).created_at;
            // Data de quando deveria terminar
            const p_previsao_termino = Object(preventiva).previsao_termino;
            // Desconsiderando as horas
            p_data_criacao.setHours(0,0,0);
            p_previsao_termino.setHours(0,0,0);

            // Realizando o cálculo para obtenção do prazo dado para a manutenção ATUAL
            const prazo = Math.abs(((p_data_criacao.getTime() - p_previsao_termino.getTime())/(1000 * 3600 * 24)));

            // Com base no prazo da manutenção atual, estabelecendo o prazo para a NOVA manutenção que será agendada
            const previsao_termino = Object(preventiva).data_agendado;
            previsao_termino.setDate(previsao_termino.getDate() + prazo);

            // Data do agendamento
            const data_agendado = new Date();
            data_agendado.setMonth(data_agendado.getMonth() + 3)

            // Cria a nova manutenção
            const manutencaoNova = await this.manutencoesRepository.create({
              tipo,
              status,
              tec_responsavel,
              id_condensadora,
              id_evaporadora,
              previsao_termino,
              data_agendado
            })

            // Variáveis para a tabela da manutenção PREVENTIVA
            const id_manutencao = Object(manutencaoNova).id;
            const id_item = Object(preventiva).id_item;
            const id_tarefa = Object(preventiva).id_tarefa;

            // Cria uma manutenção preventiva
            const manutencao_preventiva = await this.manutencoesPreventivasRepository.create({
              id_manutencao,
              id_item,
              id_tarefa,
              previsao_termino
            });
          }
    
          // Se a frequencia da tarefa da manutenção preventiva for semestral
          if (Object(preventiva).tarefa.frequencia == "semestral") {

            // Criando a data do agendamento para o próximo mês
            const agendado = new Date();
            agendado.setMonth(Object(preventiva).data_termino.getMonth() + 6);

            await this.manutencoesPreventivasRepository.update({
              id: Object(preventiva).id,
              data_agendado: agendado,
            })

            // Criando a nova manutenção preventiva AGENDADA
            // Alguns dados permanecem os mesmos da manutenção ATUAL            
            const tipo = Object(manutencao).tipo;
            const status = "agendado";
            const tec_responsavel = Object(manutencao).tec_responsavel;
            const id_condensadora = Object(manutencao).id_condensadora;
            const id_evaporadora = Object(manutencao).id_evaporadora;

            // A seguir, será feito o cálculo para saber o prazo da manutenção ATUAL 
            // Data de quando foi criada
            const p_data_criacao = Object(preventiva).created_at;
            // Data de quando deveria terminar
            const p_previsao_termino = Object(preventiva).previsao_termino;
            // Desconsiderando as horas
            p_data_criacao.setHours(0,0,0);
            p_previsao_termino.setHours(0,0,0);

            // Realizando o cálculo para obtenção do prazo dado para a manutenção ATUAL
            const prazo = Math.abs(((p_data_criacao.getTime() - p_previsao_termino.getTime())/(1000 * 3600 * 24)));

            // Com base no prazo da manutenção atual, estabelecendo o prazo para a NOVA manutenção que será agendada
            const previsao_termino = Object(preventiva).data_agendado;
            previsao_termino.setDate(previsao_termino.getDate() + prazo);

            // Data do agendamento
            const data_agendado = new Date();
            data_agendado.setMonth(data_agendado.getMonth() + 6)

            // Cria a nova manutenção
            const manutencaoNova = await this.manutencoesRepository.create({
              tipo,
              status,
              tec_responsavel,
              id_condensadora,
              id_evaporadora,
              previsao_termino,
              data_agendado
            })

            // Variáveis para a tabela da manutenção PREVENTIVA
            const id_manutencao = Object(manutencaoNova).id;
            const id_item = Object(preventiva).id_item;
            const id_tarefa = Object(preventiva).id_tarefa;

            // Cria uma manutenção preventiva
            const manutencao_preventiva = await this.manutencoesPreventivasRepository.create({
              id_manutencao,
              id_item,
              id_tarefa,
              previsao_termino
            });
          }

          // Se a frequencia da tarefa da manutenção preventiva for anual
          if (Object(preventiva).tarefa.frequencia == "anual") {

            // Criando a data do agendamento para o próximo mês
            const agendado = new Date();
            agendado.setMonth(Object(preventiva).data_termino.getMonth() + 12);

            await this.manutencoesPreventivasRepository.update({
              id: Object(preventiva).id,
              data_agendado: agendado,
            })

            // Criando a nova manutenção preventiva AGENDADA
            // Alguns dados permanecem os mesmos da manutenção ATUAL            
            const tipo = Object(manutencao).tipo;
            const status = "agendado";
            const tec_responsavel = Object(manutencao).tec_responsavel;
            const id_condensadora = Object(manutencao).id_condensadora;
            const id_evaporadora = Object(manutencao).id_evaporadora;

            // A seguir, será feito o cálculo para saber o prazo da manutenção ATUAL 
            // Data de quando foi criada
            const p_data_criacao = Object(preventiva).created_at;
            // Data de quando deveria terminar
            const p_previsao_termino = Object(preventiva).previsao_termino;
            // Desconsiderando as horas
            p_data_criacao.setHours(0,0,0);
            p_previsao_termino.setHours(0,0,0);

            // Realizando o cálculo para obtenção do prazo dado para a manutenção ATUAL
            const prazo = Math.abs(((p_data_criacao.getTime() - p_previsao_termino.getTime())/(1000 * 3600 * 24)));

            // Com base no prazo da manutenção atual, estabelecendo o prazo para a NOVA manutenção que será agendada
            const previsao_termino = Object(preventiva).data_agendado;
            previsao_termino.setDate(previsao_termino.getDate() + prazo);

            // Data do agendamento
            const data_agendado = new Date();

            data_agendado.setMonth(data_agendado.getMonth() + 12)

            // Cria a nova manutenção
            const manutencaoNova = await this.manutencoesRepository.create({
              tipo,
              status,
              tec_responsavel,
              id_condensadora,
              id_evaporadora,
              previsao_termino,
              data_agendado
            })

            // Variáveis para a tabela da manutenção PREVENTIVA
            const id_manutencao = Object(manutencaoNova).id;
            const id_item = Object(preventiva).id_item;
            const id_tarefa = Object(preventiva).id_tarefa;

            // Cria uma manutenção preventiva
            const manutencao_preventiva = await this.manutencoesPreventivasRepository.create({
              id_manutencao,
              id_item,
              id_tarefa,
              previsao_termino
            });
          }
        }
      }
    }

    // Retornando a manutenção para o controller
    return manutencao;
  }
}