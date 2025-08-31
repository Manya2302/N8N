  Why you should do it regularly: https://github.com/browserslist/update-db#readme
5:07:11 PM [express] GET /api/csrf-token 200 in 10ms :: {"csrfToken":"95af412fe4c717e3883fea2db62cc1…
Audit logging error: error: relation "audit_logs" does not exist
    at /home/runner/workspace/node_modules/pg/lib/client.js:545:17
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async PostgresStorage.createAuditLog (file:///home/runner/workspace/server/storage.js:284:5)
    at async Immediate.<anonymous> (file:///home/runner/workspace/server/middleware.js:143:11) {
  length: 109,
  severity: 'ERROR',
  code: '42P01',
  detail: undefined,
  hint: undefined,
  position: '13',
  internalPosition: undefined,
  internalQuery: undefined,
  where: undefined,
  schema: undefined,
  table: undefined,
  column: undefined,
  dataType: undefined,
  constraint: undefined,
  file: 'parse_relation.c',
  line: '1452',
  routine: 'parserOpenTable'
}
Login error: error: relation "users" does not exist
    at /home/runner/workspace/node_modules/pg/lib/client.js:545:17
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async <anonymous> (/home/runner/workspace/node_modules/src/node-postgres/session.ts:104:19)
    at async PostgresStorage.getUserByEmail (file:///home/runner/workspace/server/storage.js:45:20)
    at async file:///home/runner/workspace/server/routes.js:143:20 {
  length: 104,
  severity: 'ERROR',
  code: '42P01',
  detail: undefined,
  hint: undefined,
  position: '93',
  internalPosition: undefined,
  internalQuery: undefined,
  where: undefined,
  schema: undefined,
  table: undefined,
  column: undefined,
  dataType: undefined,
  constraint: undefined,
  file: 'parse_relation.c',
  line: '1452',
  routine: 'parserOpenTable'
}
5:07:11 PM [express] POST /api/auth/login 400 in 11ms :: {"error":"relation \"users\" does not exist…
Audit logging error: error: relation "audit_logs" does not exist
    at /home/runner/workspace/node_modules/pg/lib/client.js:545:17
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async PostgresStorage.createAuditLog (file:///home/runner/workspace/server/storage.js:284:5)
    at async Immediate.<anonymous> (file:///home/runner/workspace/server/middleware.js:143:11) {
  length: 109,
  severity: 'ERROR',
  code: '42P01',
  detail: undefined,
  hint: undefined,
  position: '13',
  internalPosition: undefined,
  internalQuery: undefined,
  where: undefined,
  schema: undefined,
  table: undefined,
  column: undefined,
  dataType: undefined,
  constraint: undefined,
  file: 'parse_relation.c',
  line: '1452',
  routine: 'parserOpenTable'
}