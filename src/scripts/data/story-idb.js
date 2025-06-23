import { openDB } from 'idb';

const DATABASE_NAME = 'story-app-database';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'stories';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(database) {
        database.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
    },
});

const StoryIdb = {
    async getAllStories() {
        return (await dbPromise).getAll(OBJECT_STORE_NAME);
    },
    async getStory(id) {
        return (await dbPromise).get(OBJECT_STORE_NAME, id);
    },
    async putStory(story) {
        if (!story.hasOwnProperty('id')) {
            return;
        }
        return (await dbPromise).put(OBJECT_STORE_NAME, story);
    },
    async putAllStories(stories) {
        const tx = (await dbPromise).transaction(OBJECT_STORE_NAME, 'readwrite');
        const store = tx.objectStore(OBJECT_STORE_NAME);
        for (const story of stories) {
            store.put(story);
        }
        return tx.done;
    },
    async deleteStory(id) {
        return (await dbPromise).delete(OBJECT_STORE_NAME, id);
    },
};

export default StoryIdb;