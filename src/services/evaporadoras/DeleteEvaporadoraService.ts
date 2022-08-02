import { EvaporadorasRepository, evaporadora_status } from "../../repositories/interfaces/evaporadoras/evaporadoras-repository";

// Interface
interface DeleteEvaporadoraRequest {
  id: string;
}

// Service
export class DeleteEvaporadoraService {
  
  // Recebendo o repositório no construtor
  constructor(
    private evaporadorasRepository: EvaporadorasRepository,
  ) {}

  // Executando o service
  async execute(request: DeleteEvaporadoraRequest) {
    
    // Dados do service
    const { id } = request;

    // Se não existir uma condensadora com este id
    if (!(await this.evaporadorasRepository.find({ id }))) {
      return new Error("Não existe uma condensadora com este código!");
    }



    try {
      // Deletando ...
      return await this.evaporadorasRepository.delete({ id });

    } catch (err) {
      return err;
    }
  }
}