const express = require('express');
const router = express.Router();
const finkitty_controller = require('../controllers/finkitty.controller');

router.get('/test', finkitty_controller.test);
router.get('/models', finkitty_controller.model_list);
router.get('/find', finkitty_controller.model_details);
router.put('/update', finkitty_controller.model_update);
router.post('/create', finkitty_controller.model_create);
router.delete('/delete', finkitty_controller.model_delete);
module.exports = router;
