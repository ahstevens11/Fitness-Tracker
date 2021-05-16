const express = require("express");
const routineActivityRouter = express.Router();
const { requireUser } = require("./utils");

const { getRoutineActivityById, getRoutineById, updateRoutineActivity, destroyRoutineActivity } = require("../db");

routineActivityRouter.patch("/:routineActivityId", async (req, res, next) => {
  const { count, duration } = req.body;
  const id = req.params.routineActivityId;
  try {
    const routineActivity = await getRoutineActivityById(id);
    const routine = await getRoutineById(routineActivity.routineId);
    if (req.user.id !== routine.creatorId) {
      next({ name: "must be user" });
    } else {
      const insertRoutineActivity = await updateRoutineActivity({
        id,
        count,
        duration,
      });
      if (insertRoutineActivity) {
        res.send(insertRoutineActivity);
      } else {
        next({ name: "routine doesn't exist" });
      }
    }
  } catch (error) {
    next(error);
  }
});

routineActivityRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    const {routineActivityId} = req.params;
try {
    const routineActivity = await getRoutineActivityById({id: routineActivityId})
    const routine = await getRoutineById(routineActivity.routineId)
    if (req.user.id === routine.creatorId) {
        const deletedRoutineActivity = await destroyRoutineActivity(routineActivityId)
        res.send(deletedRoutineActivity)
    } else {
        next({message: "You must be the owner to delete this"})
    }
    // use destroyRoutineActivity(id) here in a if statement
 } catch ({message}) {
     next({message})
 }
})

module.exports = routineActivityRouter