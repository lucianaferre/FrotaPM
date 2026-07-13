const express = require('express');
const router = express.Router();

// GET /api/vehicles
router.get('/', async (req, res) => {
  const db = req.db;
  try {
    const result = await db.query('SELECT * FROM vehicles ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/vehicles/:id
router.get('/:id', async (req, res) => {
  const db = req.db;
  const id = req.params.id;
  try {
    const r = await db.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    if (r.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/vehicles
router.post('/', async (req, res) => {
  const db = req.db;
  const { number, plate, model, year, km, unit, status, last_review, next_review } = req.body;
  try {
    const r = await db.query(
      `INSERT INTO vehicles (number, plate, model, year, km, unit, status, last_review, next_review)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [number, plate, model, year, km || 0, unit, status || 'Em operação', last_review || null, next_review || null]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/vehicles/:id
router.put('/:id', async (req, res) => {
  const db = req.db;
  const id = req.params.id;
  const fields = req.body;
  const allowed = ['number','plate','model','year','km','unit','status','last_review','next_review'];
  const sets = [];
  const values = [];
  let i = 1;
  for (const k of allowed) {
    if (k in fields) { sets.push(`${k} = $${i}`); values.push(fields[k]); i++; }
  }
  if (sets.length === 0) return res.status(400).json({ error: 'No fields' });
  try {
    const q = `UPDATE vehicles SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`;
    values.push(id);
    const r = await db.query(q, values);
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/vehicles/:id
router.delete('/:id', async (req, res) => {
  const db = req.db;
  const id = req.params.id;
  try {
    await db.query('DELETE FROM vehicles WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
