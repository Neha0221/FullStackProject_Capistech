const express=require('express');
const connectDB=require('./config/db');
const userRoute=require('./routes/userRoute');
const teamRoute=require('./routes/teamRoute');
const projectRoute=require('./routes/projectRoute');
const taskRoute = require('./routes/taskRoute');

const app=express();
app.use(express.json());

connectDB();
app.use('/api/user',userRoute);
app.use('/api/teams',teamRoute);
app.use('/api/projects',projectRoute);
app.use("/api/tasks", taskRoute);

app.listen(8000,()=>console.log('Server running on http://localhost:8000'));