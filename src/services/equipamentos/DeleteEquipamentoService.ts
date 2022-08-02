import { EquipamentosRepository } from "../../repositories/interfaces/equipamentos/equipamentos-repository";

// Interface
interface DeleteEquipamentosRequest {
  id: string;
}

// Service
export class DeleteEquipamentoService {
  
  // Recebendo o repositório no construtor
  constructor(
    private equipamentosRepository: EquipamentosRepository,
  ) {}

  // Executando o service
  async execute(request: DeleteEquipamentosRequest) {
    
    // Dados do service
    const { id } = request;

    // Buscando se o id corresponde a algum equipamento existente na base de dados
    const equipamento = await this.equipamentosRepository.find({ id });

    // Se o id não corresponder a nenhum equipamento existente na base de dados ....
    if (!equipamento) {
      return new Error("Equipamento inexistente!")
    }

    // Deletando ....
    return this.equipamentosRepository.delete({id});
  }
}