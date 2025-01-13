import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  InitialAnimal: a.model({
    id: a.string(),
    worldId: a.string(),
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
