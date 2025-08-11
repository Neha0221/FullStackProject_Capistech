const Project=require('../model/projectModel')

const createProject=async (req,res)=>{
    try{
        const {name,description,teamMember}=req.body;

        if(!name || !description || !teamMember){
            return res.status(400).send('All fields are required');
        }
        const existingProject = await Project.findOne({ name: req.body.name });
        if (existingProject) {
            return res.status(400).json({ message: "Project already exists" });
        }
        
        await Project.create({name,description,teamMember});
        res.status(200).json({message:'Project created Successfully'});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

const getProject = async (req, res) => {
    try {
        // Pagination params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Fetch projects with pagination and populate team details
        const projects = await Project.find()
            .populate("teamMember", "name email designation") // only fetch these fields
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Count total for pagination info
        const totalProjects = await Project.countDocuments();

        res.status(200).json({
            page,
            limit,
            totalProjects,
            totalPages: Math.ceil(totalProjects / limit),
            data: projects
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateProject=async (req,res)=>{
    try{
       const {id}= req.params;
       const updatedProject=await Project.findByIdAndUpdate(
            id,
            req.body,
            {new:true}
       );

       if(!updatedProject){
         return res.status(400).send('Project not found');
       }

       res.status(200).json({message:'Project updated Successfully'});

    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

const deleteProject=async (req,res)=>{
    try{
        const deletedProject=Project.findByIdAndDelete(req.params.id);
        if(!deletedProject){
            return res.status(400).send('Project not Found');
        }

        res.status(200).json({message:'Project deleted Successfully'});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

module.exports={createProject,getProject,updateProject,deleteProject};

