const express = require("express");
const routinesRouter = express.Router();
const { requireUser } = require("./utils");
const {
    getAllPublicRoutines,
    getRoutineById,
    destroyRoutine,
    createRoutine,
    updateRoutine,
    addActivityToRoutine
} = require("../db");

routinesRouter.get('/', async (req, res, next) => {
    try {
        const routines = await getAllPublicRoutines()
        res.send(routines)
    } catch (error) {
        next(error)
    }
})

routinesRouter.post('/', requireUser, async (req, res, next) => {
    const {isPublic, name, goal} = req.body;
    const {id} = req.user;
    const creatorId = id
    try {
        const routine = await createRoutine({creatorId, isPublic, name, goal})

        res.send(routine)
    } catch (error) {
        next(error)
    }
})

routinesRouter.patch('/:routineId', requireUser, async (req, res, next) => {
    try {
        const {isPublic, name, goal} = req.body;
        const {routineId} = req.params;
        const routine = await updateRoutine({id: routineId, isPublic, name, goal})
        res.send(routine)
    } catch (error) {
        next(error)
    }
})

routinesRouter.delete('/:routineId', requireUser, async (req, res, next) => {
    try {
        const {routineId} = req.params
        const routine = await getRoutineById(routineId)
        if (routine.creatorId === req.user.id) { //in the if statement it should be something for routineId === id
            const deletedRoutine = await destroyRoutine(routineId)
            res.send(deletedRoutine)
        }
    } catch (error) {
        next(error)
    }
})

routinesRouter.post('/:routineId/activities', requireUser, async (req, res, next) => {
    try {  
        const {activityId, count, duration} = req.body;
        const {routineId} = req.params; 
        const routine_activity = await addActivityToRoutine({routineId, activityId, count, duration})
        if(routine_activity) {
            res.send(routine_activity)
        } else {
            next({message: "duplication on activityId and routineId"})
        }
    } catch (error) {
        next(error)
    }
})

module.exports = routinesRouter
