const mongoose = require("mongoose")



const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  parentId: {
    type: String,
    ref: 'Folder'
  },
  userId: {
    type: String,
    required: true
  },
  path: {
    type: Array,
    default:[]
  },
  starred: {
    type:Boolean,
    default:false,
  }
});
delete mongoose.models.Folder
const FolderModel = mongoose.models.FolderModel || mongoose.model('Folder', folderSchema);
module.exports = {
    FolderModel
}
  


