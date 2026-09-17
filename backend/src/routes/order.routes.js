const express = require("express");
const ctrl = require("../controllers/order.controller");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.post("/", ctrl.create);
router.get("/mine", ctrl.listMine);
router.get("/", authorize("ADMIN"), ctrl.listAll);
router.get("/:id", ctrl.getOne);
router.patch("/:id/status", authorize("ADMIN"), ctrl.updateStatus);

module.exports = router;
