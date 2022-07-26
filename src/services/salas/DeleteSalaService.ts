import { SalasRepository } from "../../repositories/interfaces/salas/salas-repository";

// Interface
interface DeleteSalaRequest {
  id: string;
}

// Service
export class DeleteSalaService {
  
  // Recebendo o repositório no construtor
  constructor(
    private salasRepository: SalasRepository,
  ) {}

  // Executando o service
  async execute(request: DeleteSalaRequest) {
    
    // Dados do service
    const { id } = request;

    // Buscando...
    const sala = await this.salasRepository.find({ id })

    // Se a sala não existe, retorna erro
    if(!sala) {
      return new Error("Sala não existente!")
    }

    // Atualizando ...
    return this.salasRepository.delete({ id });
  }
}