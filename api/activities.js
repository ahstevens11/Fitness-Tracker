const express = require("express");
const activitiesRouter = express.Router();

const {
  getAllActivities,
  createActivity,
  getActivityById,
  updateActivity,
  getPublicRoutinesByActivity,
} = require("../db");

const { requireUser } = require("./utils");

activitiesRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities()

    res.send(activities);
  } catch ({ message }) {
    next({ message })
  }
});

activitiesRouter.post("/", requireUser, async (req, res, next) => {
  try {
    const { name, description } = req.body
    const activity = await createActivity({name, description})
    
    res.send(activity);
  } catch (error) {
    throw error
  }
});

activitiesRouter.patch("/:activityId", requireUser, async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const { name, description} = req.body;
    const activity = await updateActivity({id: activityId, name, description})
    
    res.send(activity);
  } catch (error) {
    throw error
  }
});

activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const routines = await getPublicRoutinesByActivity({id: activityId})
    res.send(routines)
  } catch (error) {
    next(error)
  }
});

module.exports = activitiesRouter;