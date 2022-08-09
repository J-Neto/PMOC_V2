import { Request, Response } from "express";
import { PrismaManutencoesRepository } from "../../repositories/prisma/manutencoes/prisma-manutencoes-repository";
import { ScheduleManutencaoService } from "../../services/manutencoes/ScheduleManutencaoService";

class ScheduleManutencaoController {
  async handle(req:Request, res:Response) {

    // Repositório do modelo do Prisma
    const prismaManutencoesRepository = new PrismaManutencoesRepository();
    
    // Service 
    const scheduleManutencaoService = new ScheduleManutencaoService(prismaManutencoesRepository);

    // Executando o service
    const manutencaoAgendada = await scheduleManutencaoService.execute();

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(manutencaoAgendada instanceof Error) {
      return res.status(400).send(manutencaoAgendada.message);
    }

    // Retorna a manutenção agendada e o http status
    return res.status(204).end();
  }
}

export { ScheduleManutencaoController };