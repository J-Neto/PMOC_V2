import { RelatoriosRepository } from "../../repositories/interfaces/relatorios/relatorios-repository";

// Service
export class GetRelatoriosService {
  
  // Recebendo o repositório no construtor
  constructor(
    private relatoriosRepository: RelatoriosRepository,
  ) {}

  // Executando o service
  async execute() {
    
    // Buscando
    const relatorios = await this.relatoriosRepository.get()

    if (Object.keys(relatorios).length == 0) {
      return new Error("Nenhum relatório cadastrado no sistema!")
    }

    // Retornando dados para o controller ...
    return relatorios
  }
}