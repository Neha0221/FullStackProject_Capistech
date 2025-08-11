const { default: mongoose } = require("mongoose");

const teamSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            require:true
        },
        email:{
            type:String,
            require:true
        },
        designation:{
            type:String,
            require:true
        },
    }, 

    {
        timestamps:true
    }

);

module.exports=mongoose.model('Team',teamSchema);