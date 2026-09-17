const express = require("express");
const ctrl = require("../controllers/product.controller");
const { authenticate, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", ctrl.list);
router.get("/:id", ctrl.getOne);
router.post("/", authenticate, authorize("ADMIN"), upload.single("image"), ctrl.create);
router.put("/:id", authenticate, authorize("ADMIN"), upload.single("image"), ctrl.update);
router.delete("/:id", authenticate, authorize("ADMIN"), ctrl.remove);

module.exports = router;
