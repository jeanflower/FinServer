const express = require('express');
const router = express.Router();
const finkitty_controller = require('../controllers/finkitty.controller');

router.get('/test', finkitty_controller.test);
router.post('/create', finkitty_controller.model_create);
router.get('/find', finkitty_controller.model_details);
router.get('/models', finkitty_controller.model_list);
router.put('/update', finkitty_controller.model_update);
router.delete('/delete', finkitty_controller.model_delete);
module.exports = router;
