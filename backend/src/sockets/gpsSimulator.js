// gpsSimulator: periodically emits fake positions for existing vehicles

const faker = require('faker');

module.exports = async function(io, pool) {
  console.log('GPS simulator starting');

  // build an initial list of vehicles from DB
  const res = await pool.query('SELECT id, number FROM vehicles LIMIT 10');
  let vehicles = res.rows;

  // if none, create a few sample vehicles
  if (vehicles.length === 0) {
    const sample = [
      ['001','ABC-1001'],
      ['002','ABC-1002'],
      ['003','ABC-1003']
    ];
    for (const [num, plate] of sample) {
      const r = await pool.query(`INSERT INTO vehicles(number, plate, model, year, km, unit, status) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id, number`, [num, plate, 'Ford Ranger', 2018, 100000, 'RPM', 'Em operação']);
      vehicles.push(r.rows[0]);
    }
  }

  // assign random positions around Blumenau (lat/lng)
  const baseLat = -26.9196; // Blumenau approx
  const baseLng = -49.0710;

  setInterval(() => {
    for (const v of vehicles) {
      const lat = baseLat + (Math.random() - 0.5) * 0.05;
      const lng = baseLng + (Math.random() - 0.5) * 0.05;
      const payload = {
        vehicleId: v.id,
        number: v.number,
        lat, lng,
        speed: Math.floor(Math.random() * 80),
        updatedAt: new Date().toISOString()
      };
      io.emit('vehiclePosition', payload);
    }
  }, 4000);
};
