const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  folderId: {
    type: String,
    ref: 'Folder'
  },
  userId: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  lastModified: {
    type:Number,
  },
  size: {
    type:Number,
  },
  starred: {
    type:Boolean,
    default:false,
  },
  filePath:{
    type: String,
    required: true
  },
  path: {
    type: Array,
    default:[]
  },
});
delete mongoose.models.File
const FileModel = mongoose.models.FileModel || mongoose.model('File', fileSchema);

module.exports = {
  FileModel
}


