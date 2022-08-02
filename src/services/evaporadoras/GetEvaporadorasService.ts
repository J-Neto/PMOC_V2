import { EvaporadorasRepository, evaporadora_status } from "../../repositories/interfaces/evaporadoras/evaporadoras-repository";

// Service
export class GetEvaporadorasService {
  
  // Recebendo o repositório no construtor
  constructor(
    private evaporadorasRepository: EvaporadorasRepository,
  ) {}

  // Executando o service
  async execute() {
    
    const evaporadoras = await this.evaporadorasRepository.get();

    // Se não existir item
    if (Object.keys(evaporadoras).length == 0) {
      return new Error("Nenhuma evaporadora cadastrado!")
    } 

    return evaporadoras;
  }
}