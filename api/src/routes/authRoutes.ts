import { Router } from 'express'
import { register, login } from '../controller/authController';
import { criarVeiculo, getVeiculos } from '../controller/veiculosController';

const router = Router();
router.post('/register', register)
router.post('/login', login)
router.post('/create/chassi', criarVeiculo)

router.get('/get/veiculos/:idUser', getVeiculos)

export default router;