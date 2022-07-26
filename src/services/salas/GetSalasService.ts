import { SalasRepository } from "../../repositories/interfaces/salas/salas-repository";

// Service
export class GetSalasService {
  
  // Recebendo o repositório no construtor
  constructor(
    private salasRepository: SalasRepository,
  ) {}

  // Executando o service
  async execute() {
    
    // Buscando...
    const salas = await this.salasRepository.get()

    // Se a sala não existe, retorna erro
    if(Object.keys(salas).length == 0) {
      return new Error("Nenhuma sala no sistema!")
    }

    // Atualizando ...
    return salas;
  }
}