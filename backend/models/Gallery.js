const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GallerySchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  
  publicId: {
    type: String
  },
  
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader information is required']
  },
  
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  
  tags: [{
    type: String,
    trim: true
  }],
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  uploadDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gallery', GallerySchema); 