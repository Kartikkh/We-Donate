const Story = require('../../models/Ngo/stories');
const Ngo = require('../../models/Ngo/ngo');
const commentSchema = require('../../models/Ngo/comments');
const User = require('../../models/User/user');


module.exports.postStory = (req,res,next) => {

    let story = new Story({
        story : req.body.story,
        storyName : req.body.storyName,
        image : 'https://www.microsoft.com/en-gb/CMSImages/WindowsHello_Poster_1920-1600x300-hello.png?version=0d8f51c7-ef87-b0af-8f26-453fb40b4b7d'
    });

    Ngo.findById({ '_id' : req.userId} , (err, ngo)=>{
        if(err){
            req.status(500).json(err);
        }else if (ngo=== undefined || ngo === null){
            req.status(500).json("Please Login Again");
        }else{
            Story.save(story , (err, saveStory)=>{
                if(err){
                    req.status(500).json(err);

                }else{
                        ngo.stories.push(saveStory._id);
                        ngo.save();
                        req.status(200).json("Successfully saved");
                }
            })
        }
    });
};




module.exports.deleteStory = (req,res,next) => {

    Ngo.findByIdAndUpdate({'_id' : req.userId , 'stories' : { $in : [req.params.storyId] }} , {$pull : {'stories' : req.params.storyId }},
         (err, ngo)=>{
        if(err){
            req.status(500).json(err);
        }else if  (ngo=== undefined || ngo === null){
            req.status(500).json("You Are Not Authorised to Delete this Story ");
        }else{
            Story.findByIdAndRemove({ '_id' : req.params.storyId} , (err)=>{
                if(err){
                    res.status(500).json(err);
                }else{
                    req.status(200).json("Successfully Deleted");
                }
            })
        }
    })

};

module.exports.updateStory = (req,res,next) => {


    Ngo.findById({'_id' : req.userId , 'stories' : { $in : [req.params.storyId] } } , (err, ngo)=>{
        if(err){
            req.status(500).json(err);
        }else if  (ngo=== undefined || ngo === null){
            req.status(500).json("You Are Not Authorised to Update this Story ");
        }else{
            Story.findById({_id : req.params.storyId},(err, story)=>{
                if(err){
                    res.status(500).json(err);
                }else{
                    story.storyName =req.body.storyName || story.storyName ;
                    story.story = req.body.story || story.story;
                    story.save();
                    req.status(200).json("Successfully updated");
                }
            })
        }
    })




};