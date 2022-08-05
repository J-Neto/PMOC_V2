import { CondensadorasRepository } from "../../repositories/interfaces/condensadoras/condensadoras-repository";
import { EvaporadorasRepository } from "../../repositories/interfaces/evaporadoras/evaporadoras-repository";
import { ManutencoesCorretivasRepository } from "../../repositories/interfaces/manutencoes/manutencoes-corretivas-repository";
import { ManutencoesPreventivasRepository } from "../../repositories/interfaces/manutencoes/manutencoes-preventivas-repository";
import { manutencao_status, manutencao_tipo, ManutencoesRepository } from "../../repositories/interfaces/manutencoes/manutencoes-repository";

// Service
export class GetManutencoesService {
  
  // Recebendo o repositório no construtor
  constructor(
    private manutencoesRepository: ManutencoesRepository,
  ) {}

  // Executando o service
  async execute() {
    
    const manutencoes = await this.manutencoesRepository.get()

    if (Object(manutencoes).length == 0) {
        return new Error("Nenhuma manutenção criada!");
    }

    // Retornando a manutenção criada para o controller
    return manutencoes;

  }
}