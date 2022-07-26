import { RelatoriosRepository } from "../../repositories/interfaces/relatorios/relatorios-repository";

// Interface
interface FindRelatorioRequest {
  id: string;
}

// Service
export class FindRelatorioService {
  
  // Recebendo o repositório no construtor
  constructor(
    private relatoriosRepository: RelatoriosRepository,
  ) {}

  // Executando o service
  async execute(request: FindRelatorioRequest) {
    
    // Dados do service
    const { id } = request;

    // Buscando
    const relatorio = await this.relatoriosRepository.find({ id })

    if (relatorio) {
      return new Error("Relatório inexistente!")
    }

    // Retornando dado para o controller ...
    return relatorio
  }
}