import { model, Schema } from "mongoose";

const chatSchema = new Schema({
  messages: {
    type: Array,
    message: {
      type: String,
      date: {
        type: Date,
        default: Date.now(),
      },
      sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  },
});

export default model("Chat", chatSchema);
