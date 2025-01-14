import { generateClient } from 'aws-amplify/data';
import { getUrl } from 'aws-amplify/storage';
import type { Schema } from '../../amplify/data/resource';
import { MemoryCard } from '../data/memoryCards';

const client = generateClient<Schema>();

export async function fetchMemoryCards(): Promise<MemoryCard[]> {
    const { data: cards, errors } = await client.models.MemoryCard.list();
    
    if (errors) {
        console.error('Error fetching memory cards:', errors);
        throw new Error('Failed to fetch memory cards');
    }

    const cardsWithUrls = await Promise.all(cards.map(async (card) => {
        try {
            const { url } = await getUrl({
                key: `memory_game/${card.image}`,
                options: {
                    expiresIn: 3600
                }
            });
            return {
                id: parseInt(card.id),
                name: card.name,
                image: url.toString(),
                description: card.description
            };
        } catch (error) {
            console.error(`Error fetching image for card ${card.id}:`, error);
            // Return card with placeholder image or handle error as needed
            return {
                id: parseInt(card.id),
                name: card.name,
                image: 'placeholder_image_url',
                description: card.description
            };
        }
    }));

    return cardsWithUrls;
}

export async function createMemoryCard(card: Omit<MemoryCard, 'id'>) {
    const { errors } = await client.models.MemoryCard.create(card);
    if (errors) {
        console.error('Error creating memory card:', errors);
        throw new Error('Failed to create memory card');
    }
}

export async function initializeMemoryCards(cards: MemoryCard[]) {
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        await createMemoryCard({
            name: card.name,
            image: `elephant_${i + 1}.jpg`,
            description: card.description,
            world_id: 'default'
        });
    }
}

// Removed redundant createMemoryCard function