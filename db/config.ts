import { column, defineDb, defineTable } from 'astro:db';

const Note = defineTable({
  columns: {
    content: column.text(),
    published: column.number()
  }
})

export default defineDb({
  tables: { Note }
});
