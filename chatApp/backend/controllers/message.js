const Message=require('../models/message')

const createMessage=async(req,res)=>{
     

      const newMessage= new Message(req.body)
      newMessage
      .save()
      .then(() =>
        res.status(200).json({ newMessage, message: "message created successfully!" })
      )
      .catch((err) => {
        res.status(400).send("bad request , please verify your input");
      });

}

module.exports={createMessage}