import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  InitialAnimal: a.model({
    id: a.string(),
    worldId: a.string(),
    name: a.string(),
    type: a.string(),
    image: a.string(),
    game: a.string(),
    happiness: a.number(),
    energy: a.number(),
    unlocked: a.boolean(),
    cost: a.number(),
    characteristics: a.list(a.string()),
    facts: a.list(a.string())
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
