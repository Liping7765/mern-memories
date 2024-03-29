import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

// look up posts from database 
export const getPosts =  async (req, res) => {

   try {
       
        const postMessage = await PostMessage.find();

        console.log(postMessage);

        res.status(200).json(postMessage);
       
   } catch (error) {

        res.status(404).json({ message: error.message});

   }

};

//create posts and save them to database 
export const createPost = async (req, res) => {

    const post = req.body;
    const newPost = new PostMessage(post);

    try {
        
        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {

        res.status(409).json({ message: error.message });
    }
};

//update post ad save them to database
export const updatePost = async (req, res) =>{

    const { id : _id } = req.params;
    const post = req.body; 

    // check if this is valid id 
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No Posting with that id.');

    // update to database 
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {new: true});

    res.json(updatedPost);

}

// delete post from database 
export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}

//increase like from database
export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessage.findById(id);
    const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true });

    res.json(updatedPost);
}
