import { Router } from 'express';
import requireJwt from '../middlewares/requireJwt';
import * as RewardController from '../controllers/reward.controller';
import { validate } from '../middlewares/validateData';
import { createRewardSchema, updateRewardSchema, getRewardByIdSchema, redeemRewardSchema } from '../schemas/reward.schema';

const router = Router();

// Middleware to authenticate using JWT
// Injects the user into the request
router.use(requireJwt);

// Routes
// Delegates the request to the controller
router.get('/', RewardController.getAll);
router.get('/redeems', RewardController.getAllRedeems);
router.get('/count', RewardController.getCount);
router.get('/:id/redeems', validate(getRewardByIdSchema), RewardController.getAllRedeemsByReward);
router.get('/:id', validate(getRewardByIdSchema), RewardController.getById);
router.post('/', validate(createRewardSchema), RewardController.create);
router.post('/:id/redeem', validate(redeemRewardSchema), RewardController.redeem);
router.put('/:id', validate(updateRewardSchema), RewardController.update);
router.delete('/:id', validate(getRewardByIdSchema), RewardController.remove);

export default router;
