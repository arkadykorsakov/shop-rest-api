import { unlink } from "fs/promises";

export default function removeImage(link) {
  try {
    unlink(link);
  } catch (e) {
    console.error("Ошибка уделаения файла:", e.message);
  }
}
