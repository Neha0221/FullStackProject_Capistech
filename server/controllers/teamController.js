const Team=require('../model/Team');

const createTeam=async(req,res)=>{
    try{
        const {name,email,designation}=req.body;

        if(!name || !email || !designation){
            return res.status(400).send('All fields are required for team member');
        }

        const teamMemberExist=await Team.findOne({email});
        if(teamMemberExist){
            return res.status(400).send('This member already exist');
        }

        const TeamCreate=Team.create({
            name,
            email,
            designation
        })

        res.status(201).json({message: 'Team created Successfully'});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

const getTeam=async (req,res)=>{
   try{
    const member = await Team.findById(req.params.id);
    if(!member){
        return res.status(404).send('Member is not exist');
    }
    res.status(200).send(member);
   }
   catch(err){
    res.status(500).json({message:err.message});
   }

}

const getAllTeam=async (req,res)=>{
    try{
        const page=(req.params.page) || 1;
        const limit=(req.params.limit) || 3;

        const skip=(page-1)*limit;
        const teams=await Team.find().skip(skip).limit(limit).sort({createdAt: -1});

        const totalMember=Team.countDocuments();

        res.status(200).json({
            page,
            limit,
            totalPages: Math.ceil(totalMember/limit),
            data: teams
        });

    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

const updateMember= async(req,res)=>{
   try{
        const { id } = req.params;
        const updatedMember=await Team.findByIdAndUpdate(
            id,   // document id
            req.body,  // the fields to update
            {new : true}    // return update document
        );
        
        if(!updatedMember){
            res.status(404).send('Member is not Exist');
        }

        res.status(200).json({message: 'Member is updated successfully'});
   }

   catch(err){
        res.status(500).json({message:err.message});
   }
  
}

const deleteMember= async(req,res)=>{
    try{
        const deletedMember=await Team.findByIdAndDelete(req.params.id);
        if(!deletedMember){
            res.status(404).send('Member not found');
        }

        res.status(200).json({message: 'Member deleted successfully'});
    }

    catch(err){
        res.status(500).json({message:err.message});
    }
}

module.exports={createTeam,getTeam,getAllTeam,updateMember,deleteMember};