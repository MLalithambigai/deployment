const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const TodoModel=require('../Models/Todo')

const app=express()
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb+srv://Lali:wPgHZ3JT8xmBVIpU@cluster0.ydvgawy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/test')

// app.get('/paginated', async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 3; 
//   const skip = (page - 1) * limit;

//   try {
//     const tasks = await TodoModel.find().skip(skip).limit(limit);
//     const total = await TodoModel.countDocuments();

//     res.json({
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//       totalItems: total,
//       data: tasks
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get('/tasks',async(req,res)=>{
//   try{
//     const doneTasks=await TodoModel.find({done:true});
//     res.json(doneTasks);
//   }catch (err){
//     res.status(500).json({error:err.message});
//   }
// });

// app.get('/search',async(req,res)=>{
//   const searchQuery=req.query.task;
//   try{
//     const result=await TodoModel.find({task:{$regex:searchQuery}})
//     res.json(result);
//   } catch (err){
//     res.status(500).json({error:err.message})
//   }
// });

// app.post('/tasks', async (req, res) => {
//   const { page = 1, limit = 3, searchQuery } = req.body;

//   try {
//     const skip = (page - 1) * limit;
    
//     const tasksPromise = TodoModel.find().skip(skip).limit(limit);
//     const totalPromise = TodoModel.countDocuments();
//     const doneTasksPromise = TodoModel.find({ done: true });

//     let searchResultsPromise = null;
//     if (searchQuery) {
//       searchResultsPromise = TodoModel.find({
//         task: { $regex: searchQuery, $options: 'i' },
//       });
//     }

//     const [tasks, total, doneTasks, searchResults] = await Promise.all([
//       tasksPromise,
//       totalPromise,
//       doneTasksPromise,
//       searchResultsPromise,
//     ]);

//    const result = {
//       paginated: {
//         currentPage: page,
//         totalPages: Math.ceil(total / limit),
//         totalItems: total,
//         data: tasks,
//       },
//       doneTasks: doneTasks,
//       searchResults: searchQuery ? searchResults : [],
//     };

//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

app.post('/tasks', async (req, res) => {
  const { page = 1, limit = 3, searchQuery } = req.body;

  try {
    const skip = (page - 1) * limit;

    const query = {};

    if (searchQuery) {
      query.category = { $regex: searchQuery, $options: 'i' }; 
      query.done = true; 
    }

    const [total, tasks] = await Promise.all([
      TodoModel.countDocuments(query),
      TodoModel.find(query).skip(skip).limit(limit),
    ]);

    res.json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/test', async (req, res) => {
  res.json({
    message: 'test'
  })
})





app.get('/get',(req,res)=>{
  TodoModel.find()
  .then(result=>res.json(result))
  .catch(err=>res.json(err))
})

app.put('/update/:id',(req,res)=>{
  const {id}=req.params;
  TodoModel.findByIdAndUpdate({_id: id},{done:true})
  .then(result=>res.json(result))
  .catch(err=>res.json(err))
})

app.delete('/delete/:id',(req,res)=>{
  const {id}=req.params;
  TodoModel.findByIdAndDelete({_id:id})
  .then(result=>res.json(result))
  .catch(err=>res.json(err))

})

app.post('/add',(req,res)=>{
  const task=req.body.task;
  TodoModel.create({
    task:task
  }).then(result=>res.json(result))
  .catch(err=>res.json(err))
})
app.listen(3001,()=>{
  console.log("Server is running")
})


