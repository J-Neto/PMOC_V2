import { CondensadorasRepository } from "../../repositories/interfaces/condensadoras/condensadoras-repository";
import { EquipamentosRepository, equipamento_status, equipamento_tipo } from "../../repositories/interfaces/equipamentos/equipamentos-repository";
import { EvaporadorasRepository } from "../../repositories/interfaces/evaporadoras/evaporadoras-repository";

// Interface
interface CreateEquipamentosRequest {
  tipo: equipamento_tipo;
  linha?: string;
  id_condensadora: string;
  id_evaporadora: string;
}

// Service
export class CreateEquipamentoService {
  
  // Recebendo o repositório no construtor
  constructor(
    private equipamentosRepository: EquipamentosRepository,
    private condensadorasRepository: CondensadorasRepository,
    private evaporadorasRepository: EvaporadorasRepository,
  ) {}

  // Executando o service
  async execute(request: CreateEquipamentosRequest) {
    
    // Dados do service
    const { tipo, linha, id_condensadora, id_evaporadora } = request;

    // Buscando se a condensadora existe ... 
    const condensadora = await this.condensadorasRepository.find({ id:id_condensadora });

    // e caso não exista, retorna erro
    if (!condensadora) {
      return new Error ("Condensadora inexistente");
    }

    // Se o tipo do equipamento for SPLIT ...
    if (tipo == "SPLIT") {

      // Verificando se a condensadora já está em algum equipamento já criado
      if(await this.equipamentosRepository.findByCondensadora({ id_condensadora })) {
        return new Error("Condensadora já cadastrada em algum equipamento!");
      }
    }

    // Se o tipo escolhido pelo usuário do equipamento for VRF ...
    if (tipo == "VRF") {

      // É preciso verificar se a condensadora já está em algum equipamento do tipo SPLIT
      if(await this.equipamentosRepository.findSPLITByCondensadora({ id_condensadora })) {

        // Caso esteja, ela não poderá ser cadastrada, pois dispositivos em equipamentos do tipo SPLIT só podem estar em um equipamento por vez
        return new Error("Condensadora já cadastrada em outro equipamento!");
      }
    }

    // Buscando se a evaporadora existe e caso não exista, retorna erro
    const evaporadora = await this.evaporadorasRepository.find({ id: id_evaporadora })
    
    if (!evaporadora) {
      return new Error("Evaporadora inexistente!");
    }

    // Caso a evaporadora existe, é preciso verificar se ela já está cadastrada em algum outro equipamento
    if (await this.equipamentosRepository.findByEvaporadora({ id_evaporadora })) {
      return new Error("Evaporadora já cadastrada em outro equipamento!");
    }

    // Código do equipamento deve ser o mesmo da evaporadora
    const codigo_evaporadora = Object(evaporadora).codigo;

    // O status do equipamento é definido a partir dos status dos dispositivos que o compõem
    // Portanto, vamos verificar o status da condensadora e evaporadora ...
    let status: equipamento_status;
    status = "normal";

    // Se qualquer uma estiver com status "parado", o equipamento possui o status de "parado"
    if ((Object(condensadora).status == "parado") || (Object(evaporadora).status == "parado")) {
      status = "parado";
    }
    
    // Se ambas estiverem em condições normais, o equipamento possui o status de "normal"
    else if ((Object(condensadora).status == "normal") && (Object(evaporadora).status == "normal")) {
      status = "normal";
    }

    // Se nada disso acontecer, então está com defeito
    else {
      status = "defeito";
    }

    try {
      // Criando ...
      return await this.equipamentosRepository.create({
        tipo,
        linha,
        codigo: codigo_evaporadora, 
        status,
        id_condensadora,
        id_evaporadora
      })
    } catch (err) {
      return err;
    }
  }
}