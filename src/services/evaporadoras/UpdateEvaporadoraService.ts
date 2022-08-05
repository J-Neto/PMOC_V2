import { EvaporadorasRepository, evaporadora_status } from "../../repositories/interfaces/evaporadoras/evaporadoras-repository";
import { SalasRepository } from "../../repositories/interfaces/salas/salas-repository";

// Interface
interface UpdateEvaporadoraRequest {
  id: string;
  codigo?: string;
  modelo?: string;
  marca?: string;
  potencia?: number;
  status?: evaporadora_status;
  quadro?: string;
  id_sala?: string;
}

// Service
export class UpdateEvaporadoraService {
  
  // Recebendo o repositório no construtor
  constructor(
    private evaporadorasRepository: EvaporadorasRepository,
    private salasRepository: SalasRepository,
  ) {}

  // Executando o service
  async execute(request: UpdateEvaporadoraRequest) {
    
    // Dados do service
    const { id, codigo, modelo, marca, potencia, status, quadro, id_sala } = request;

    const evaporadora = await this.evaporadorasRepository.find({ id });

    // Se não existir uma evaporadora com este id
    if (!evaporadora) {
      return new Error("Não existe uma evaporadora com este código!");
    }

    // Verificando se a sala existe
    if (id_sala) {
      if (!(await this.salasRepository.find({ id: id_sala }))) {
        return new Error("Sala inexistente!")
      }
    }

    if (codigo) {
      
      // Se já existir uma evaporadora com este código
      if (await this.evaporadorasRepository.findByCodigo({ codigo })) {
        return new Error("Já existe uma evaporadora com este código!");
      }
    }

    // Guardaremos o status anterior
    const status_anterior = Object(evaporadora).status;

    try {
      // Criando ...
      return await this.evaporadorasRepository.update({
        id,
        codigo, 
        modelo, 
        marca,
        potencia,
        status, 
        status_anterior,
        quadro, 
      })
    } catch (err) {
      return err;
    }
  }
}