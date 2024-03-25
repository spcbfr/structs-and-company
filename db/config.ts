import { NOW, column, defineDb, defineTable } from 'astro:db';

const Note = defineTable({
  columns: {
    content: column.text(),
    published: column.date({ default: NOW })
  }
})

export default defineDb({
  tables: { Note }
});
