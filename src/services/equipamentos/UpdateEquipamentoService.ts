import { CondensadorasRepository } from "../../repositories/interfaces/condensadoras/condensadoras-repository";
import { EquipamentosRepository, equipamento_tipo } from "../../repositories/interfaces/equipamentos/equipamentos-repository";
import { EvaporadorasRepository } from "../../repositories/interfaces/evaporadoras/evaporadoras-repository";

// ANTES DE TUDO
// VRF permite uma CONDENSADORA estar conectada a várias EVAPORADORAS
// SPLIT permite somente uma CONDENSADORA para uma EVAPORADORA
// Uma EVAPORADORA só pode estar conectada a uma CONDENSADORA, seja VRF ou SPLIT

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

    // EXPLICANDO COMO FUNCIONA ESTE SERVICE

    // O usuário pode decidir atualizar a condensadora, evaporadora, tipo para VRF ou SPLIT
    // Pode decidir atualizar somente um ou quais quiser
    // Precisamos manter a condensadora/evaporadora/tipo original, para caso ele não deseje alterar quaisquer uma dessas;
    // Para isso, utilizaremos algumas VARIÁVEIS DE CONTROLE, para tornar o código mais resiliente e evitar repetição de código ...;
    // Dito isso, vamos lá ...

    //     ⠘⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡜⠀⠀⠀
    // ⠀⠀⠀⠑⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡔⠁⠀⠀⠀
    // ⠀⠀⠀⠀⠈⠢⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠴⠊⠀⠀⠀⠀⠀
    // ⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⢀⣀⣀⣀⣀⣀⡀⠤⠄⠒⠈⠀⠀⠀⠀⠀⠀⠀⠀
    // ⠀⠀⠀⠀⠀⠀⠀⠘⣀⠄⠊⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    // ⠀
    // ⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠛⠛⠋⠉⠈⠉⠉⠉⠉⠛⠻⢿⣿⣿⣿⣿⣿⣿⣿
    // ⣿⣿⣿⣿⣿⡿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⢿⣿⣿⣿⣿
    // ⣿⣿⣿⣿⡏⣀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿
    // ⣿⣿⣿⢏⣴⣿⣷⠀⠀⠀⠀⠀⢾⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿
    // ⣿⣿⣟⣾⣿⡟⠁⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣷⢢⠀⠀⠀⠀⠀⠀⠀⢸⣿
    // ⣿⣿⣿⣿⣟⠀⡴⠄⠀⠀⠀⠀⠀⠀⠙⠻⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⣿
    // ⣿⣿⣿⠟⠻⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠶⢴⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⣿
    // ⣿⣁⡀⠀⠀⢰⢠⣦⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⣿⡄⠀⣴⣶⣿⡄⣿
    // ⣿⡋⠀⠀⠀⠎⢸⣿⡆⠀⠀⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⠗⢘⣿⣟⠛⠿⣼
    // ⣿⣿⠋⢀⡌⢰⣿⡿⢿⡀⠀⠀⠀⠀⠀⠙⠿⣿⣿⣿⣿⣿⡇⠀⢸⣿⣿⣧⢀⣼
    // ⣿⣿⣷⢻⠄⠘⠛⠋⠛⠃⠀⠀⠀⠀⠀⢿⣧⠈⠉⠙⠛⠋⠀⠀⠀⣿⣿⣿⣿⣿
    // ⣿⣿⣧⠀⠈⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠟⠀⠀⠀⠀⢀⢃⠀⠀⢸⣿⣿⣿⣿
    // ⣿⣿⡿⠀⠴⢗⣠⣤⣴⡶⠶⠖⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡸⠀⣿⣿⣿⣿
    // ⣿⣿⣿⡀⢠⣾⣿⠏⠀⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⠉⠀⣿⣿⣿⣿
    // ⣿⣿⣿⣧⠈⢹⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿
    // ⣿⣿⣿⣿⡄⠈⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣴⣾⣿⣿⣿⣿⣿
    // ⣿⣿⣿⣿⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿
    // ⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    // ⣿⣿⣿⣿⣿⣦⣄⣀⣀⣀⣀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡄⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠙⣿⣿⡟⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿
    // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠁⠀⠀⠹⣿⠃⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿
    // ⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⢐⣿⣿⣿⣿⣿⣿⣿⣿⣿
    // ⣿⣿⣿⣿⠿⠛⠉⠉⠁⠀⢻⣿⡇⠀⠀⠀⠀⠀⠀⢀⠈⣿⣿⡿⠉⠛⠛⠛⠉⠉
    // ⣿⡿⠋⠁⠀⠀⢀⣀⣠⡴⣸⣿⣇⡄⠀⠀⠀⠀⢀⡿⠄⠙⠛⠀⣀⣠⣤⣤⠄⠀
  
    // VARIÁVEIS DE CONTROLE #################################################################################################################################################################
    // Todas as variáveis de controle iniciam com o valor atual do equipamento
    // Código do equipamento
    let codigo_equip = Object(equipamento).codigo;

    // Tipo
    let tipo_equip = Object(equipamento).tipo;
    // Se o usuário inserir o tipo, atualiza a variável 
    tipo_equip = tipo ? tipo : tipo_equip;

    // Status
    let status_equip = Object(equipamento).status;


    // // Id condensadora
    let id_condensadora_equip = Object(equipamento).id_condensadora;

    // Buscando a CONDENSADORA do equipamento atual
    let condensadora = await this.condensadorasRepository.find({ id:id_condensadora_equip });

    // Se o usuário inserir o id_condensadora, verifica se ela existe. Caso sim, atualiza a variável 
    if (id_condensadora) {
      
      // Buscando a condensadora inserida pelo usuário
      condensadora = await this.condensadorasRepository.find({ id:id_condensadora });

      // Se ela NÃO existir, retorna ERRO
      if(!condensadora) {
        return new Error("Condensadora inexistente!");
      }

      // Se ela existir, atualiza a a variável
      id_condensadora_equip = id_condensadora;
    }

    
    // // Id evaporadora
    let id_evaporadora_equip = Object(equipamento).id_evaporadora;

    // Como a EVAPORADORA só pode estar conectada a UMA CONDENSADORA, independemente do EQUIPAMENTO ser SPLIT ou VRF ...
    // Iremos logo guardar a evaporadora em uma variável para utilizá-la posteriormente
    // Buscando a EVAPORADORA do equipamento atual
    let evaporadora = await this.evaporadorasRepository.find({ id:id_evaporadora_equip });

    // Se o usuário inserir o id_evaporadora, verifica se ela existe. Caso sim, atualiza a variável 
    if (id_evaporadora) {
      
      // Buscando a evaporadora inserida pelo usuário
      evaporadora = await this.evaporadorasRepository.find({ id:id_evaporadora });
      
      // Se ela NÃO existir, retorna ERRO
      if(!evaporadora) {
        return new Error("Evaporadora inexistente!");
      }

      // Se ela existir, iremos logo verificar se ela está conectada a algum equipamento
      const equipamento_existente_by_evaporadora = await this.equipamentosRepository.findByEvaporadora({ id_evaporadora });
      let equipamento_existente_by_evaporadora_final = [];

      // Excluindo nosso equipamento da lista
      for (let equip of Object(equipamento_existente_by_evaporadora)) {
        if (!(equip.id.includes(Object(equipamento).id))) {
          equipamento_existente_by_evaporadora_final.push(equip);
        }
      }

      // Agora iremos ver se é um equipamente diferente do atual
      if (Object(equipamento_existente_by_evaporadora_final).length > 0 ) {

        // Se for diferente do atual, significa dizer que ela está conectada a outro equipamento, então a atualização não será possível, visto que ...
        // Uma EVAPORADORA só pode estar conectada a um equipamento, independemente deste ser VRF ou SPLIT
          return new Error("Evaporadora já cadastrada em outro equipamento!");
      }

      // Se ela existir e não estiver conectada a outro dispositivo, então está livre. Por fim, atualiza a variável
      id_evaporadora_equip = id_evaporadora;
    }

    // INÍCIO DO PROCESSO #################################################################################################################################################################

    // Se a CONDENSADORA estiver conectada a qualquer equipamento do tipo SPLIT, significa dizer que a mesma está ocupada, então não é possível conectá-la em outro equipamento
    // Isso independe do equipamento ser VRF OU SPLIT
    // Caso a CONDENSADORA não esteja em nenhum equipamento do tipo SPLIT, então está em algum VRF ou está livre. Em ambos os casos, é possível conectá-la em outro equipamento

    // Vamos verificar se a condensadora já está em conectada a algum equipamento SPLIT ...
    const equipamentoEncontrado = await this.equipamentosRepository.findSPLITByCondensadora({ id_condensadora: id_condensadora_equip });

    // Caso seja, iremos verificar se é algum equipamento diferente do atual
    if(equipamentoEncontrado) {

      // Caso seja, retornaremos um erro, pois equipamentos SPLIT só permitem que os dispositivos conectados estejam EXCLUSIVAMENTE conectados neste equipamento
      if (Object(equipamento).id != Object(equipamentoEncontrado).id) {
        return new Error("Condensadora já cadastrada em outro equipamento!");
      }
    }

    // Se o tipo for SPLIT
    if (tipo_equip == "SPLIT") {

      // Precisamos ver se a condensadora já existe em outro equipamento
      let equipamento_existente_by_condensadora = await this.equipamentosRepository.findByCondensadora({ id_condensadora: id_condensadora_equip });      
      let equipamento_existente_by_condensadora_final = [];

      // Excluindo nosso equipamento da lista
      for (let equip of Object(equipamento_existente_by_condensadora)) {
        if (!(equip.id.includes(Object(equipamento).id))) {
          equipamento_existente_by_condensadora_final.push(equip);
        }
      }

      // Agora iremos ver se é um equipamente diferente do atual
      if (Object(equipamento_existente_by_condensadora_final).length > 0 ) {

        // Caso seja, retornaremos um erro, pois equipamentos SPLIT só permitem que os dispositivos conectados estejam EXCLUSIVAMENTE conectados neste equipamento
        return new Error ("Impossível atualizar o equipamento para SPLIT! A condensadora atual já está em uso por outro equipamento!");
      }
    }

    // Por fim, iremos atualizar o status do equipamento com base nos status dos seus dispositivos
    // É importante explicar que o status "parado" possui maior prioridade ...
    // O status "defeito" vem depois
    // "normal" só acontece se ambos CONDENSADORA e EVAPORADORA possuem o status "normal"

    // Para o status "parado" ... se qualquer um tiver o status "parado", este será, independentemente de qual é o status do outro dispositivo
    if (Object(condensadora).status == "parado" || Object(evaporadora).status == "parado") {
      status_equip = "parado";
    }

    // Para o status "normal"  ... se ambos tiverem o mesmo status "normal", este será
    else if (Object(condensadora).status == "normal" && Object(evaporadora).status == "normal") {
      status_equip = "normal";
    }

    // Caso nenhuma destas circunstâncias ocorra, então será "defeito"
    else {
      status_equip = "defeito";
    }

    // Atualizando o código do equipamento com o código da evaporadora
    codigo_equip = Object(evaporadora).codigo

    try {
      // Atualizando ...
      return await this.equipamentosRepository.update({
        id, 
        tipo: tipo_equip,
        linha,
        codigo: codigo_equip,
        status: status_equip,
        id_condensadora: id_condensadora_equip,
        id_evaporadora: id_evaporadora_equip
      });
    } catch (err) {
      return err;
    }
  }
}