const express = require("express");
const routinesRouter = express.Router();
const { requireUser } = require("./utils");
const {
    getAllPublicRoutines,
    getRoutineById,
    destroyRoutine,
} = require("../db");

routinesRouter.get('/', async (req, res, next) => {
    try {
        const routines = await getAllPublicRoutines()
        res.send(routines)
    } catch (error) {
        next(error)
    }
})

routinesRouter.get('/', requireUser, async (req, res, next) => {
    try {

    } catch (error) {
        next(error)
    }
})



// routinesRouter.delete('/:routineId', requireUser, async (req, res, next) => {
//     try {
//         const _routine = await getRoutineById(req.params.routineId)

//         if (_routine && _routine.creatorId === req.user.username) {
//             await destroyRoutine(req.params.routineId)
//             res.send({message: "Routine was deleted"})
//         } else {
//             throw new Error("Routine could not be deleted")
//         }
//     } catch (error) {
//         next(error)
//     }
// })

module.exports = routinesRouter
