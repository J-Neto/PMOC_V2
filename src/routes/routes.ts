import { Router } from "express";
import { CreateItemController } from "../controllers/itens/CreateItemController";
import { DeleteItemController } from "../controllers/itens/DeleteItemController";
import { FindItemController } from "../controllers/itens/FindItemController";
import { GetItensController } from "../controllers/itens/GetItensController";
import { UpdateItemController } from "../controllers/itens/UpdateItemController";

const router = Router();

router
  .route("/")
  .get();

// Secretaria Users
router
  .route("/itens")
  .post(new CreateItemController().handle)
  .get(new GetItensController().handle)

router
  .route("/itens/:id")
  .put(new UpdateItemController().handle)
  .get(new FindItemController().handle)
  .delete(new DeleteItemController().handle)

export { router };
