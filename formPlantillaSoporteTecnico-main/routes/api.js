const express = require('express');
const router = express.Router();
const { getAllForm, createForm, getFormById, updateForm, deleteForm, searchDocumentoForm, searchIdLlamadaForm, getAllFormLimit, getAverageTimeToday, getAverageTimeByMonth } = require('../controllers/formController');

router.get('/forms', getAllForm)
router.post('/forms', createForm)
router.get('/forms/:id', getFormById)
router.put('/forms/:id', updateForm)
router.delete('/forms/:id', deleteForm)
router.get('/forms/documento/:documentoIdentidad', searchDocumentoForm)
router.get('/forms/llamada/:idLlamada', searchIdLlamadaForm)
router.get('/forms/average/today', getAverageTimeToday)
router.get('/forms/average/month', getAverageTimeByMonth)

module.exports = router;