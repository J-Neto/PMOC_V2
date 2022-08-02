import { CondensadorasRepository } from "../../repositories/interfaces/condensadoras/condensadoras-repository";
import { EquipamentosRepository, equipamento_status, equipamento_tipo } from "../../repositories/interfaces/equipamentos/equipamentos-repository";
import { EvaporadorasRepository } from "../../repositories/interfaces/evaporadoras/evaporadoras-repository";

// Interface
interface FindEquipamentosRequest {
  id: string;
}

// Service
export class FindEquipamentoService {
  
  // Recebendo o repositório no construtor
  constructor(
    private equipamentosRepository: EquipamentosRepository,
  ) {}

  // Executando o service
  async execute(request: FindEquipamentosRequest) {
    
    // Dados do service
    const { id } = request;

    // Buscando se o id corresponde a algum equipamento existente na base de dados
    const equipamento = await this.equipamentosRepository.find({ id });

    // Se o id não corresponder a nenhum equipamento existente na base de dados ....
    if (!equipamento) {
      return new Error("Equipamento inexistente!")
    }

    // Retornando para o controller
    return equipamento;
  }
}