import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import { initialAnimals } from './store/initialAnimals';

Amplify.configure(outputs);

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // Path to your backend resource definition

const client = generateClient<Schema>();

// Now you should be able to make CRUD operations with the
// Data client
// const fetchAnimals = async () => {
//     const { data: todos, errors } = await client.models.InitialAnimal.list();
// };

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
