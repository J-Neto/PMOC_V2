import { TarefasRepository } from "../../repositories/interfaces/tarefas/tarefas-repository";

// Interface
interface DeleteTarefaRequest {
  id: string;
}

// Service
export class DeleteTarefaService {
  
  // Recebendo o repositório no construtor
  constructor(
    private tarefasRepository: TarefasRepository,
  ) {}

  // Executando o service
  async execute(request: DeleteTarefaRequest) {
    
    // Dados do service
    const { id } = request;

    // Buscando ...
    const tarefa = await this.tarefasRepository.find({ id });

    // Se não tiver tenhuma tarefa com esse id
    if(!tarefa) {
      // Retorna erro
      return new Error("Tarefa não existente!");
    }

    // Deletando ...
    return this.tarefasRepository.delete({ id });
  }
}