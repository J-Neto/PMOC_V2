import { EquipamentosRepository } from "../../repositories/interfaces/equipamentos/equipamentos-repository";

// Service
export class GetEquipamentosService {
  
  // Recebendo o repositório no construtor
  constructor(
    private equipamentosRepository: EquipamentosRepository,
  ) {}

  // Executando o service
  async execute() {
    
    // Buscando...
    const equipamentos = await this.equipamentosRepository.get();

    // Se o id não corresponder a nenhum equipamento existente na base de dados ....
    if (Object(equipamentos).length == 0 ) {
      return new Error("Equipamentos inexistentes!")
    }

    // Retornando para o controller
    return equipamentos;
  }
}