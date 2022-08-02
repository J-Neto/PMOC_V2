import { EvaporadorasRepository, evaporadora_status } from "../../repositories/interfaces/evaporadoras/evaporadoras-repository";

// Interface
interface FindEvaporadoraRequest {
  id: string;
}

// Service
export class FindEvaporadoraService {
  
  // Recebendo o repositório no construtor
  constructor(
    private evaporadorasRepository: EvaporadorasRepository,
  ) {}

  // Executando o service
  async execute(request: FindEvaporadoraRequest) {
    
    // Dados do service
    const { id } = request;

    try {
      // Buscando ...
      const evaporadora = await this.evaporadorasRepository.find({ id });
      return evaporadora

    } catch (err) {
      return new Error("Não existe uma condensadora com este código!");
    }
  }
}