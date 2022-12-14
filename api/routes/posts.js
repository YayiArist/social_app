const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      res.status(500).json(err);
    }
  });
//update a post

router.put("/:id", async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id); // id es el parametro y userId es el key guardado en el obj
        if(post.userId === req.body.userId){
            await post.updateOne({$set:req.body})
            res.status(200).json("the post has been updated")
        }
    if(post.userId === req.body.userId){

    }else{
        res.status(404).json("you can update only your posts")
    }

    }catch(err){
        res.status(500).json(err)

    }
    
    
})
//delete a post
router.delete("/:id", async(req, res)=>{
  try{
      const post = await Post.findById(req.params.id); // id es el parametro y userId es el key guardado en el obj
      if(post.userId === req.body.userId){
          await post.delete({$set:req.body})
          res.status(200).json("the post has been deleted")
      }
  if(post.userId === req.body.userId){

  }else{
      res.status(404).json("you can delete only your posts")
  }
  }catch(err){
      res.status(500).json(err)
  }   
})


//like/ dislike a post
router.put("/:id/like", async (req, res)=>{
try{
  const post = await Post.findById(req.params.id)
  if(!post.likes.includes(req.body.userId)){
    await post.updateOne({$push: {likes:req.body.userId}})
    res.status(200).json("the post has been liked")
  }else{
    await post.updateOne({$pull:{likes:req.body.userId}})
    res.status(200).json("the post has been disliked")     
  }

}catch(err){
  res.status(500).json(err)
}  
})

//get a post
router.get("/:id", async(req,res)=>{
  try{
    const post = await Post.findById(req.params.id);
    res.status(200).json(post)

  }catch(err){
    res.status(500).json(err)

  }
})


//get timeline posts 

//Aqui no voy a usar await sino promesas porque hay que enviar varios request

router.get("/timeline/all", async(req,res)=>{
  
  try{
  const currentUser= await User.findById(req.body.userId)
  const userPosts = await Post.find({userId:currentUser._id});
  const friendPosts = await Promise.all(
    currentUser.followings.map(friendId =>{
      return Post.find({userId: friendId})
    })
  )
    res.json(userPosts.concat(...friendPosts))
  }catch(err){
    res.status(500).json(err)
  }
})





module.exports = router;