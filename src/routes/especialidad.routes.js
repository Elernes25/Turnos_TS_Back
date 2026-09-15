const express = require('express');
const router = express.Router();

const {
  getEspecialidades,
  deleteEspecialidad,
  createEspecialidad
} = require('../controllers/especialidad.controller');

router.get('/', getEspecialidades);
router.delete('/:id', deleteEspecialidad);
router.post('/', createEspecialidad);

module.exports = router;