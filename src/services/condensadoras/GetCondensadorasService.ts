import { CondensadorasRepository, condensadora_status } from "../../repositories/interfaces/condensadoras/condensadoras-repository";

// Service
export class GetCondensadorasService {
  
  // Recebendo o repositório no construtor
  constructor(
    private condensadorasRepository: CondensadorasRepository,
  ) {}

  // Executando o service
  async execute() {
    
    const condensadoras = await this.condensadorasRepository.get();

    // Se não existir condensadora
    if (Object.keys(condensadoras).length == 0) {
      return new Error("Nenhuma condensadora cadastrada!")
    } 

    try {
      // Buscando ...
      return condensadoras
      
    } catch (err) {
      return err;
    }
  }
}