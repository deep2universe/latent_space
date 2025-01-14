import { defineBackend } from '@aws-amplify/backend';
import { data } from "./data/resource";
import { storage } from './storage/resource';

defineBackend({
    data,
    storage
});