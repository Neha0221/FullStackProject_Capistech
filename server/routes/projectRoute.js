const express=require('express');
const router=express.Router();
const {createProject,getProject,updateProject,deleteProject}=require('../controllers/projectController');

router.post('/',createProject);
router.get('/',getProject);
router.put('/:id',updateProject);
router.delete('/:id',deleteProject);

module.exports = router;