'use server'
import pg from 'pg';
import { AuthTypes, Connector } from '@google-cloud/cloud-sql-connector';
import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth();
const { Pool } = pg;

// Types
export type ApplicationStatus = 'PROCESSED' | 'NOT_PROCESSED';
export type ApplicationType = 'ApplicationForLoan' | 'UnsecuredLoansApplication' | 'SpecialLoansApplication';

export type Application = {
  id: string;
  applicationType: ApplicationType;
  formData: Record<string, string>;
  processed: boolean;
  dateSubmitted: string;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationFilter = {
  applicationType?: ApplicationType | 'ALL';
  processed?: boolean | 'ALL';
  limit?: number;
  offset?: number;
};

// Database connection setup
let pool: pg.Pool | null = null;

async function getPool(): Promise<pg.Pool> {
  if (pool) return pool;

  try {
    const projectId = await auth.getProjectId();
    
    console.log(`Connecting to database - Project ID: ${projectId}`);

    const connector = new Connector();
    const clientOpts = await connector.getOptions({
      instanceConnectionName: `${projectId}:asia-southeast1:dlscc-db`,
      authType: AuthTypes.IAM,
    });

    pool = new Pool({
      ...clientOpts,
      user: `cloud-data@${projectId}.iam`,
      database: "dlscc-applications",
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
    });

    // Test the connection
    const client = await pool.connect();
    client.release();
    
    console.log('Database connection established successfully');
    return pool;
  } catch (error) {
    console.error('Failed to establish database connection:', error);
    throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Generate a unique 6-character ID
function generateRandomId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Check if ID exists in database
async function isIdUnique(id: string): Promise<boolean> {
  const pool = await getPool();
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      'SELECT COUNT(*) FROM applications WHERE id = $1',
      [id]
    );
    return parseInt(result.rows[0].count) === 0;
  } finally {
    client.release();
  }
}

// Generate a unique ID
async function generateUniqueId(): Promise<string> {
  let id: string;
  let isUnique: boolean;
  
  do {
    id = generateRandomId();
    isUnique = await isIdUnique(id);
  } while (!isUnique);
  
  return id;
}

// Table creation with improved schema
const ensureTablesExist = async (): Promise<void> => {
  const pool = await getPool();
  const client = await pool.connect();
  
  try {
    // First, check if applications table exists and get its structure
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'applications'
      );
    `);

    if (tableExists.rows[0].exists) {
      // Check if ID column is still integer type
      const columnInfo = await client.query(`
        SELECT data_type 
        FROM information_schema.columns 
        WHERE table_name = 'applications' 
        AND column_name = 'id'
        AND table_schema = 'public';
      `);

      if (columnInfo.rows.length > 0 && columnInfo.rows[0].data_type === 'integer') {
        console.log('Converting applications table ID from integer to varchar...');
        
        // Drop existing table and recreate with correct schema
        // This is safe for development, but in production you'd want a proper migration
        await client.query('DROP TABLE IF EXISTS applications CASCADE;');
        console.log('Dropped existing applications table with integer ID');
      }
    }

    // Create applications table with VARCHAR ID
    await client.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id VARCHAR(6) PRIMARY KEY,
        application_type VARCHAR(50) NOT NULL CHECK (application_type IN ('ApplicationForLoan', 'UnsecuredLoansApplication', 'SpecialLoansApplication')),
        form_data JSONB NOT NULL,
        processed BOOLEAN NOT NULL DEFAULT FALSE,
        date_submitted TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    console.log('Applications table created/verified with VARCHAR(6) ID');

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_applications_type ON applications(application_type);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_applications_processed ON applications(processed);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_applications_date_submitted ON applications(date_submitted);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_applications_composite ON applications(application_type, processed, date_submitted);
    `);

    // Create trigger for updated_at
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
      CREATE TRIGGER update_applications_updated_at
        BEFORE UPDATE ON applications
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('Database tables and indexes created/verified successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Helper function to normalize form data
function normalizeFormData(formData: Record<string, string>): Record<string, string> {
  const normalized: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(formData)) {
    // Convert empty strings to "N/A"
    normalized[key] = value && value.trim() !== '' ? value.trim() : 'N/A';
  }
  
  return normalized;
}

// CREATE - Submit a new application
export async function submitApplication(
  applicationType: ApplicationType,
  formData: Record<string, string>
): Promise<string> {
  if (!applicationType || !formData) {
    throw new Error('Application type and form data are required');
  }

  // Validate application type
  const validTypes: ApplicationType[] = ['ApplicationForLoan', 'UnsecuredLoansApplication', 'SpecialLoansApplication'];
  if (!validTypes.includes(applicationType)) {
    throw new Error(`Invalid application type: ${applicationType}`);
  }

  await ensureTablesExist();
  const pool = await getPool();
  const client = await pool.connect();

  try {
    // Generate unique ID
    const uniqueId = await generateUniqueId();
    
    // Normalize form data to replace empty strings with "N/A"
    const normalizedFormData = normalizeFormData(formData);

    const result = await client.query(
      `INSERT INTO applications(id, application_type, form_data, date_submitted) 
       VALUES($1, $2, $3, NOW()) 
       RETURNING id`,
      [uniqueId, applicationType, JSON.stringify(normalizedFormData)]
    );

    const applicationId = result.rows[0].id;
    console.log(`Application submitted successfully with ID: ${applicationId}`);
    return applicationId;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw new Error(`Failed to submit application: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    client.release();
  }
}

// READ - Get applications with filtering and pagination
export async function getApplications(filter: ApplicationFilter = {}): Promise<Application[]> {
  await ensureTablesExist();
  const pool = await getPool();
  const client = await pool.connect();

  try {
    let query = `
      SELECT 
        id,
        application_type as "applicationType",
        form_data as "formData",
        processed,
        date_submitted as "dateSubmitted",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM applications
      WHERE 1=1
    `;
    
    const params: unknown[] = [];
    let paramIndex = 1;

    // Apply filters
    if (filter.applicationType && filter.applicationType !== 'ALL') {
      query += ` AND application_type = $${paramIndex}`;
      params.push(filter.applicationType);
      paramIndex++;
    }

    if (filter.processed !== undefined && filter.processed !== 'ALL') {
      query += ` AND processed = $${paramIndex}`;
      params.push(filter.processed);
      paramIndex++;
    }

    // Order by processed status (false first) and then by date_submitted (oldest first)
    query += ` ORDER BY processed ASC, date_submitted ASC`;

    // Apply pagination
    if (filter.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(filter.limit);
      paramIndex++;
    }

    if (filter.offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(filter.offset);
      paramIndex++;
    }

    const result = await client.query(query, params);
    return result.rows.map(row => ({
      ...row,
      id: row.id, // ID is already a string now
      formData: typeof row.formData === 'string' ? JSON.parse(row.formData) : row.formData,
      dateSubmitted: row.dateSubmitted.toISOString(),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw new Error(`Failed to fetch applications: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    client.release();
  }
}

// READ - Get a single application by ID
export async function getApplicationById(id: string): Promise<Application | null> {
  if (!id || id.length !== 6) {
    throw new Error('Valid 6-character application ID is required');
  }

  await ensureTablesExist();
  const pool = await getPool();
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT 
        id,
        application_type as "applicationType",
        form_data as "formData",
        processed,
        date_submitted as "dateSubmitted",
        created_at as "createdAt",
        updated_at as "updatedAt"
       FROM applications 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      ...row,
      id: row.id, // ID is already a string now
      formData: typeof row.formData === 'string' ? JSON.parse(row.formData) : row.formData,
      dateSubmitted: row.dateSubmitted.toISOString(),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching application by ID:', error);
    throw new Error(`Failed to fetch application: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    client.release();
  }
}

// UPDATE - Update an application
export async function updateApplication(
  id: string,
  updates: {
    formData?: Record<string, string>;
    processed?: boolean;
  }
): Promise<void> {
  if (!id || id.length !== 6) {
    throw new Error('Valid 6-character application ID is required');
  }

  if (!updates.formData && updates.processed === undefined) {
    throw new Error('At least one field must be updated');
  }

  await ensureTablesExist();
  const pool = await getPool();
  const client = await pool.connect();

  try {
    const updateFields: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (updates.formData) {
      // Normalize form data when updating
      const normalizedFormData = normalizeFormData(updates.formData);
      updateFields.push(`form_data = $${paramIndex}`);
      params.push(JSON.stringify(normalizedFormData));
      paramIndex++;
    }

    if (updates.processed !== undefined) {
      updateFields.push(`processed = $${paramIndex}`);
      params.push(updates.processed);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return;
    }

    const query = `
      UPDATE applications 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
    `;
    params.push(id);

    const result = await client.query(query, params);
    
    if (result.rowCount === 0) {
      throw new Error('Application not found');
    }

    console.log(`Application ${id} updated successfully`);
  } catch (error) {
    console.error('Error updating application:', error);
    throw new Error(`Failed to update application: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    client.release();
  }
}

// DELETE - Delete an application
export async function deleteApplication(id: string): Promise<void> {
  if (!id || id.length !== 6) {
    throw new Error('Valid 6-character application ID is required');
  }

  await ensureTablesExist();
  const pool = await getPool();
  const client = await pool.connect();

  try {
    const result = await client.query(
      'DELETE FROM applications WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      throw new Error('Application not found');
    }

    console.log(`Application ${id} deleted successfully`);
  } catch (error) {
    console.error('Error deleting application:', error);
    throw new Error(`Failed to delete application: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    client.release();
  }
}

// UTILITY - Get application counts by status and type
export async function getApplicationCounts(): Promise<{
  total: number;
  processed: number;
  notProcessed: number;
  byType: Record<ApplicationType, { total: number; processed: number; notProcessed: number }>;
}> {
  await ensureTablesExist();
  const pool = await getPool();
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT 
        application_type,
        processed,
        COUNT(*) as count
      FROM applications
      GROUP BY application_type, processed
      ORDER BY application_type, processed
    `);

    const counts = {
      total: 0,
      processed: 0,
      notProcessed: 0,
      byType: {
        ApplicationForLoan: { total: 0, processed: 0, notProcessed: 0 },
        UnsecuredLoansApplication: { total: 0, processed: 0, notProcessed: 0 },
        SpecialLoansApplication: { total: 0, processed: 0, notProcessed: 0 },
      } as Record<ApplicationType, { total: number; processed: number; notProcessed: number }>
    };

    result.rows.forEach(row => {
      const count = parseInt(row.count);
      const type = row.application_type as ApplicationType;
      const isProcessed = row.processed;

      counts.total += count;
      counts.byType[type].total += count;

      if (isProcessed) {
        counts.processed += count;
        counts.byType[type].processed += count;
      } else {
        counts.notProcessed += count;
        counts.byType[type].notProcessed += count;
      }
    });

    return counts;
  } catch (error) {
    console.error('Error getting application counts:', error);
    throw new Error(`Failed to get application counts: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    client.release();
  }
}

// Legacy task functions (keeping for backward compatibility)
type Task = {
  id: string;
  title: string;
  status: 'IN_PROGRESS' | 'COMPLETE';
  createdAt: string;
};

export async function addNewTaskToDatabase(newTask: string): Promise<void> {
  await ensureTablesExist();
  const pool = await getPool();
  const client = await pool.connect();
  
  try {
    // Ensure tasks table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL NOT NULL,
        created_at timestamp NOT NULL,
        status VARCHAR(255) NOT NULL default 'IN_PROGRESS',
        title VARCHAR(1024) NOT NULL,
        PRIMARY KEY (id)
      );
    `);

    await client.query(
      `INSERT INTO tasks(created_at, status, title) VALUES(NOW(), 'IN_PROGRESS', $1)`, 
      [newTask]
    );
  } catch (err) {
    console.error('Error inserting new task:', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function getTasksFromDatabase(): Promise<Task[]> {
  await ensureTablesExist();
  const pool = await getPool();
  const client = await pool.connect();
  
  try {
    // Ensure tasks table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL NOT NULL,
        created_at timestamp NOT NULL,
        status VARCHAR(255) NOT NULL default 'IN_PROGRESS',
        title VARCHAR(1024) NOT NULL,
        PRIMARY KEY (id)
      );
    `);

    const { rows } = await client.query(
      `SELECT id, created_at, status, title FROM tasks ORDER BY created_at DESC LIMIT 100`
    );
    
    return rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      status: row.status,
      createdAt: row.created_at.toISOString(),
    }));
  } finally {
    client.release();
  }
}

export async function updateTaskInDatabase(task: Task): Promise<void> {
  await ensureTablesExist();
  const pool = await getPool();
  const client = await pool.connect();
  
  try {
    await client.query(
      `UPDATE tasks SET status = $1, title = $2 WHERE id = $3`,
      [task.status, task.title, task.id]
    );
  } finally {
    client.release();
  }
}

export async function deleteTaskFromDatabase(taskId: string): Promise<void> {
  await ensureTablesExist();
  const pool = await getPool();
  const client = await pool.connect();
  
  try {
    await client.query(`DELETE FROM tasks WHERE id = $1`, [taskId]);
  } finally {
    client.release();
  }
}