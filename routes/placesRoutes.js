import express from 'express';
import {
    getPlaces,
    getPlaceById,
    createPlace,
    updatePlace,
    deletePlace,
} from '../controllers/placesController.js';

const router = express.Router();

router.get('/', getPlaces);
router.get('/:id', getPlaceById);
router.post('/', createPlace);// admin
// router.post('/', autenticateUser, authorize("createAny","place"), createPlace);
router.put('/:id', updatePlace); // admin
router.delete('/:id', deletePlace); // admin

export default router;
