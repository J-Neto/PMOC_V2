import { TarefasRepository } from "../../repositories/interfaces/tarefas/tarefas-repository";

// Interface
interface FindTarefaRequest {
  id: string;
}

// Service
export class FindTarefaService {
  
  // Recebendo o repositório no construtor
  constructor(
    private tarefasRepository: TarefasRepository,
  ) {}

  // Executando o service
  async execute(request: FindTarefaRequest) {
    
    // Dados do service
    const { id } = request;

    // Buscando ...
    const tarefa = await this.tarefasRepository.find({ id });

    // Se não tiver tenhuma tarefa com esse id
    if(!tarefa) {
      // Retorna erro
      return new Error("Tarefa não existente!");
    }

    // Retornando dado para o controller ...
    return tarefa;
  }
}