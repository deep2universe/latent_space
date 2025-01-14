import { defineBackend } from '@aws-amplify/backend';
import { data } from "./data/resource";
import { storage } from './storage/resource';
import { auth } from './auth/resource';

defineBackend({
    data,
    storage,
    auth,
});