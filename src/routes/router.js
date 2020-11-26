import express from 'express';
import userController from "../controllers/userController";
import financesController from "../controllers/financesController";

const router = express();

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/createAccount', userController.createUser);

router.post('/createBalance', userController.verifyJWT, financesController.createBalance);
router.put('/updateBalance/:id', userController.verifyJWT, financesController.updateBalance);
router.delete('/removeBalance/:id', userController.verifyJWT, financesController.removeBalance);
router.get('/finances/:yearMonth', userController.verifyJWT, financesController.getFinancesByMonth);
router.get('/oneFinance/:id', userController.verifyJWT, financesController.getOneFinance);
router.get('/finances', userController.verifyJWT, financesController.getFinances);
router.get('/values/:yearMonth', userController.verifyJWT, financesController.values);

export default router;
