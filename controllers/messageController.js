const Message = require("../models/message");

class MessageController {
  static async sendMessage(req, res) {
    try {
      const { receiverId, receiverRole, content } = req.body;
      const senderId = req.user.id;
      const senderRole = req.user.role;

      if (senderRole === receiverRole) {
        return res
          .status(400)
          .json({ error: "Cannot send message to the same role" });
      }

      const message = new Message({
        senderId,
        receiverId,
        senderRole,
        receiverRole,
        content,
      });

      await message.save();
      res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getMessages(req, res) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      const messages = await Message.find({
        $or: [
          { senderId: userId, senderRole: userRole },
          { receiverId: userId, receiverRole: userRole },
        ],
      })
        .populate("senderId", "name")
        .populate("receiverId", "name");

      const formattedMessages = messages.map((message) => ({
        _id: message._id,
        sender: {
          id: message.senderId._id,
          role: message.senderRole,
          name: message.senderId.name,
        },
        receiver: {
          id: message.receiverId._id,
          role: message.receiverRole,
          name: message.receiverId.name,
        },
        content: message.content,
        createdAt: message.createdAt,
      }));

      res.status(200).json({ messages: formattedMessages });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MessageController;
