import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });
import { Client } from 'pg';

const API_BASE = 'http://localhost:5000/api';

interface TestResult {
  category: string;
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function record(category: string, name: string, passed: boolean, details: string) {
  results.push({ category, name, passed, details });
  console.log(`${passed ? '✅ [PASS]' : '❌ [FAIL]'} [${category}] ${name}: ${details}`);
}

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.headers) {
    Object.assign(defaultHeaders, options.headers);
  }

  const response = await fetch(url, { ...options, headers: defaultHeaders });
  let data: any = null;
  try {
    data = await response.json();
  } catch (e) {
    // Empty body or non-JSON
  }

  return { status: response.status, data };
}

async function runQA() {
  console.log('==================================================');
  console.log('       STARTING FULL E2E ONLINE RUNTIME QA       ');
  console.log('==================================================\n');

  // Database Connection for Direct DB Verifications
  const pgClient = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await pgClient.connect();

  const branchesRes = await pgClient.query('SELECT id, name FROM branches ORDER BY name');
  const dhakaBranch = branchesRes.rows.find((b: any) => b.name.includes('Dhaka'));
  const rajshahiBranch = branchesRes.rows.find((b: any) => b.name.includes('Rajshahi'));

  if (!dhakaBranch || !rajshahiBranch) {
    console.error('Missing branches in DB! Need Dhaka and Rajshahi.');
    process.exit(1);
  }

  // --- Step 1: Authentication Tests ---
  let zarifToken = '';
  let zarifRefreshToken = '';
  let marketingToken = '';
  let rajshahiToken = '';

  // Zarif Login
  const zarifLogin = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@agesense.org', password: 'AgeSense@123' }),
  });
  zarifToken = zarifLogin.data?.data?.accessToken || zarifLogin.data?.accessToken;
  zarifRefreshToken = zarifLogin.data?.data?.refreshToken || zarifLogin.data?.refreshToken;
  const zarifRole = zarifLogin.data?.data?.user?.role || zarifLogin.data?.user?.role;
  record('Auth', 'Zarif (super_admin) Login', zarifLogin.status === 200 && zarifRole === 'super_admin', `Status ${zarifLogin.status}, Role: ${zarifRole}`);

  // Marketing Login
  const mktLogin = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'marketing@agesense.org', password: 'AgeSense@123' }),
  });
  marketingToken = mktLogin.data?.data?.accessToken || mktLogin.data?.accessToken;
  const mktRole = mktLogin.data?.data?.user?.role || mktLogin.data?.user?.role;
  record('Auth', 'Marketing Login', mktLogin.status === 200 && mktRole === 'marketing', `Status ${mktLogin.status}, Role: ${mktRole}`);

  // Rajshahi Login
  const rajLogin = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'rajshahi@agesense.org', password: 'AgeSense@123' }),
  });
  rajshahiToken = rajLogin.data?.data?.accessToken || rajLogin.data?.accessToken;
  const rajUser = rajLogin.data?.data?.user || rajLogin.data?.user;
  record('Auth', 'Rajshahi Login', rajLogin.status === 200 && rajUser?.role === 'branch_manager' && rajUser?.branch_id === rajshahiBranch.id, `Status ${rajLogin.status}, Role: ${rajUser?.role}, Branch: ${rajUser?.branch_id}`);

  // Invalid Password Rejection
  const wrongPassRes = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@agesense.org', password: 'WrongPassword999!' }),
  });
  record('Auth', 'Invalid Password Rejection', wrongPassRes.status === 401 || wrongPassRes.status === 400, `Rejected with status ${wrongPassRes.status}`);

  // Non-existent User Rejection
  const nonExistentRes = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'nonexistent999@agesense.org', password: 'AgeSense@123' }),
  });
  record('Auth', 'Non-existent User Rejection', nonExistentRes.status === 401 || nonExistentRes.status === 400, `Rejected with status ${nonExistentRes.status}`);

  // Refresh Token Flow
  if (zarifRefreshToken) {
    const refreshRes = await apiCall('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: zarifRefreshToken }),
    });
    const newToken = refreshRes.data?.data?.accessToken || refreshRes.data?.accessToken;
    record('Auth', 'Token Refresh Flow', refreshRes.status === 200 && !!newToken, `Status ${refreshRes.status}`);
  }

  // Argon2id Hashing Check in DB
  const passCheck = await pgClient.query("SELECT password FROM users WHERE email = 'admin@agesense.org'");
  const passHash = passCheck.rows[0]?.password || '';
  const isArgon2 = passHash.startsWith('$argon2id$');
  record('Auth Security', 'Argon2id Password Hashing Verification', isArgon2, `Password hash format: ${passHash.substring(0, 12)}... (Argon2id verified)`);

  // --- Step 2: Super Admin User Management Tests ---
  let tempUserId = '';
  const listUsersRes = await apiCall('/users/admin', {
    method: 'GET',
    headers: { Authorization: `Bearer ${zarifToken}` },
  });
  const usersList = listUsersRes.data?.data || listUsersRes.data || [];
  record('User Management', 'Super Admin List Users', listUsersRes.status === 200 && Array.isArray(usersList), `Status ${listUsersRes.status}, count: ${usersList.length}`);

  // Ensure password / hash is not returned
  const exposedHash = Array.isArray(usersList) && usersList.some((u: any) => u.password || u.password_hash);
  record('Security', 'Password / Hash Expose Check in API', !exposedHash, 'No password or hash fields returned in /users payload');

  // Create Temp QA User
  const createUserRes = await apiCall('/users/admin', {
    method: 'POST',
    headers: { Authorization: `Bearer ${zarifToken}` },
    body: JSON.stringify({
      email: 'qatestuser@agesense.org',
      password: 'AgeSenseQA@123',
      name: 'QA Temp User',
      role: 'marketing',
    }),
  });
  const newUser = createUserRes.data?.data || createUserRes.data;
  tempUserId = newUser?.id || '';
  record('User Management', 'Super Admin Create User', createUserRes.status === 201 || createUserRes.status === 200, `Created user ID ${tempUserId}`);

  // Update User Role & Branch Assignment
  if (tempUserId) {
    const updateUserRes = await apiCall(`/users/admin/${tempUserId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${zarifToken}` },
      body: JSON.stringify({
        role: 'branch_manager',
        branch_id: rajshahiBranch.id,
        is_active: true,
      }),
    });
    record('User Management', 'Super Admin Update Role & Branch', updateUserRes.status === 200, `Updated role to branch_manager`);

    // Deactivate User via PUT /users/admin/:id
    const deactRes = await apiCall(`/users/admin/${tempUserId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${zarifToken}` },
      body: JSON.stringify({ is_active: false }),
    });
    record('User Management', 'Super Admin Deactivate User', deactRes.status === 200, 'Deactivated user');

    // Reactivate User via PUT /users/admin/:id
    const reactRes = await apiCall(`/users/admin/${tempUserId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${zarifToken}` },
      body: JSON.stringify({ is_active: true }),
    });
    record('User Management', 'Super Admin Reactivate User', reactRes.status === 200, 'Reactivated user');

    // Delete Temp QA User
    const delUserRes = await apiCall(`/users/admin/${tempUserId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${zarifToken}` },
    });
    record('User Management', 'Super Admin Delete User', delUserRes.status === 200, 'Deleted temp user');
  }

  // --- Self-Demotion & Deletion Protection ---
  const zarifDbRes = await pgClient.query("SELECT id FROM users WHERE email = 'admin@agesense.org'");
  const zarifId = zarifDbRes.rows[0].id;

  const selfDeact = await apiCall(`/users/admin/${zarifId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${zarifToken}` },
    body: JSON.stringify({ is_active: false }),
  });
  record('User Management', 'Self-Deactivation Blocked', selfDeact.status === 400 || selfDeact.status === 403, `Blocked with status ${selfDeact.status}`);

  const selfDelete = await apiCall(`/users/admin/${zarifId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${zarifToken}` },
  });
  record('User Management', 'Last Super Admin Deletion Blocked', selfDelete.status === 400 || selfDelete.status === 403, `Blocked with status ${selfDelete.status}`);

  // --- Step 3: Marketing Restrictions Tests ---
  const mktUsers = await apiCall('/users/admin', {
    method: 'GET',
    headers: { Authorization: `Bearer ${marketingToken}` },
  });
  record('Marketing Restrictions', 'Forbidden: Manage Users', mktUsers.status === 403, `Status ${mktUsers.status}`);

  const mktRoles = await apiCall('/roles/admin', {
    method: 'GET',
    headers: { Authorization: `Bearer ${marketingToken}` },
  });
  record('Marketing Restrictions', 'Forbidden: Manage Roles', mktRoles.status === 403, `Status ${mktRoles.status}`);

  const mktBranch = await apiCall('/branches/admin', {
    method: 'POST',
    headers: { Authorization: `Bearer ${marketingToken}` },
    body: JSON.stringify({ name: 'Unauthorized Branch', division: 'Dhaka' }),
  });
  record('Marketing Restrictions', 'Forbidden: Create Branch', mktBranch.status === 403, `Status ${mktBranch.status}`);

  const mktPolicy = await apiCall('/policies/admin', {
    method: 'POST',
    headers: { Authorization: `Bearer ${marketingToken}` },
    body: JSON.stringify({ title: 'Unauthorized Policy', category: 'General', document_url: 'http://example.com' }),
  });
  record('Marketing Restrictions', 'Forbidden: Create Policy', mktPolicy.status === 403, `Status ${mktPolicy.status}`);

  // --- Step 4: Critical Rajshahi Branch Manager Isolation Tests ---
  let dhakaMemberId = '';
  let rajshahiMemberId = '';

  // Seed team members for testing via Super Admin
  const tmDhakaRes = await apiCall('/team/admin', {
    method: 'POST',
    headers: { Authorization: `Bearer ${zarifToken}` },
    body: JSON.stringify({
      name: 'Dhaka Staff Member',
      position: 'Officer',
      committee: 'Executive Committee',
      branch_id: dhakaBranch.id,
      biography: 'Dhaka branch officer',
    }),
  });
  dhakaMemberId = tmDhakaRes.data?.id || tmDhakaRes.data?.data?.id || '';

  const tmRajRes = await apiCall('/team/admin', {
    method: 'POST',
    headers: { Authorization: `Bearer ${zarifToken}` },
    body: JSON.stringify({
      name: 'Rajshahi Staff Member',
      position: 'Officer',
      committee: 'Executive Committee',
      branch_id: rajshahiBranch.id,
      biography: 'Rajshahi branch officer',
    }),
  });
  rajshahiMemberId = tmRajRes.data?.id || tmRajRes.data?.data?.id || '';

  // H. Access Users API
  const rajUsers = await apiCall('/users/admin', {
    method: 'GET',
    headers: { Authorization: `Bearer ${rajshahiToken}` },
  });
  record('Branch Isolation', 'H. Access /users API', rajUsers.status === 403, `Status ${rajUsers.status}`);

  // B. Create team member submitted with Dhaka branch_id
  const crossTmRes = await apiCall('/team/admin', {
    method: 'POST',
    headers: { Authorization: `Bearer ${rajshahiToken}` },
    body: JSON.stringify({
      name: 'Cross Branch Attempt Member',
      position: 'Tester',
      committee: 'Executive Committee',
      branch_id: dhakaBranch.id,
    }),
  });
  const createdBranchId = crossTmRes.data?.branch_id || crossTmRes.data?.data?.branch_id || crossTmRes.data?.item?.branch_id;
  const isBranchIsolated = crossTmRes.status === 403 || createdBranchId === rajshahiBranch.id;
  record('Branch Isolation', 'B. Create Team Member Cross-Branch', isBranchIsolated, crossTmRes.status === 403 ? 'Denied (403)' : `Overridden to Rajshahi branch (${createdBranchId})`);

  // Clean up cross branch member if created
  const crossTmId = crossTmRes.data?.id || crossTmRes.data?.data?.id;
  if (crossTmId) {
    await apiCall(`/team/admin/${crossTmId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${zarifToken}` } });
  }

  // C. Update Dhaka team member
  if (dhakaMemberId) {
    const updateDhakaRes = await apiCall(`/team/admin/${dhakaMemberId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${rajshahiToken}` },
      body: JSON.stringify({ name: 'Hacked Dhaka Member' }),
    });
    record('Branch Isolation', 'C. Update Dhaka Team Member', updateDhakaRes.status === 403, `Status ${updateDhakaRes.status}`);
  }

  // D. Delete Dhaka team member
  if (dhakaMemberId) {
    const delDhakaRes = await apiCall(`/team/admin/${dhakaMemberId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${rajshahiToken}` },
    });
    record('Branch Isolation', 'D. Delete Dhaka Team Member', delDhakaRes.status === 403, `Status ${delDhakaRes.status}`);
  }

  // E. Create program with Dhaka branch_id
  const crossProgRes = await apiCall('/programs/admin', {
    method: 'POST',
    headers: { Authorization: `Bearer ${rajshahiToken}` },
    body: JSON.stringify({
      title: 'Rajshahi Cross Branch Attempt Program',
      description: 'Attempting to inject Dhaka program',
      type: 'Our Programs',
      branch_id: dhakaBranch.id,
    }),
  });
  const progBranchId = crossProgRes.data?.branch_id || crossProgRes.data?.data?.branch_id || crossProgRes.data?.item?.branch_id;
  const isProgIsolated = crossProgRes.status === 403 || progBranchId === rajshahiBranch.id;
  record('Branch Isolation', 'E. Create Program Cross-Branch', isProgIsolated, crossProgRes.status === 403 ? 'Denied (403)' : `Overridden to Rajshahi branch (${progBranchId})`);

  // Clean up created program if created
  const crossProgId = crossProgRes.data?.id || crossProgRes.data?.data?.id;
  if (crossProgId) {
    await apiCall(`/programs/admin/${crossProgId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${zarifToken}` } });
  }

  // Clean up created team members
  if (dhakaMemberId) {
    await apiCall(`/team/admin/${dhakaMemberId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${zarifToken}` } });
  }
  if (rajshahiMemberId) {
    await apiCall(`/team/admin/${rajshahiMemberId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${zarifToken}` } });
  }

  // --- Step 5: Role & Permission Management Tests (as Super Admin) ---
  const rolesListRes = await apiCall('/roles/admin', {
    method: 'GET',
    headers: { Authorization: `Bearer ${zarifToken}` },
  });
  const roles = rolesListRes.data?.data || rolesListRes.data || [];
  record('Role Management', 'Super Admin View Roles', rolesListRes.status === 200 && Array.isArray(roles), `Status ${rolesListRes.status}, count: ${roles.length}`);

  // Permissions Catalog Inspection via DB / Roles
  const permCheck = await pgClient.query('SELECT COUNT(*) FROM permissions');
  record('Role Management', 'Super Admin View Permissions', parseInt(permCheck.rows[0].count) > 0, `Permissions in catalog: ${permCheck.rows[0].count}`);

  // Create custom role & clean up
  const createRoleRes = await apiCall('/roles/admin', {
    method: 'POST',
    headers: { Authorization: `Bearer ${zarifToken}` },
    body: JSON.stringify({
      name: 'temp_qa_role',
      description: 'Temporary QA role',
      permissions: [],
    }),
  });
  const tempRoleId = createRoleRes.data?.id || createRoleRes.data?.data?.id;
  record('Role Management', 'Super Admin Create Custom Role', createRoleRes.status === 201 || createRoleRes.status === 200, `Created role ID ${tempRoleId}`);

  if (tempRoleId) {
    const delRoleRes = await apiCall(`/roles/admin/${tempRoleId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${zarifToken}` },
    });
    record('Role Management', 'Super Admin Delete Custom Role', delRoleRes.status === 200, 'Deleted temp custom role');
  }

  // --- Step 6: Fail-Closed Authorization Verification ---
  // Unauthenticated request to protected route
  const unauthRes = await apiCall('/users/admin', { method: 'GET' });
  record('Fail-Closed Auth', 'Unauthenticated Access Denied', unauthRes.status === 401, `Status ${unauthRes.status}`);

  // Invalid Token Request
  const invalidTokenRes = await apiCall('/users/admin', {
    method: 'GET',
    headers: { Authorization: 'Bearer invalid.jwt.token.string' },
  });
  record('Fail-Closed Auth', 'Invalid Token Access Denied', invalidTokenRes.status === 401 || invalidTokenRes.status === 403, `Access denied with status ${invalidTokenRes.status}`);

  // Logout Flow Test
  const logoutRes = await apiCall('/auth/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${zarifToken}` },
    body: JSON.stringify({ refreshToken: zarifRefreshToken }),
  });
  record('Auth', 'Logout Revocation Request', logoutRes.status === 200, 'Logout succeeded');

  await pgClient.end();

  console.log('\n==================================================');
  console.log('            E2E RUNTIME QA SUMMARY               ');
  console.log('==================================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  console.log(`TOTAL TESTS: ${total}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${total - passed}`);
  console.log(`OVERALL STATUS: ${passed === total ? 'PASS' : 'FAIL'}`);
}

runQA().catch(console.error);
