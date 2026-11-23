// In-memory store (resets when server restarts) - keeps project database-free.
const requests = [];
let counter = 0;

function priorityFor(labDate) {
  const days = Math.round((new Date(labDate + 'T00:00:00') - new Date(new Date().toDateString())) / 86400000);
  if (days <= 2) return 'Urgent';
  if (days <= 7) return 'Normal';
  return 'Low';
}

function create(data) {
  counter += 1;
  const record = {
    requestId: `CH-${new Date().getFullYear()}-${String(counter).padStart(4, '0')}`,
    ...data,
    priority: priorityFor(data.labDate),
    status: 'Pending Approval',
    createdAt: new Date().toISOString()
  };
  requests.push(record);
  return record;
}

const getAll = () => [...requests].reverse();
const getById = (id) => requests.find((r) => r.requestId === id);

module.exports = { create, getAll, getById };
