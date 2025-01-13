import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { Animal } from '../store/types';

const client = generateClient<Schema>();

export async function fetchDefaultAnimals(): Promise<Animal[]> {
    const { data: animals, errors } = await client.models.InitialAnimal.list({
        filter: {
            worldId: { eq: 'default' }
        }
    });
    
    if (errors) {
        console.error('Error fetching animals:', errors);
        throw new Error('Failed to fetch animals');
    }

    return animals.map(animal => ({
        itemid: parseInt(animal.itemid),
        name: animal.name,
        type: animal.type,
        image: animal.image,
        game: animal.game,
        happiness: animal.happiness,
        energy: animal.energy,
        hunger: animal.happiness, // Initialize hunger same as happiness
        unlocked: animal.unlocked,
        cost: animal.cost,
        characteristics: animal.characteristics || [],
        facts: animal.facts || [],
        worldId: animal.worldId
    }));
}