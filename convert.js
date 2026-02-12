import fs from 'fs';




// 1. Load your original JSON file
const rawData = JSON.parse(fs.readFileSync('cats_original.json', 'utf8'));

// 2. Map the fields to match your Mongoose Schema
const cleanedData = rawData.map(cat => ({
  id: cat.id,
  name: cat.name,
  // Constructs the full URL using the reference ID
  imageUrl: cat.reference_image_id 
    ? `https://cdn2.thecatapi.com/images/${cat.reference_image_id}.jpg` 
    : null,
  temperament: cat.temperament,
  lifeSpan: cat.life_span,
  affectionLevel: cat.affection_level,
  childFriendly: cat.child_friendly,
  dogFriendly: cat.dog_friendly,
  energyLevel: cat.energy_level,
  grooming: cat.grooming,
  sheddingLevel: cat.shedding_level,
  strangerFriendly: cat.stranger_friendly,
  type: 'cat'
}));

// 3. Save the new clean version
fs.writeFileSync('cats_cleaned.json', JSON.stringify(cleanedData, null, 2));

console.log(`Successfully processed ${cleanedData.length} cats!`);