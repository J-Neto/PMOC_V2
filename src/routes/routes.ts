import { Router } from "express";
import { CreateCondensadoraController } from "../controllers/condensadoras/CreateCondensadoraController";
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

// Relatórios
router
  .route("/relatorios")
  .get(new GetRelatoriosController().handle)

// Condensadoras
router
  .route("/condensadoras")
  .post(new CreateCondensadoraController().handle)
  
export { router };
