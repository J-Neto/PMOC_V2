import { CondensadorasRepository, condensadora_status } from "../../repositories/interfaces/condensadoras/condensadoras-repository";

// Interface
interface DeleteCondensadoraRequest {
  id: string;
}

// Service
export class DeleteCondensadoraService {
  
  // Recebendo o repositório no construtor
  constructor(
    private condensadorasRepository: CondensadorasRepository,
  ) {}

  // Executando o service
  async execute(request: DeleteCondensadoraRequest) {
    
    // Dados do service
    const { id } = request;

    const condensadora = await this.condensadorasRepository.find({ id })

    if (!condensadora) {
      return new Error("Condensadora inexistente!");
    }

    try {
      // Deletando ...
      await this.condensadorasRepository.delete({ id });
      
    } catch (err) {
      return err;
    }
  }
}