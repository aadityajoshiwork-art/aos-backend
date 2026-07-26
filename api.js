/**
 * =============================================================================
 *  AOS FRONTEND API LAYER  (api.js)
 * =============================================================================
 *  Every network call the AOS frontend will ever make lives in this file.
 *  Nothing in app.js (the inline <script> in aos-frontend.html) should ever
 *  read/write data directly — it only ever calls functions on `window.AOS_API`.
 *
 *  BACKEND INTEGRATION TARGET (per project brief):
 *    - Node.js + Express REST API      → BASE_URL below
 *    - Supabase (Postgres + Auth)      → Express routes read/write via the
 *                                        Supabase service client server-side
 *    - Microsoft Graph API             → contacts / Teams / Outlook mail sync,
 *                                        proxied through Express so the Graph
 *                                        token never touches the browser
 *    - Deployed on Vercel              → BASE_URL defaults to a relative path
 *                                        so it works unchanged behind Vercel's
 *                                        routing (`/api/*` → serverless funcs)
 *
 *  Every function below is a STUB. None of them are implemented yet — they
 *  define the exact contract (inputs / outputs) the Express backend must
 *  satisfy. Replace the body of each function with a real `fetch(...)` call
 *  once the corresponding Express route + Supabase table exists. The
 *  `request()` helper at the bottom already does the real fetch/JSON/error
 *  handling — most stubs just need their TODO uncommented.
 * =============================================================================
 */

const AOS_API = (() => {
  // TODO(backend): point this at your deployed Express API.
  // On Vercel, Express routes typically live under /api, so a relative path
  // works in both local dev (via a proxy) and production.
  const BASE_URL = 'https://aos-backend-nine.vercel.app/api';

  /* ---------------------------------------------------------------------
   * Low-level request helper — all real implementations should route
   * through this so auth headers, error handling, and JSON parsing stay
   * consistent in one place.
   * ------------------------------------------------------------------- */
  async function request(path, { method = 'GET', body, params } = {}) {
    const url = new URL(BASE_URL + path, window.location.origin);
    if (params) Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v));

    // TODO(backend): attach a Supabase auth JWT here, e.g.:
    //   const { data: { session } } = await supabase.auth.getSession();
    //   headers.Authorization = `Bearer ${session?.access_token}`;
    const headers = { 'Content-Type': 'application/json' };

    const res = await fetch(url.toString(), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new ApiError(errBody.message || res.statusText, res.status, errBody);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  class ApiError extends Error {
    constructor(message, status, body) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.body = body;
    }
  }

  // A shared "not implemented" stub — every placeholder below rejects with
  // this until its real fetch() call is wired up. Swap the function body
  // for a real `return request(...)` call one endpoint at a time.
  function notImplemented(name) {
    return Promise.reject(new ApiError(`AOS_API.${name} is not implemented yet — wire this to the Express backend.`, 501));
  }

  /* =======================================================================
   *  PROJECTS
   *  Express:  GET/POST   /api/projects
   *            GET/PUT/DELETE /api/projects/:id
   *  Supabase: `projects` table (id, name, category, poc, brand_poc,
   *            assignees[], initiation_date, go_live_date, effort,
   *            progress, health, client_id, created_at, updated_at)
   * ===================================================================== */
  const projects = {
    list: (filters) => request('/projects', { params: filters }),
    get: (projectId) => request(`/projects/${projectId}`),
    create: (payload) => request('/projects', { method:'POST', body: payload }),
    update: (projectId, payload) => request(`/projects/${projectId}`, { method:'PUT', body: payload }),
    remove: (projectId) => request(`/projects/${projectId}`, { method:'DELETE' })
  };

  /* =======================================================================
   *  TASKS  (kanban board + My Tasks + Home task widget)
   *  Express:  GET/POST /api/projects/:projectId/tasks
   *            GET/PUT/DELETE /api/tasks/:id
   *  Supabase: `tasks` table (id, project_id, title, status, priority,
   *            due_date, assignee_id, assigned_by_id, team_id)
   * ===================================================================== */
  const tasks = {
    listForProject: (projectId) => request(`/projects/${projectId}/tasks`),
    listForUser: (userId, range) => request('/tasks', { params: { userId, range } }),
    create: (projectId, payload) => request(`/projects/${projectId}/tasks`, { method:'POST', body: payload }),
    update: (taskId, payload) => request(`/tasks/${taskId}`, { method:'PUT', body: payload }),
    remove: (taskId) => request(`/tasks/${taskId}`, { method:'DELETE' })
  };

  /* =======================================================================
   *  APPROVALS  (Project Detail → Approvals tab)
   *  Express:  GET/POST /api/projects/:projectId/approvals
   *            PUT /api/approvals/:id
   * ===================================================================== */
  const approvals = {
    listForProject: (projectId) => request('/approvals', { params: { projectId } }),
    decide: (approvalId, decision) => request(`/approvals/${approvalId}`, { method:'PUT', body: { status: decision } })
  };

  /* =======================================================================
   *  COMMENTS  (Project Detail → Comments tab)
   *  Express:  GET/POST /api/projects/:projectId/comments
   *            DELETE /api/comments/:id
   *  Supabase: `comments` table (id, project_id, author_id, body,
   *            visible_to_client, created_at)
   * ===================================================================== */
  const comments = {
    listForProject: (projectId) => request('/comments', { params: { projectId } }),
    create: (projectId, payload) => request('/comments', { method:'POST', body: { ...payload, project_id: projectId } }),
    remove: (commentId) => notImplemented('comments.remove')  };

  /* =======================================================================
   *  MEMBERS / DIRECTORY / TEAMS  (Members screen)
   *  Express:  GET /api/members, GET /api/teams, POST /api/teams/:id/members
   *  Supabase: `members` table, `teams` table, `team_members` join table
   * ===================================================================== */
  const members = {
    listDirectory: () => request('/members'),
    listTeams: () => request('/teams'),
    getTeam: (teamId) => notImplemented('members.getTeam'),
    addToTeam: (teamId, memberPayload) => notImplemented('members.addToTeam'),
    removeFromTeam: (teamId, memberId) => notImplemented('members.removeFromTeam'),
    invite: (payload) => request('/members', { method:'POST', body: payload })
  };

  /* =======================================================================
   *  MICROSOFT GRAPH SYNC  (Members → "Sync with Outlook/Teams")
   *  Express:  POST /api/integrations/graph/contacts/import
   *            POST /api/integrations/graph/teams/import
   *            POST /api/integrations/mail/send   (Graph sendMail passthrough)
   *  Graph:    GET /me/contacts, GET /me/joinedTeams, POST /me/sendMail
   *  The OAuth token exchange happens server-side; the browser only ever
   *  talks to our own Express routes below, never to graph.microsoft.com
   *  directly, so the Graph access token never touches client code.
   * ===================================================================== */
  const graph = {
    startContactImport: () => notImplemented('graph.startContactImport'), // TODO
    importFromFile: (file) => notImplemented('graph.importFromFile'), // TODO: multipart upload, parsed server-side (CSV/XLSX)
    sendInviteMail: (payload) => notImplemented('graph.sendInviteMail') // TODO: POST /api/integrations/mail/send
  };

  /* =======================================================================
   *  REPORTS  (Overall Health donut + Work Ownership)
   *  Express:  GET /api/reports/health, GET /api/reports/work-ownership
   * ===================================================================== */
  const reports = {
    getHealthBreakdown: () => notImplemented('reports.getHealthBreakdown'), // TODO
    getWorkOwnership: () => notImplemented('reports.getWorkOwnership'), // TODO
    exportCsv: () => notImplemented('reports.exportCsv'), // TODO: GET /api/reports/export.csv (blob)
    exportPdf: () => notImplemented('reports.exportPdf') // TODO: GET /api/reports/export.pdf (blob)
  };

  /* =======================================================================
   *  FINANCE  (SOW / Estimate Request / JCR status per project)
   *  Express:  GET /api/finance, PUT /api/finance/:projectId/:process
   *  Supabase: `finance_status` table (project_id, process, status)
   * ===================================================================== */
  const finance = {
    list: () => notImplemented('finance.list'), // TODO
    setStatus: (projectId, process, status) => notImplemented('finance.setStatus') // TODO: PUT /api/finance/:projectId/:process
  };

  /* =======================================================================
   *  NOTIFICATIONS + COMMAND PALETTE SEARCH
   * ===================================================================== */
  const notifications = {
    list: () => notImplemented('notifications.list'), // TODO: GET /api/notifications
    markAllRead: () => notImplemented('notifications.markAllRead') // TODO: POST /api/notifications/mark-read
  };
  const search = {
    query: (q) => notImplemented('search.query') // TODO: GET /api/search?q= — searches projects, tasks, people, files
  };

  /* =======================================================================
   *  ADMIN CMS
   *  Every admin resource below follows the same REST shape:
   *    GET    /api/admin/<resource>
   *    POST   /api/admin/<resource>
   *    PUT    /api/admin/<resource>/:id
   *    DELETE /api/admin/<resource>/:id
   *  Supabase tables: clients, agencies, third_parties, brands, teams,
   *  members, roles, org_settings (single row), ms_tenant_settings
   *  (single row, holds Graph app registration client_id/tenant_id — the
   *  client secret must stay server-side only, e.g. Vercel env var).
   * ===================================================================== */
  function makeAdminResource(resource) {
    return {
      list: () => notImplemented(`admin.${resource}.list`), // TODO: return request(`/admin/${resource}`)
      get: (id) => notImplemented(`admin.${resource}.get`), // TODO: return request(`/admin/${resource}/${id}`)
      create: (payload) => notImplemented(`admin.${resource}.create`), // TODO: return request(`/admin/${resource}`, { method:'POST', body: payload })
      update: (id, payload) => notImplemented(`admin.${resource}.update`), // TODO: return request(`/admin/${resource}/${id}`, { method:'PUT', body: payload })
      remove: (id) => notImplemented(`admin.${resource}.remove`) // TODO: return request(`/admin/${resource}/${id}`, { method:'DELETE' })
    };
  }

  const admin = {
    clients: makeAdminResource('clients'),
    agencies: makeAdminResource('agencies'),
    thirdParties: makeAdminResource('third-parties'),
    brands: makeAdminResource('brands'),
    teams: makeAdminResource('teams'),
    members: makeAdminResource('members'),
    roles: makeAdminResource('roles'),
    // Singletons — GET/PUT only, no list/create/delete.
    orgSettings: {
      get: () => notImplemented('admin.orgSettings.get'), // TODO: return request('/admin/org-settings')
      update: (payload) => notImplemented('admin.orgSettings.update') // TODO: return request('/admin/org-settings', { method:'PUT', body: payload })
    },
    msTenantSettings: {
      get: () => notImplemented('admin.msTenantSettings.get'), // TODO: return request('/admin/ms-tenant-settings')
      update: (payload) => notImplemented('admin.msTenantSettings.update') // TODO: return request('/admin/ms-tenant-settings', { method:'PUT', body: payload })
    }
  };

  return {
    ApiError,
    projects, tasks, approvals, comments, members, graph,
    reports, finance, notifications, search, admin
  };
})();

// Exposed as a global so the inline app script can call `AOS_API.*`.
// If you migrate to a bundler/module system later, swap this for
// `export default AOS_API;` and `import AOS_API from './api.js'`.
window.AOS_API = AOS_API;
