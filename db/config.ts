import { column, defineDb, defineTable } from "astro:db";
import dayjs from "dayjs";

const Note = defineTable({
  columns: {
    content: column.text(),
    published: column.number({ default: dayjs().unix() }),
  },
});

export default defineDb({
  tables: { Note },
});
