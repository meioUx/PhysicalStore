import { Router } from "express";
import { nearbyStores } from "./controllers/stores";

const router = Router();

router.get("/cep/:cep", async (req, res) => {
	const {cep} = req.params
	const listStores = await nearbyStores('88380000')
	res.json({lista:listStores});
});

export { router };