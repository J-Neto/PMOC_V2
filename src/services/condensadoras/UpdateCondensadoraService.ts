import { CondensadorasRepository, condensadora_status } from "../../repositories/interfaces/condensadoras/condensadoras-repository";

// Interface
interface UpdateCondensadoraRequest {
  id: string;
  codigo?: string;
  modelo?: string;
  status?: condensadora_status;
  modulo?: string;
  quadro?: string;
  local_instalacao?: string;
}

// Service
export class UpdateCondensadoraService {
  
  // Recebendo o repositório no construtor
  constructor(
    private condensadorasRepository: CondensadorasRepository,
  ) {}

  // Executando o service
  async execute(request: UpdateCondensadoraRequest) {
    
    // Dados do service
    const { id, codigo, modelo, status, modulo, quadro, local_instalacao } = request;

    if (!(await this.condensadorasRepository.find({ id }))) {
      return new Error("Condensadora inexistente!");
    }

    if (codigo) {
      
      // Se já existir uma condensadora com este código
      if (await this.condensadorasRepository.findByCodigo({ codigo })) {
        return new Error("Condensadora já existente!");
      }
    }

    try {
      // Criando ...
      await this.condensadorasRepository.update({
        id,
        codigo, 
        modelo, 
        status, 
        modulo, 
        quadro, 
        local_instalacao
      })
    } catch (err) {
      return err;
    }
  }
}