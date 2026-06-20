import { db } from './src/database';
import { logger } from './src/utils/logger';

async function deleteDonors() {
  const emailsToDelete = [
    'testdonor@example.com',
    'azrafkhanzarif@gmail.com',
    'charlesmnet17@gmail.com',
    'bob@example.com'
  ];

  try {
    for (const email of emailsToDelete) {
      const res = await db.query('DELETE FROM donors WHERE email = $1', [email]);
      logger.info(`Deleted ${res.rowCount} donors with email ${email}`);
    }
  } catch (err) {
    logger.error('Error deleting donors:', err);
  } finally {
    process.exit(0);
  }
}

deleteDonors();
