import { RelatoriosRepository } from "../../repositories/interfaces/relatorios/relatorios-repository";

// Interface
interface UpdateRelatorioRequest {
  id: string;
  id_entidade?: string;
  acao?: string;
  comentario?: string;
}

// Service
export class UpdateRelatorioService {
  
  // Recebendo o repositório no construtor
  constructor(
    private relatoriosRepository: RelatoriosRepository,
  ) {}

  // Executando o service
  async execute(request: UpdateRelatorioRequest) {
    
    // Dados do service
    const { id, id_entidade, acao, comentario } = request;

    if (!(await this.relatoriosRepository.find({ id }))) {
      return new Error("Relatório inexistente!")
    }

    // Criando ...
    await this.relatoriosRepository.update({
      id,
      id_entidade,
      acao,
      comentario
    })
  }
}