import { Router } from "express";
import * as controller from "./expense.controller";

const router = Router();

router.post("/", controller.create);
router.post("/:id/submit", controller.submit);
router.post("/:id/approve", controller.approve);
router.post("/:id/pay", controller.pay);

export default router;