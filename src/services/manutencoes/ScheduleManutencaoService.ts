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

              // Como eu não consigo comparar se a data x é depois da data y,
              // Então eu vou pegar a data de hoje e tirar um dia,
              // Assim tenho a data de ontem

              // Pego a data do termino e comparo com a data de ontem
              // Se for igual, então eu sei q a data de término era pra ontem e se a manutenção ainda está em execução, 
              // Então está atrasada

              // Ex.: 
              // Término: 25/06/2022
              // Hoje: 26/06/2022
              // Eu sei que o término é no dia anterior
              // Se eu tirar um dia da data de hoje ... (26/06/2022 -1 dia = 25/06/2022)
              // data_dia_anterior = (26/06/2022 -1 dia = 25/06/2022)
              // Então se termino == data_dia_anterior é pq já passou da data?
              // Entendeste??

              // Data do dia anterior
              const data_dia_anterior = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
              // Desconsiderando as horas
              data_dia_anterior.setHours(0, 0, 0)

              // Data do prazo
              const data_termino = Object(manutencao).previsao_termino;
              const data_termino_ontem = new Date(data_termino - 1 * 24 * 60 * 60 * 1000);

              // Desconsiderando as horas
              data_termino.setHours(0, 0, 0);

              // Se a manutenção ainda está em EXECUÇÃO e a data de termino for igual ao dia anterior (data que já passou), é porque está atrasado;
              if((data_dia_anterior.toString() == data_termino.toString()) && (manutencao.status == "execucao")) {

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
              const data_agendado = data_atual
              // const data_agendado = Object(manutencao).data_agendado
              data_agendado.setHours(0, 0, 0)

              // Se o dia atual for o mesmo do agendado, cria a nova manutenção PREVENTIVA
              if (data_atual.toString() == data_agendado.toString()) {

                console.log(`${new Date().toString()} | Iniciando a manutenção preventiva | id: ${Object(manutencao).id}`);

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