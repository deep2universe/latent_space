import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'latent_space_drive',
    access: (allow) => ({
        'memory_game/*': [
            allow.authenticated.to(['read','write']),
            allow.guest.to(['read', 'write'])
        ],
    })
});