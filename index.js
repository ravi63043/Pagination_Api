const express=require('express');

const app=express();
const mongoose=require('mongoose');
const User1 = require('./users');
//import user model
const userModel=('./users');
mongoose.connect('mongodb://localhost/pagination',{ useNewUrlParser: true,useUnifiedTopology:true })
const db=mongoose.connection
db.once('open',async()=>{
    if(await User1.estimatedDocumentCount().exec()>0) return 
    Promise.all([
       User1.create({name:'User1'}),
       User1.create({name:'User2'}),
       User1.create({name:'User3'}),
       User1.create({name:'User4'}),
       User1.create({name:'User5'}),
       User1.create({name:'User6'}),
       User1.create({name:'User7'}),
       User1.create({name:'User8'}),
       User1.create({name:'User9'}),
       User1.create({name:'User10'}),
       User1.create({name:'User11'}),
       User1.create({name:'User12'}),
       User1.create({name:'User13'}),
       User1.create({name:'User14'}),
       User1.create({name:'User15'})

    ]).then(()=>console.log("Added users"))
   
})
app.get('/users',paginatedResults(User1),(req,res)=>{
    res.json(res.paginatedResults);
})
function paginatedResults(model)
{
    return async(req,res,next)=>{
        const page=parseInt(req.query.page)
        const limit=parseInt(req.query.limit)
        const startIndex=(page -1)*limit
        const endIndex=page*limit
        const results={}
        if(endIndex< await model.countDocuments().exec())
        {
            results.next={
                page:page+1,
                limit:limit
            }   
        }
        if(startIndex>0)
        {
            results.previous={
                page:page-1,
                limit:limit
            }    
        }
        try
        {
            results.results=await model.find().limit(limit).skip(startIndex).exec()
            res.paginatedResults=results
            next()
        }catch(err){
            res.status(500).json({err:message})
        }
       
        
    }
}

const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`Listenig to ${port}...`))