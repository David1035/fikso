const db = require('../config/db');

const getAllForm = (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const stmt = limit
      ? db.prepare("SELECT * FROM Form ORDER BY id DESC LIMIT ?").all(limit)
      : db.prepare("SELECT * FROM Form ORDER BY id DESC").all();
    res.json(stmt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createForm = (req, res) => {
  try {
    const {
      idLlamada, name, documentoIdentidad, observaciones,
      fecha, hora, tiempoPromedio, tipoPlantilla
    } = req.body;

    // ✅ Extraer solo la parte de la fecha (sin hora ni zona)
    const soloFecha = fecha.split('T')[0]; // "2025-06-11T14:31:15.686Z" → "2025-06-11"

    const stmt = db.prepare(`
      INSERT INTO Form (idLlamada, name, documentoIdentidad, observaciones,
        fecha, hora, tiempoPromedio, tipoPlantilla)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      idLlamada, name, documentoIdentidad, observaciones,
      soloFecha, hora, tiempoPromedio, tipoPlantilla
    );

    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el formulario' });
  }
};


const getFormById = (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM Form WHERE id = ?");
    const form = stmt.get(req.params.id);
    if (!form) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar el registro' });
  }
};


const updateForm = (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const keys = Object.keys(data);
    const values = Object.values(data);

    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const stmt = db.prepare(`UPDATE Form SET ${setClause} WHERE id = ?`);
    const result = stmt.run(...values, id);

    if (result.changes === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ message: 'Actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el registro' });
  }
};


const deleteForm = (req, res) => {
  try {
    const stmt = db.prepare("DELETE FROM Form WHERE id = ?");
    const result = stmt.run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ message: 'Registro eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
};


const searchDocumentoForm = (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM Form WHERE documentoIdentidad = ?");
    const forms = stmt.all(req.params.documentoIdentidad);
    if (forms.length === 0) return res.status(404).json({ message: 'No encontrado' });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Error en la búsqueda' });
  }
};

const searchIdLlamadaForm = (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM Form WHERE idLlamada = ?");
    const form = stmt.get(req.params.idLlamada);
    if (!form) return res.status(404).json({ message: 'No encontrado' });
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar ID llamada' });
  }
};


const getAverageTimeToday = (req, res) => {
  try {
    const today = new Date();
    const fechaHoy = today.toISOString().split('T')[0]; // "YYYY-MM-DD"

    const stmt = db.prepare(`
      SELECT tiempoPromedio FROM Form
      WHERE DATE(fecha) = ?
    `);

    const rows = stmt.all(fechaHoy);

    if (rows.length === 0) {
      return res.json({ promedio: 0, message: 'No hay registros para hoy' });
    }

    const total = rows.reduce((acc, item) => acc + item.tiempoPromedio, 0);
    const promedio = total / rows.length;

    res.json({ promedio, registros: rows.length });
  } catch (error) {
    res.status(500).json({ error: 'Error al calcular el promedio diario' });
  }
};


const getAverageTimeByMonth = (req, res) => {
  try {
    const today = new Date();
    const año = today.getFullYear();
    const mes = String(today.getMonth() + 1).padStart(2, '0'); // "01", "02", ...

    const stmt = db.prepare(`
      SELECT tiempoPromedio FROM Form
      WHERE strftime('%Y-%m', fecha) = ?
    `);

    const rows = stmt.all(`${año}-${mes}`); // ejemplo: "2025-06"

    if (rows.length === 0) {
      return res.json({ promedio: 0, message: 'No hay registros este mes' });
    }

    const total = rows.reduce((acc, item) => acc + item.tiempoPromedio, 0);
    const promedio = total / rows.length;

    res.json({ promedio, registros: rows.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al calcular el promedio mensual' });
  }
};



module.exports = { getAllForm, createForm, getFormById, updateForm, deleteForm, searchDocumentoForm, searchIdLlamadaForm, getAverageTimeToday, getAverageTimeByMonth }
