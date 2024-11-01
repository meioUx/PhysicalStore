import { Router } from "express";
import { nearbyStores } from "./controllers/stores";

const router = Router();

router.get("/cep/:cep", async (req, res) => {
	const { cep } = req.params
	const data = await nearbyStores(cep)
	res.json(data);
});

export { router };