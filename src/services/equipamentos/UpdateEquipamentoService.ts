import { CondensadorasRepository } from "../../repositories/interfaces/condensadoras/condensadoras-repository";
import { EquipamentosRepository, equipamento_status, equipamento_tipo } from "../../repositories/interfaces/equipamentos/equipamentos-repository";
import { EvaporadorasRepository } from "../../repositories/interfaces/evaporadoras/evaporadoras-repository";

// Interface
interface UpdateEquipamentosRequest {
  id: string;
  tipo?: equipamento_tipo;
  linha?: string;
  id_condensadora?: string;
  id_evaporadora?: string;
}

// Service
export class UpdateEquipamentoService {
  
  // Recebendo o repositório no construtor
  constructor(
    private equipamentosRepository: EquipamentosRepository,
    private condensadorasRepository: CondensadorasRepository,
    private evaporadorasRepository: EvaporadorasRepository,
  ) {}

  // Executando o service
  async execute(request: UpdateEquipamentosRequest) {
    
    // Dados do service
    const { id, tipo, linha, id_condensadora, id_evaporadora } = request;

    // Buscando se o id corresponde a algum equipamento existente na base de dados
    const equipamento = await this.equipamentosRepository.find({ id });

    // Se o id não corresponder a nenhum equipamento existente na base de dados ....
    if (!equipamento) {
      return new Error("Equipamento inexistente!")
    }

    // VARIÁVEIS DE CONTROLE A SEREM ATUALIZADAS (OU NÃO) ...
    // Código do equipamento
    let codigo_atualizado = Object(equipamento).codigo;

    // Varivável de controle do tipo (para caso o usuário inserir tipo ou não)
    let tipo_atual = Object(equipamento).tipo;
    
    if (tipo) {
      tipo_atual = tipo;
    }
            
    // Variável de controle do status
    let status = Object(equipamento).status;

    // id_condensadora
    let id_condensadora_atualizada = Object(equipamento).id_condensadora;

    // id_evaporadora
    let id_evaporadora_atualizada = Object(equipamento).id_evaporadora;

    // Se o tipo for VRF ...
    if (tipo_atual == "VRF") {

      // Se ele tiver inserido algum id de condensadora
      if (id_condensadora) {

        // Vamos verificar se ela já está em algum equipamento SPLIT da base de dados ...
        const equipamentoEncontrado = await this.equipamentosRepository.findSPLITByCondensadora({ id_condensadora });

        // Caso esteja, ela não poderá ser inserida, pois dispositivos em equipamentos do tipo SPLIT só podem estar em um equipamento por vez
        // Se o equipamento encontrado for diferente do atual ....
        if (equipamentoEncontrado) {
          if (Object(equipamento).id != Object(equipamentoEncontrado).id) {
            return new Error("Condensadora já cadastrada em outro equipamento!");
          }
        }

        // Caso ela não esteja em nenhum equipamento, então iremos salvar o id da condensadora, buscar a mesma e verificar qual o seu status ...
        id_condensadora_atualizada =  id_condensadora;
        const condensadora = await this.condensadorasRepository.find({ id:id_condensadora });

        // Variável de controle para caso ele insire evaporadora ou não ...
        let evaporadora_id = await this.evaporadorasRepository.find({ id:Object(equipamento).id_evaporadora })
        
        if (id_evaporadora) {
          // Caso ele tenha inserido id da evaporadora também
          evaporadora_id = await this.evaporadorasRepository.find({ id:id_evaporadora});
        }

        // Caso esta condensadora esteja com parado, não importará o status da evaporadora, pois já é o bastante para classificar o status do equipamento como parado
        if (Object(condensadora).status == "parado") {
          status = "parado";
        }

        if (Object(condensadora).status == "defeito") {

          if (evaporadora_id) {}
          // Buscando a evaporadora do equipamento ...
          const evaporadora = await this.evaporadorasRepository.find({ id: evaporadora_id });

          // Verificando o status da evaporadora ...
          // Se for parado, o status a ser atualizado será parado
          if (Object(evaporadora).status == "parado") {
            status = "parado";            
          }
          else {
            status = "defeito";
          }
        }

        // Caso esta condensadora esteja com status normal, então é preciso verificar o status da evaporadora atual do equipamento ...
        if (Object(condensadora).status == "normal") {

          // Buscando a evaporadora do equipamento ...
          const evaporadora = await this.evaporadorasRepository.find({ id: Object(equipamento).id_evaporadora });

          // Verificando o status da evaporadora ...
          // Se for normal, o status a ser atualizado será normal
          if (Object(evaporadora).status == "normal") {
            status = "normal";            
          }

          // Se não for normal, então receberá o status da evaporadora
          else {
            status = Object(evaporadora).status;
          }

          console.log(evaporadora)
        }
      }
    }

    // Se atualmente o tipo for SPLIT ...
    if (tipo_atual == "SPLIT") {

      // Verificar se a condensadora e evaporadora do equipamento já estão em outro dispositivo
      const equipamento_existente_by_condensadora = await this.equipamentosRepository.findByCondensadora({ id_condensadora: Object(equipamento).id_condensadora });
      const equipamento_existente_by_evaporadora = await this.equipamentosRepository.findByEvaporadora({ id_evaporadora: Object(equipamento).id_evaporadora });
      
      if (equipamento_existente_by_condensadora) {
        if (Object(equipamento_existente_by_condensadora).id != Object(equipamento).id) {
          return new Error ("Impossível atualizar o equipamento para SPLIT! A condensadora atual já está em uso por outro equipamento!");
        }
      }

      if (equipamento_existente_by_evaporadora) {
        if (Object(equipamento_existente_by_evaporadora).id != Object(equipamento).id) {
          return new Error ("Impossível atualizar o equipamento para SPLIT! A evaporadora atual já está em uso por outro equipamento!");
        }
      }

      // Se ele tiver inserido algum id de condensadora
      if (id_condensadora) {

        // Precisamos verificar se esta condensadora já está cadastrada em algum outro equipamento, pois SPLIT só permite uma condensadora a uma evaporadora
        const equipamentoEncontrado = await this.equipamentosRepository.findByCondensadora({ id_condensadora });
        
        if (equipamentoEncontrado) {
          // Se o equipamento encontrado for diferente do atual ....
          if (Object(equipamento).id != Object(equipamentoEncontrado).id) {
            return new Error("Condensadora já cadastrada em outro equipamento!");
          }
        }

        
        // Caso ela não esteja em nenhum equipamento, então iremos salvar o id da condensadora, buscar a mesma e verificar qual o seu status ...
        id_condensadora_atualizada =  id_condensadora;
        const condensadora = await this.condensadorasRepository.find({ id:id_condensadora });
  
        console.log(condensadora)

        // Caso esta condensadora esteja com parado, não importará o status da evaporadora, pois já é o bastante para classificar o status do equipamento como parado
        if (Object(condensadora).status == "parado") {
          status = "parado";
        }

        if (Object(condensadora).status == "defeito") {
          // Buscando a evaporadora do equipamento ...
          const evaporadora = await this.evaporadorasRepository.find({ id: Object(equipamento).id_evaporadora });

          // Verificando o status da evaporadora ...
          // Se for parado, o status a ser atualizado será parado
          if (Object(evaporadora).status == "parado") {
            status = "parado";            
          }
          else {
            status = "defeito";
          }
        }
  
        // Caso esta condensadora esteja com status normal, então é preciso verificar o status da evaporadora atual do equipamento ...
        if (Object(condensadora).status == "normal") {
  
          // Buscando a evaporadora do equipamento ...
          const evaporadora = await this.evaporadorasRepository.find({ id: Object(equipamento).id_evaporadora });
  
          // Verificando o status da evaporadora ...
          // Se for normal, o status a ser atualizado será normal
          if (Object(evaporadora).status == "normal") {
            status = "normal";            
          }
  
          // Se não for normal, então receberá o status da evaporadora
          else {
            status = Object(evaporadora).status;
          }
        }
      }
    }

    // A evaporadora só pode estar em ligada a UM dispositivo, então não faz diferença ser VRF ou SPLIT para a verificação, tal como a condensadora
    // Se tiver inserido algum id de evaporadora ...
    if (id_evaporadora) {

      const equipamentoEncontrado = await this.equipamentosRepository.findByEvaporadora({ id_evaporadora });

      // Verifica se ela já está em algum equipamento
      if (equipamentoEncontrado) {

        // Se o equipamento encontrado for diferente do atual ....
        if (Object(equipamento).id != Object(equipamentoEncontrado).id) {
          return new Error("Evaporadora já cadastrada em outro equipamento!");
        }
      }


      // Caso não, salva o id da evaporadora
      id_evaporadora_atualizada =  id_evaporadora;

      codigo_atualizado = Object(equipamentoEncontrado).codigo;
    }

    try {
      // Atualizando ...
      return await this.equipamentosRepository.update({
        id,
        tipo: tipo_atual,
        linha,
        codigo: codigo_atualizado, 
        status: status,
        id_condensadora: id_condensadora_atualizada,
        id_evaporadora: id_evaporadora_atualizada
      })
    } catch (err) {
      return err;
    }
  }
}