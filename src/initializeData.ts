import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { initialAnimals } from './store/initialAnimals';
import type { Schema } from './amplify/data/resource';
import outputs from './amplify_outputs.json';

Amplify.configure(outputs);

const client = generateClient<Schema>();

async function uploadInitialAnimals() {
  for (const animal of initialAnimals) {
    await client.models.InitialAnimal.create({
      ...animal,
      worldId: 'default'
    });
  }
  console.log('Initial animals uploaded successfully.');
}

uploadInitialAnimals().catch(console.error);
