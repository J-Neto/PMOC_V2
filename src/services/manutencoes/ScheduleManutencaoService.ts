import { ManutencoesRepository } from "../../repositories/interfaces/manutencoes/manutencoes-repository";
import { CronJob } from "cron";
import { ManutencoesPreventivasRepository } from "../../repositories/interfaces/manutencoes/manutencoes-preventivas-repository";
import { CondensadorasRepository } from "../../repositories/interfaces/condensadoras/condensadoras-repository";
import { EvaporadorasRepository } from "../../repositories/interfaces/evaporadoras/evaporadoras-repository";

// Service
export class ScheduleManutencaoService {
  
  // Recebendo o repositório no construtor
  constructor(
    private manutencoesRepository: ManutencoesRepository,
  ) {}

  // Executando o service
  async execute() {

    // Verificando se as manutenções existem no banco de dados
    let manutencoes = await this.manutencoesRepository.get();

    if (manutencoes) {
      // Verificando a cada 5 segundos se a data atual é a mesma da do agendamento
      const job = new CronJob(("*/5 * * * * *"), async () => {

        // Buscando as manutenções atualizadas, caso tenha acontecido alguma alteração nas mesmas
        manutencoes = await this.manutencoesRepository.get();

        if (manutencoes) {

        // Percorrendo todas as manutenções criadas
          for (let manutencao of Object(manutencoes)) {
          
          // Verificando se a manutenção está ATRASADA ----------------------------------------------------------------------------------
          // Se a manutenção tiver prazo estipulado
            if (Object(manutencao).previsao_termino) {

              // Data do dia anterior
              const data_dia_anterior = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
              // Desconsiderando as horas
              data_dia_anterior.setHours(0, 0, 0)

              // Data do prazo
              const data_termino = Object(manutencao).previsao_termino;
              // Desconsiderando as horas
              data_termino.setHours(0, 0, 0);

              // Se a manutenção ainda está em EXECUÇÃO e a data de termino for igual ao dia anterior (data que já passou), é porque está atrasado;
              if((data_dia_anterior.toString() == data_termino.toString()) && (manutencao.status == "em execução")) {

                // Atualizando o status
                Object(manutencao).status = "atrasado";
                // Salva no banco 
                await this.manutencoesRepository.update({
                  id: Object(manutencao).id,
                  status: "atrasado"
                })
              }
            }

          // AGENDANDO novas manutenções PREVENTIVAS ------------------------------------------------------------------------------------
          // Caso ela seja PREVENTIVA e já tenha sido REALIZADA;
          // Aqui uma variável de controle é utilizada (manutencao.agendado) para evitar a repetição desnecessária de agendamentos
            if (Object(manutencao).tipo == "preventiva" && Object(manutencao).status == "agendado" && Object(manutencao).agendado == false) {

              // Variável de alerta
              const data_agendado_alerta = Object(manutencao).data_agendado
              // Desconsiderando as horas
              data_agendado_alerta.setHours(0, 0, 0)

              // Criando a data de hoje a 7 dias
              const data_alerta = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

              // Desconsiderando as horas
              data_alerta.setHours(0, 0, 0);

              // Se a data daqui a 7 dias for a mesma do agendamento, ele emite o alerta
              if (data_agendado_alerta.toString() == data_alerta.toString()) {
                console.log(`${new Date().toString()} | A manutenção será iniciada em 1 semana`);
              }

              // Instanciando a data atual e colocando a hora como 0
              const data_atual = new Date();
              data_atual.setHours(0, 0, 0);

              // Pegando a data agendada e colocando a hora como 0
              const data_agendado = Object(manutencao).data_agendado
              data_agendado.setHours(0, 0, 0)

              // Se o dia atual for o mesmo do agendado, cria a nova manutenção PREVENTIVA
              if (data_atual.toString() == data_agendado.toString()) {

                console.log(`${new Date().toString()} | Iniciando a manutenção preventiva`);

                await this.manutencoesRepository.start({
                  id: Object(manutencao).id,
                  status: "execucao",
                  agendado: true
                })
              }
            }
          }
        }
      }, null, true, "America/Sao_Paulo")
    }

    return manutencoes;
  }
}