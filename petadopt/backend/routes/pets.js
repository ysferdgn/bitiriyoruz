const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Helper to extract Public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
    if (!url || !url.includes('cloudinary')) return null;
    try {
        const parts = url.split('/');
        const uploadIndex = parts.indexOf('upload');
        if (uploadIndex === -1) return null;
        // The public ID is the rest of the path after the version, without the extension
        // e.g., v123456/folder/image.jpg -> we need folder/image
        const publicIdWithExtension = parts.slice(uploadIndex + 2).join('/');
        const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
        return publicId;
    } catch (error) {
        console.error('Failed to extract public ID from URL:', url, error);
        return null;
    }
};

// **ROUTING ORDER FIX**
// More specific routes should come before dynamic routes like /:id

// Get recent pets (last 8 pets)
router.get('/recent', async (req, res) => {
  try {
    const pets = await Pet.find()
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(8);
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent pets', error: error.message });
  }
});

// Get featured pets (random 6 pets)
router.get('/featured', async (req, res) => {
  try {
    const pets = await Pet.aggregate([
      { $sample: { size: 6 } }
    ]);
    
    // Populate owner information
    const populatedPets = await Pet.populate(pets, {
      path: 'owner',
      select: 'name email phone'
    });
    
    res.json(populatedPets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured pets', error: error.message });
  }
});

// Get related pets (same type, excluding self)
router.get('/related/:id', async (req, res) => {
  try {
    const currentPet = await Pet.findById(req.params.id);
    if (!currentPet) {
      return res.status(404).json({ message: 'Current pet not found' });
    }

    const relatedPets = await Pet.find({
      type: currentPet.type, // Find pets of the same type
      _id: { $ne: req.params.id } // Exclude the current pet
    })
    .limit(10) // Limit to 10 results
    .populate('owner', 'name email phone'); 

    res.json(relatedPets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching related pets', error: error.message });
  }
});

// Get user's pets (my-listings endpoint)
router.get('/my-listings', auth, async (req, res) => {
  try {
    console.log('Fetching my-listings for user:', req.user._id);
    const pets = await Pet.find({ owner: req.user._id })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });
    console.log('Found pets:', pets.length);
    res.json(pets);
  } catch (error) {
    console.error('Error in my-listings:', error);
    res.status(500).json({ message: 'Error fetching user pets', error: error.message });
  }
});

// Get all pets with optional filters (handles search)
router.get('/search', async (req, res) => {
  try {
    const { type, age, size, search, location, gender } = req.query;
    const filter = {};

    if (type) {
      const types = type.split(',');
      if (types.length > 0) {
        filter.type = { $in: types };
      }
    }

    if (gender) {
      const genders = gender.split(',');
      if (genders.length > 0) {
        // Case-insensitive search for gender
        const genderRegex = genders.map(g => new RegExp(`^${g}$`, 'i'));
        filter.gender = { $in: genderRegex };
      }
    }

    if (size) filter.size = size;

    if (location) {
        // Case-insensitive search for location
        filter.location = { $regex: `^${location}$`, $options: 'i' };
    }

    if (age) {
      if (age === 'puppy') filter.age = { $lte: 1 };
      if (age === 'young') filter.age = { $gte: 1, $lte: 3 };
      if (age === 'adult') filter.age = { $gte: 3, $lte: 7 };
      if (age === 'senior') filter.age = { $gte: 7 };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const pets = await Pet.find(filter)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pets', error: error.message });
  }
});

// Create new pet with image upload
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    console.log('Creating pet with data:', req.body);
    console.log('Files uploaded:', req.files);
    
    const imageUrls = req.files ? req.files.map(file => file.path || file.url) : [];
    console.log('Image URLs:', imageUrls);
    
    const pet = new Pet({
      ...req.body,
      images: imageUrls,
      owner: req.user._id
    });

    console.log('Pet object to save:', pet);
    await pet.save();
    console.log('Pet saved successfully');
    
    res.status(201).json(pet);
  } catch (error) {
    console.error('Error creating pet:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Error creating pet', error: error.message });
  }
});

// Get single pet BY ID - This MUST be after other specific GET routes
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
      .populate('owner', 'name email phone');
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pet', error: error.message });
  }
});

// Update pet with image upload
router.put('/:id', auth, upload.array('newImages', 5), async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to update this pet' });
    }

    const { name, type, breed, age, gender, description, location, images: existingImagesJson } = req.body;
    
    let existingImages = [];
    try {
        existingImages = existingImagesJson ? JSON.parse(existingImagesJson) : [];
    } catch(e) {
        console.error("Error parsing existing images JSON:", e);
        return res.status(400).json({ message: 'Invalid format for existing images.' });
    }
    
    const imagesToDelete = pet.images.filter(url => !existingImages.includes(url));
    if (imagesToDelete.length > 0) {
        Promise.all(imagesToDelete.map(url => {
            const publicId = getPublicIdFromUrl(url);
            if(publicId) {
                return cloudinary.uploader.destroy(publicId);
            }
            return Promise.resolve();
        })).catch(err => console.error("Error deleting images from Cloudinary:", err));
          }

    const newImageUrls = req.files ? req.files.map(file => file.path) : [];
    const updatedImages = [...existingImages, ...newImageUrls];

    pet.name = name;
    pet.type = type;
    pet.breed = breed;
    pet.age = age;
    pet.gender = gender;
    pet.description = description;
    pet.location = location;
    pet.images = updatedImages;

    const updatedPet = await pet.save();
    await updatedPet.populate('owner', 'name email phone');
    res.json(updatedPet);
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(500).json({ message: 'Error updating pet', error: error.message });
  }
});

// Delete a pet
router.delete('/:id', auth, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to delete this pet' });
    }

    if (pet.images && pet.images.length > 0) {
      const deletePromises = pet.images.map(url => {
        const publicId = getPublicIdFromUrl(url);
        if (publicId) {
          return cloudinary.uploader.destroy(publicId);
        }
        return Promise.resolve();
      });
      await Promise.all(deletePromises);
    }

    await pet.deleteOne();

    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error('Error deleting pet:', error);
    res.status(500).json({ message: 'Error deleting pet', error: error.message });
  }
});

// @route   GET /api/pets/featured
// @desc    Get featured pets (dummy endpoint)
// @access  Public
router.get('/featured', (req, res) => {
  console.log("Accessed /api/pets/featured route");
  res.json([]);
});

// @route   GET /api/pets/recent
// @desc    Get recent pets (dummy endpoint)
// @access  Public
router.get('/recent', (req, res) => {
  console.log("Accessed /api/pets/recent route");
  res.json([]);
});

module.exports = router; 