const service = require('../services/requestService');

exports.createRequest = (req, res) => {
  const record = service.create(req.validated);
  res.status(201).json({
    success: true,
    message: 'Component request submitted successfully.',
    request: record
  });
};

exports.listRequests = (req, res) => {
  const all = service.getAll();
  res.json({ success: true, count: all.length, requests: all });
};

exports.getRequest = (req, res) => {
  const record = service.getById(req.params.id.toUpperCase());
  if (!record) return res.status(404).json({ success: false, message: 'Request not found.' });
  res.json({ success: true, request: record });
};
