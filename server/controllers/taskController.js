const Task = require("../model/taskModel");

// Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, deadline, project, assignedMembers, status } = req.body;

    if (!title || !description || !deadline || !project || !assignedMembers) {
      return res.status(400).send("All fields are required");
    }

    await Task.create({ title, description, deadline, project, assignedMembers, status });
    res.status(201).json({ message: "Task created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Tasks with Filtering + Pagination
const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Filtering
    if (req.query.project) filter.project = req.query.project;
    if (req.query.member) filter.assignedMembers = req.query.member;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } }
      ];
    }
    if (req.query.startDate && req.query.endDate) {
      filter.deadline = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const tasks = await Task.find(filter)
      .populate("project", "name description")
      .populate("assignedMembers", "name email designation")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalTasks = await Task.countDocuments(filter);

    res.status(200).json({
      page,
      limit,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
      data: tasks
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", data: updatedTask });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
