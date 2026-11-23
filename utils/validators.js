// Pure validation functions (no Express dependency) - easy to unit test.
const CATEGORIES = [
  'Microcontroller', 'Sensor', 'Resistor/Capacitor', 'Integrated Circuit',
  'Display Module', 'Communication Module', 'Power Supply'
];
const DEPARTMENTS = ['E&TC', 'Computer', 'IT', 'AI&DS', 'Mechanical', 'Civil'];

const NAME_RE = /^[A-Za-z][A-Za-z .'-]{2,49}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PRN_RE = /^20\d{10}$/;
const MS_DAY = 24 * 60 * 60 * 1000;

function parseDate(str) {
  if (typeof str !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
  const [y, m, day] = str.split('-').map(Number);
  const d = new Date(y, m - 1, day); // local time, so no timezone shift
  const ok = d.getFullYear() === y && d.getMonth() === m - 1 && d.getDate() === day;
  return ok ? d : null;
}

function validateRequest(body, today = new Date()) {
  const errors = {};
  const b = body || {};
  const str = (v) => (typeof v === 'string' ? v.trim() : '');

  const name = str(b.name);
  if (!name) errors.name = 'Name is required.';
  else if (!NAME_RE.test(name)) errors.name = 'Name must be 3-50 characters and contain only letters, spaces, . \' or -.';

  const prn = str(b.prn);
  if (!prn) errors.prn = 'PRN is required.';
  else if (!PRN_RE.test(prn)) errors.prn = 'PRN must be exactly 12 digits and start with 20.';

  const email = str(b.email);
  if (!email) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';

  const department = str(b.department);
  if (!department) errors.department = 'Select a department.';
  else if (!DEPARTMENTS.includes(department)) errors.department = 'Select a valid department.';

  const category = str(b.category);
  if (!category) errors.category = 'Select a component category.';
  else if (!CATEGORIES.includes(category)) errors.category = 'Select a valid component category.';

  const componentName = str(b.componentName);
  if (!componentName) errors.componentName = 'Component name is required.';
  else if (componentName.length < 2 || componentName.length > 60)
    errors.componentName = 'Component name must be 2-60 characters.';

  const qtyRaw = str(String(b.quantity ?? ''));
  const quantity = Number(qtyRaw);
  if (!qtyRaw) errors.quantity = 'Quantity is required.';
  else if (!Number.isInteger(quantity)) errors.quantity = 'Quantity must be a whole number.';
  else if (quantity < 1 || quantity > 10) errors.quantity = 'Quantity must be between 1 and 10.';

  const labDateStr = str(b.labDate);
  const labDate = parseDate(labDateStr);
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!labDateStr) errors.labDate = 'Lab date is required.';
  else if (!labDate) errors.labDate = 'Enter a valid date (YYYY-MM-DD).';
  else if (labDate < t0) errors.labDate = 'Lab date cannot be in the past.';
  else if (labDate - t0 > 30 * MS_DAY) errors.labDate = 'Lab date must be within the next 30 days.';
  else if (labDate.getDay() === 0) errors.labDate = 'Lab is closed on Sundays. Choose another date.';

  const purpose = str(b.purpose);
  if (!purpose) errors.purpose = 'Purpose is required.';
  else if (purpose.length < 20) errors.purpose = 'Purpose must contain at least 20 characters.';
  else if (purpose.length > 300) errors.purpose = 'Purpose must not exceed 300 characters.';
  else if (Number.isInteger(quantity) && quantity > 5 && purpose.length < 50)
    errors.purpose = 'Requests for more than 5 units need a detailed purpose (at least 50 characters).';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    data: { name, prn, email: email.toLowerCase(), department, category, componentName, quantity, labDate: labDateStr, purpose }
  };
}

module.exports = { validateRequest, CATEGORIES, DEPARTMENTS, parseDate };
