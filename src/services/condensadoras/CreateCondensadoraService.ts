import { CondensadorasRepository, condensadora_status } from "../../repositories/interfaces/condensadoras/condensadoras-repository";

// Interface
interface CreateCondensadoraRequest {
  codigo: string;
  modelo?: string;
  status: condensadora_status;
  modulo?: string;
  quadro?: string;
  local_instalacao?: string;
}

// Service
export class CreateCondensadoraService {
  
  // Recebendo o repositório no construtor
  constructor(
    private condensadorasRepository: CondensadorasRepository,
  ) {}

  // Executando o service
  async execute(request: CreateCondensadoraRequest) {
    
    // Dados do service
    const { codigo, modelo, status, modulo, quadro, local_instalacao } = request;

    // Se já existir uma condensadora com este código
    if (await this.condensadorasRepository.findByCodigo({ codigo })) {
      return new Error("O campo nome é obrigatório!");
    }

    try {
      // Criando ...
      await this.condensadorasRepository.create({
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