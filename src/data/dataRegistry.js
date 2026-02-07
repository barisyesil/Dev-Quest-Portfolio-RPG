import projects from './projects.json';
import achievements from './achievements.json';
import dialogues from './dialogues.json';
import guestbook from './guestbook.json';

export const dataMap = {
  project_desk_intro: { type: 'modal', data: projects.project_desk_intro },
  achievements_list: { type: 'modal', data: achievements.achievements_list },
  wc_easter_egg: { type: 'dialogue', data: dialogues.wc_easter_egg },
  ai_secretary_hello: { type: 'dialogue', data: dialogues.ai_secretary_hello },
  guest_book_interaction: { type: 'guestbook', data: guestbook.guest_book }
  
};