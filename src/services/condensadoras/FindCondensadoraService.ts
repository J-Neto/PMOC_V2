import { CondensadorasRepository, condensadora_status } from "../../repositories/interfaces/condensadoras/condensadoras-repository";

// Interface
interface FindCondensadoraRequest {
  id: string;
}

// Service
export class FindCondensadoraService {
  
  // Recebendo o repositório no construtor
  constructor(
    private condensadorasRepository: CondensadorasRepository,
  ) {}

  // Executando o service
  async  execute(request: FindCondensadoraRequest) {
    
    // Dados do service
    const { id } = request;

    const condensadora = await this.condensadorasRepository.find({ id })

    if (!condensadora) {
      return new Error("Condensadora inexistente!");
    }

    try {
      // Buscando ...
      return condensadora
      
    } catch (err) {
      return err;
    }
  }
}