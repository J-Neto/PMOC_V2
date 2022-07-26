import { RelatoriosRepository } from "../../repositories/interfaces/relatorios/relatorios-repository";

// Interface
interface CreateRelatorioRequest {
  id_entidade: string;
  acao: string;
  comentario?: string;
}

// Service
export class CreateRelatorioService {
  
  // Recebendo o repositório no construtor
  constructor(
    private relatoriosRepository: RelatoriosRepository,
  ) {}

  // Executando o service
  async execute(request: CreateRelatorioRequest) {
    
    // Dados do service
    const { id_entidade, acao, comentario } = request;

    // Se o usuário não inserir nome
    if (!id_entidade || !acao) {
      return new Error("Insira os campos obrigatórios!");
    }

    // Criando ...
    await this.relatoriosRepository.create({
      id_entidade,
      acao,
      comentario
    })
  }
}