import 'dotenv/config'
import mongoose from 'mongoose'
import fs from 'fs'
import Cat from '../src/api/models/cats.js' 

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    const cats = JSON.parse(fs.readFileSync('./cats_cleaned.json', 'utf-8'))

    await Cat.deleteMany()
    console.log('Existing cats cleared from DB')

    await Cat.insertMany(cats)
    console.log(`${cats.length} cats successfully imported!`)

    process.exit(0)
  } catch (err) {
    console.error('Error importing data:', err.message)
    process.exit(1)
  }
}

importData()