import { showFormattedDate } from '../../utils';

const createStoryItemTemplate = (story) => `
  <article class="story-item">
    <img class="story-item__image" src="${story.photoUrl}" alt="Cerita oleh ${story.name}">
    <div class="story-item__content">
      <h3 class="story-item__title">${story.name}</h3>
      <p class="story-item__description">${story.description}</p>
      <span class="story-item__date">${showFormattedDate(story.createdAt)}</span>
      <button class="button-save" data-id="${story.id}" aria-label="Simpan cerita ${story.name} ke favorit">
        <i class="far fa-heart" aria-hidden="true"></i> Simpan ke Favorit
      </button>
    </div>
  </article>
`;

export default createStoryItemTemplate;