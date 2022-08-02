import { EvaporadorasRepository, evaporadora_status } from "../../repositories/interfaces/evaporadoras/evaporadoras-repository";

// Interface
interface UpdateEvaporadoraRequest {
  id: string;
  codigo?: string;
  modelo?: string;
  marca?: string;
  potencia?: number;
  status?: evaporadora_status;
  quadro?: string;
}

// Service
export class UpdateEvaporadoraService {
  
  // Recebendo o repositório no construtor
  constructor(
    private evaporadorasRepository: EvaporadorasRepository,
  ) {}

  // Executando o service
  async execute(request: UpdateEvaporadoraRequest) {
    
    // Dados do service
    const { id, codigo, modelo, marca, potencia, status, quadro } = request;

    // Se não existir uma evaporadora com este id
    if (!(await this.evaporadorasRepository.find({ id }))) {
      return new Error("Não existe uma evaporadora com este código!");
    }

    if (codigo) {
      
      // Se já existir uma evaporadora com este código
      if (await this.evaporadorasRepository.findByCodigo({ codigo })) {
        return new Error("Já existe uma evaporadora com este código!");
      }
    }

    try {
      // Criando ...
      return await this.evaporadorasRepository.update({
        id,
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