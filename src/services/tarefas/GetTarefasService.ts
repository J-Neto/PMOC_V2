import { TarefasRepository } from "../../repositories/interfaces/tarefas/tarefas-repository";

// Service
export class GetTarefasService {
  
  // Recebendo o repositório no construtor
  constructor(
    private tarefasRepository: TarefasRepository,
  ) {}

  // Executando o service
  async execute() {
    
    // Buscando ...
    const tarefas = await this.tarefasRepository.get();

    // Se não tiver tarefas cadastradas no sistema
    if(Object.keys(tarefas).length == 0) {
      // Retorna erro
      return new Error("Tarefas não existente!");
    }

    // Retornando dado para o controller ...
    return tarefas;
  }
}