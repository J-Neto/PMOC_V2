import { RelatoriosRepository } from "../../repositories/interfaces/relatorios/relatorios-repository";

// Interface
interface DeleteRelatorioRequest {
  id: string;
}

// Service
export class DeleteRelatorioService {
  
  // Recebendo o repositório no construtor
  constructor(
    private relatoriosRepository: RelatoriosRepository,
  ) {}

  // Executando o service
  async execute(request: DeleteRelatorioRequest) {
    
    // Dados do service
    const { id } = request;

    // Buscando
    const relatorio = await this.relatoriosRepository.find({ id })

    if (relatorio) {
      return new Error("Relatório inexistente!")
    }

    // Deletando ...
    return this.relatoriosRepository.delete({id});
  }
}