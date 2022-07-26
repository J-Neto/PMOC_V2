import { Router } from "express";
import { multerConfig } from "../config/multer";
import multer from "multer";

import { CreateCondensadoraController } from "../controllers/condensadoras/CreateCondensadoraController";
import { CreateDocumentoController } from "../controllers/documentos/CreateDocumentoController";
import { CreateItemController } from "../controllers/itens/CreateItemController";
import { DeleteItemController } from "../controllers/itens/DeleteItemController";
import { FindItemController } from "../controllers/itens/FindItemController";
import { GetItensController } from "../controllers/itens/GetItensController";
import { UpdateItemController } from "../controllers/itens/UpdateItemController";
import { GetRelatoriosController } from "../controllers/relatorios/GetRelatoriosController";
import { CreateSalaController } from "../controllers/salas/CreateSalaController";
import { DeleteSalaController } from "../controllers/salas/DeleteSalaController";
import { FindSalaController } from "../controllers/salas/FindSalaController";
import { GetSalasController } from "../controllers/salas/GetSalasController";
import { UpdateSalaController } from "../controllers/salas/UpdateSalaController";
import { CreateSetorController } from "../controllers/setores/CreateSetorController";
import { DeleteSetorController } from "../controllers/setores/DeleteSetorController";
import { FindSetorController } from "../controllers/setores/FindSetorController";
import { GetSetoresController } from "../controllers/setores/GetSetoresController";
import { UpdateSetorController } from "../controllers/setores/UpdateSetorController";
import { CreateTarefaController } from "../controllers/tarefas/CreateTarefaController";
import { DeleteTarefaController } from "../controllers/tarefas/DeleteTarefaController";
import { FindTarefaController } from "../controllers/tarefas/FindTarefaController";
import { GetTarefasByItemController } from "../controllers/tarefas/GetTarefasByItemController";
import { GetTarefasController } from "../controllers/tarefas/GetTarefasController";
import { UpdateTarefaController } from "../controllers/tarefas/UpdateTarefaController";
import { UpdateCondensadoraController } from "../controllers/condensadoras/UpdateCondensadoraController";
import { FindCondensadoraController } from "../controllers/condensadoras/FindCondensadoraController";
import { DeleteCondensadoraController } from "../controllers/condensadoras/DeleteCondensadoraController";
import { GetCondensadorasController } from "../controllers/condensadoras/GetCondensadorasController";
import { CreateEvaporadoraController } from "../controllers/evaporadoras/CreateEvaporadoraController";
import { UpdateEvaporadoraController } from "../controllers/evaporadoras/UpdateEvaporadoraController";
import { FindEvaporadoraController } from "../controllers/evaporadoras/FindEvaporadoraController";
import { DeleteEvaporadoraController } from "../controllers/evaporadoras/DeleteEvaporadoraController";
import { GetEvaporadorasController } from "../controllers/evaporadoras/GetEvaporadorasController";
import { CreateEquipamentoController } from "../controllers/equipamentos/CreateEquipamentoController";
import { UpdateEquipamentoController } from "../controllers/equipamentos/UpdateEquipamentoController";
import { FindEquipamentoController } from "../controllers/equipamentos/FindEquipamentoController";
import { DeleteEquipamentoController } from "../controllers/equipamentos/DeleteEquipamentoController";
import { GetEquipamentosController } from "../controllers/equipamentos/GetEquipamentosController";
import { CreateManutencaoController } from "../controllers/manutencoes/CreateManutencaoController";
import { GetManutencoesController } from "../controllers/manutencoes/GetManutencoesController";
import { DeleteManutencaoController } from "../controllers/manutencoes/DeleteManutencaoController";
import { UpdateManutencaoController } from "../controllers/manutencoes/UpdateManutencaoController";
import { StartManutencaoController } from "../controllers/manutencoes/StartManutencaoController";
import { FindManutencaoController } from "../controllers/manutencoes/FindManutencaoController";
import { PauseManutencaoController } from "../controllers/manutencoes/PauseManutencaoController";
import { FinishManutencaoController } from "../controllers/manutencoes/FinishManutencaoController";
import { ScheduleManutencaoController } from "../controllers/manutencoes/ScheduleManutencaoController";
import { CreateUsuarioController } from "../controllers/usuarios/CreateUsuarioController";
import { GetUsuariosController } from "../controllers/usuarios/GetUsuariosController";
import { DeleteUsuarioController } from "../controllers/usuarios/DeleteUsuarioController";
import { UpdateUsuarioController } from "../controllers/usuarios/UpdateUsuarioController";
import { AuthenticateUsuarioController } from "../controllers/usuarios/AuthenticateUsuarioController";
import { DeleteDocumentoController } from "../controllers/documentos/DeleteDocumentoController";
import { GetDocumentosController } from "../controllers/documentos/GetDocumentosController";

const router = Router();

router
  .route("/")
  .get();

// Itens
router
  .route("/itens")
  .post(new CreateItemController().handle)
  .get(new GetItensController().handle)

router
  .route("/itens/:id")
  .put(new UpdateItemController().handle)
  .get(new FindItemController().handle)
  .delete(new DeleteItemController().handle)

// Tarefas
router
  .route("/tarefas")
  .post(new CreateTarefaController().handle)
  .get(new GetTarefasController().handle)

router
  .route("/tarefas/:id")
  .put(new UpdateTarefaController().handle)
  .delete(new DeleteTarefaController().handle)

router
  .route("/tarefas/:id_item")
  .get(new GetTarefasByItemController().handle)

// Setores
router
  .route("/setores")
  .post(new CreateSetorController().handle)
  .get(new GetSetoresController().handle)

router
  .route("/setores/:id")
  .get(new FindSetorController().handle)
  .put(new UpdateSetorController().handle)
  .delete(new DeleteSetorController().handle)

// Salas
router
  .route("/salas")
  .post(new CreateSalaController().handle)
  .get(new GetSalasController().handle)

router
  .route("/salas/:id")
  .put(new UpdateSalaController().handle)
  .get(new FindSalaController().handle)
  .delete(new DeleteSalaController().handle)

// Documentos (Multer) ------------------------------------------
router
  .route("/documentos")
  .post(multer(multerConfig).fields([{name: "file"}, {name: "foto"}]), new CreateDocumentoController().handle)
  .get(new GetDocumentosController().handle)

router
  .route("/documentos/:id")
  .delete(new DeleteDocumentoController().handle)

// Relatórios
router
  .route("/relatorios")
  .get(new GetRelatoriosController().handle)

// Condensadoras
router
  .route("/condensadoras")
  .post(multer(multerConfig).fields([{name: "file"}, {name: "foto"}]), new CreateCondensadoraController().handle)
  .get(new GetCondensadorasController().handle)

router
  .route("/condensadoras/:id")
  .put(multer(multerConfig).fields([{name: "file"}, {name: "foto"}]), new UpdateCondensadoraController().handle)
  .get(new FindCondensadoraController().handle)
  .delete(new DeleteCondensadoraController().handle)
  
// Evaporadoras
router
  .route("/evaporadoras")
  .post(multer(multerConfig).fields([{name: "file"}, {name: "foto"}]), new CreateEvaporadoraController().handle)
  .get(new GetEvaporadorasController().handle)

router
  .route("/evaporadoras/:id")
  .put(multer(multerConfig).fields([{name: "file"}, {name: "foto"}]), new UpdateEvaporadoraController().handle)
  .get(new FindEvaporadoraController().handle)
  .delete(new DeleteEvaporadoraController().handle)

// Equipamentos
router
  .route("/equipamentos")
  .post(new CreateEquipamentoController().handle)
  .get(new GetEquipamentosController().handle)

router
  .route("/equipamentos/:id")
  .put(new UpdateEquipamentoController().handle)
  .get(new FindEquipamentoController().handle)
  .delete(new DeleteEquipamentoController().handle)

// Manutenções
router
  .route("/manutencoes/")
  .post(new CreateManutencaoController().handle)
  .get(new GetManutencoesController().handle)
  
router
  .route("/manutencoes/:id")
  .put(multer(multerConfig).fields([{name: "file"}, {name: "foto"}]), new UpdateManutencaoController().handle)
  .delete(new DeleteManutencaoController().handle)
  .get(new FindManutencaoController().handle)

router
  .route("/manutencoes/:id/iniciar")
  .post(new StartManutencaoController().handle);

router
  .route("/manutencoes/:id/pausar")
  .post(new PauseManutencaoController().handle)

router
  .route("/manutencoes/:id/finalizar")
  .post(new FinishManutencaoController().handle)

router
  .route("/manutencoes_agendamentos")
  .get(new ScheduleManutencaoController().handle)

// Usuários
router
  .route("/usuarios")
  .post(new CreateUsuarioController().handle)
  .get(new GetUsuariosController().handle)

router
  .route("/usuarios/:id")
  .delete(new DeleteUsuarioController().handle)
  .put(new UpdateUsuarioController().handle)

router
  .route("/login")
  .post(new AuthenticateUsuarioController().handle);
  
export { router };
