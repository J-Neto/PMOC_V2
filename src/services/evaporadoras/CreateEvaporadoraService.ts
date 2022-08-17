import { EvaporadorasRepository, evaporadora_status } from "../../repositories/interfaces/evaporadoras/evaporadoras-repository";
import { SalasRepository } from "../../repositories/interfaces/salas/salas-repository";

// Interface
interface CreateEvaporadoraRequest {
  codigo: string;
  modelo?: string;
  marca?: string;
  potencia: number;
  status: evaporadora_status;
  quadro?: string;
  id_sala?: string;
}

// Service
export class CreateEvaporadoraService {
  
  // Recebendo o repositório no construtor
  constructor(
    private evaporadorasRepository: EvaporadorasRepository,
    private salasRepository: SalasRepository,
  ) {}

  // Executando o service
  async execute(request: CreateEvaporadoraRequest) {
    
    // Dados do service
    const { codigo, modelo, marca, potencia, status, quadro, id_sala } = request;

    // Se já existir uma condensadora com este código
    if (await this.evaporadorasRepository.findByCodigo({ codigo })) {
      return new Error("Já existe uma condensadora com este código!");
    }

    // Verificando se a sala existe
    if (id_sala) {
      if (!(await this.salasRepository.find({ id: id_sala }))) {
        return new Error("Sala inexistente!")
      }
    }

    // Convertendo a potencia string para number
    const potencia_final = +potencia;

    try {
      // Criando ...
      return await this.evaporadorasRepository.create({
        codigo, 
        modelo, 
        marca,
        potencia:potencia_final,
        status, 
        quadro, 
        id_sala
      })
    } catch (err) {
      return err;
    }
  }
}