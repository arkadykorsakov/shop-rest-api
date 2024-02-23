import prisma from "../prisma.js";

export default function (db, message, id = "id") {
  return async function (req, res, next) {
    try {
      const isExistsObject = await prisma[db].findFirst({
        where: { id: +req.params[id] },
      });
      if (!isExistsObject) {
        return res.status(404).json({ success: false, message });
      }
    } catch (e) {
      console.log(e);
      return res.status(404).json({ success: false, message });
    }
    next();
  };
}
