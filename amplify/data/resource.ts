import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  MemoryCard: a.model({
    id: a.id(),
    world_id: a.string(),
    name: a.string(),
    image: a.string(),
    description: a.string()
  }).authorization(allow => [allow.publicApiKey()]),

  InitialAnimal: a.model({
    itemid: a.string(),
    world_id: a.string(),
    name: a.string(),
    type: a.string(),
    image: a.string(),
    game: a.string(),
    happiness: a.integer(),
    energy: a.integer(),
    unlocked: a.boolean(),
    cost: a.integer(),
    characteristics: a.string().array(),
    facts: a.string().array()
  }).authorization(allow => [allow.publicApiKey()])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});
