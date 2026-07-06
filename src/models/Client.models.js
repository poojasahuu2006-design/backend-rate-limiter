const mongoose=require("mongoose");

const clientSchema=new mongoose.Schema({
    clientKey: {
    type: String,
    required: true,
    unique: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  refillRate: {
    type: Number,
    required: true,
  },
  remainingTokens: {
    type: Number,
    required: true,
  },
  lastRefillTime: {
    type: Date,
    required: true,
  },
  algorithm: {
    type: String,
    enum: ["token_bucket", "sliding_window"],
    default: "token_bucket",
  },
  windowLog: {
    type: [Date],
    default: []
  }
}, {
  timestamps: true,
  optimisticConcurrency: true
});

const clientModel=mongoose.model("client",clientSchema);
module.exports=clientModel;
