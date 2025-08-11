const express=require('express');
const router=express.Router();
const {createTeam,getTeam,getAllTeam,updateMember,deleteMember}=require('../controllers/teamController');

router.post('/',createTeam);
router.get('/:id',getTeam);
router.get('/',getAllTeam);
router.put('/:id',updateMember);
router.delete('/:id',deleteMember);

module.exports=router;