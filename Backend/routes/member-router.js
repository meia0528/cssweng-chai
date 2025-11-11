const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/auth-Middleware');
const {
  listMembers,
  createMember, 
  updateMember,
  deleteMember,
  exportMembers,
} = require('../controllers/member-controller');

// All routes require admin token
router.get('/', verifyAdmin, listMembers);
router.post('/', verifyAdmin, createMember);

// Put the export route before :id to avoid path conflicts
router.get('/export', verifyAdmin, exportMembers);

router.put('/:id', verifyAdmin, updateMember);
router.delete('/:id', verifyAdmin, deleteMember);

module.exports = router;
