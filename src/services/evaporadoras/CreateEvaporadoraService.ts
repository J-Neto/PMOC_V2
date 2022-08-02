import { EvaporadorasRepository, evaporadora_status } from "../../repositories/interfaces/evaporadoras/evaporadoras-repository";

// Interface
interface CreateEvaporadoraRequest {
  codigo: string;
  modelo?: string;
  marca?: string;
  potencia: number;
  status: evaporadora_status;
  quadro?: string;
}

// Service
export class CreateEvaporadoraService {
  
  // Recebendo o repositório no construtor
  constructor(
    private evaporadorasRepository: EvaporadorasRepository,
  ) {}

  // Executando o service
  async execute(request: CreateEvaporadoraRequest) {
    
    // Dados do service
    const { codigo, modelo, marca, potencia, status, quadro } = request;

    // Se já existir uma condensadora com este código
    if (await this.evaporadorasRepository.findByCodigo({ codigo })) {
      return new Error("Já existe uma condensadora com este código!");
    }

    try {
      // Criando ...
      return await this.evaporadorasRepository.create({
        codigo, 
        modelo, 
        marca,
        potencia,
        status, 
        quadro, 
      })
    } catch (err) {
      return err;
    }
  }
}