const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:S,n,a!r!l&ed92@db.htwrjivyplipyyrlgvdp.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log("=== STARTING CASCADE DELETION TEST ===");
  
  // 1. Initial counts
  const count1 = await pool.query('SELECT COUNT(*) FROM programs');
  const imgCount1 = await pool.query('SELECT COUNT(*) FROM program_images');
  console.log(`[Initial] Programs: ${count1.rows[0].count}, Gallery Images: ${imgCount1.rows[0].count}`);

  // 2. Insert test program
  const resProg = await pool.query(`
    INSERT INTO programs (type, title, description, status) 
    VALUES ('Our Programs', 'Temp Cascade Test Program', 'Verification content story for testing deletion cascade', 'Published') 
    RETURNING id
  `);
  const programId = resProg.rows[0].id;
  console.log(`[Created] Test Program ID: ${programId}`);

  // 3. Insert 20 gallery images referencing the program
  for (let i = 1; i <= 20; i++) {
    await pool.query(`
      INSERT INTO program_images (program_id, image_url) 
      VALUES ($1, $2)
    `, [programId, `https://example.com/gallery/img-${i}.jpg`]);
  }
  console.log(`[Attached] 20 gallery images to program ${programId}`);

  // 4. Counts with test program & gallery items
  const count2 = await pool.query('SELECT COUNT(*) FROM programs');
  const imgCount2 = await pool.query('SELECT COUNT(*) FROM program_images');
  console.log(`[Active] Programs: ${count2.rows[0].count}, Gallery Images: ${imgCount2.rows[0].count}`);

  // 5. Delete program
  console.log(`[Deleting] Triggering DELETE for program ID: ${programId}...`);
  await pool.query('DELETE FROM programs WHERE id = $1', [programId]);

  // 6. Counts after delete
  const count3 = await pool.query('SELECT COUNT(*) FROM programs');
  const imgCount3 = await pool.query('SELECT COUNT(*) FROM program_images');
  console.log(`[Final] Programs: ${count3.rows[0].count}, Gallery Images: ${imgCount3.rows[0].count}`);

  if (count3.rows[0].count === count1.rows[0].count && imgCount3.rows[0].count === imgCount1.rows[0].count) {
    console.log("=========================================");
    console.log("✅ VERIFICATION SUCCESSFUL: CASCADE WORKS!");
    console.log("=========================================");
  } else {
    console.error("❌ VERIFICATION FAILED: Orphan records found!");
  }

  await pool.end();
}

run().catch(err => {
  console.error(err);
  pool.end();
});
