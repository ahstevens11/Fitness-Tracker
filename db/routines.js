const client = require('./client')
// const { getActivitiesByRoutineId } = require('./routine_activities')

async function createRoutine({creatorId, isPublic, name, goal}) {
    try {
        const {rows: [routine]} = await client.query(`
        INSERT INTO routines ("creatorId", "isPublic", name, goal)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `, [creatorId, isPublic, name, goal])
        
        return routine
    } catch (error) {
        throw error
    }
}

async function getRoutinesWithoutActivities() {
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM routines
        `);

        return rows;
    } catch (error) {
        throw error
    }
}

async function getRoutineById(id) {
    try {
        const { rows: [ routine ]  } = await client.query(`
          SELECT *
          FROM routines
          WHERE id=$1;
        `, [id]);
    
        return routine;
      } catch (error) {
        throw error;
      }
}


async function getAllRoutines() {
    try {
        const {rows: routines} = await client.query(`
        SELECT *, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId"=users.id  
        `);

        const {rows: activities} = await client.query(`
        SELECT *
        FROM routine_activities
        `)

        routines.forEach((e) => {
            e.activities = activities.filter(a => e.id === a.routineId)
        });

        return routines;
    } catch (error) {
        throw error
    }
}

async function getAllPublicRoutines() {
    try {
        const {rows: routines} = await client.query(`
        SELECT *, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId"=users.id
        WHERE "isPublic"=true;
        `);

        const {rows: activities} = await client.query(`
        SELECT *
        FROM routine_activities;
        `);

        routines.forEach((routine) => {
            routine.activities = activities.filter(a => routine.id === a.routineId)
        });

        return routines;
    } catch (error) {
        throw error
    }
}

async function getAllRoutinesByUser({username}) {
    try {
        const routines = await getAllRoutines();

        return routines.filter(routine => routine.creatorName === username)
    } catch (error) {
        throw error
    }
}

async function getPublicRoutinesByUser({username}) {
    try {
        const routines = await getAllRoutines();

        return routines.filter(routine => routine.creatorName === username && routine.isPublic)
    } catch (error) {
        throw error
    }
}

async function attachActivitiesToRoutines(routines) {
    const routineArray = [...routines]
    const binds = routines.map((_, index) => `$${index + 1}`).join(", ")
    const routineIds = routines.map((routine) => routine.id)
    if (routineIds.length === 0) {
        return
    }
    try {
        const { rows: activities } = await client.query(`
        SELECT activities.*, routine_activities.duration, routine_activities.count,
        routine_activities.id AS "routineActivityId", routine_activities."routineId"
        FROM activities
        JOIN routine_activities ON routine_activities."activityId" = activities.id
        WHERE routine_activities."routineId" IN (${binds});
      `, routineIds);
        for (const routine of routineArray) {
            const activitiesMerge = activities.filter((activity) => routine.id === activity.routineId)
            routine.activities = activitiesMerge
        }
        return routineArray
    } catch (error) {
        throw error
    }
    ///check duration id count return routine.activity.id
  }

  async function getPublicRoutinesByActivity({ id }) {
    try {
      const { rows: routines } = await client.query(`
              SELECT routines.*, users.username AS "creatorName"
              FROM routines
              JOIN users ON routines."creatorId"=users.id
              WHERE "isPublic"=true
              `);
              return await attachActivitiesToRoutines(routines)
    } catch (err) {
      console.error("Unable to get public routines by activity!");
      throw err;
    }
  }

async function updateRoutine(fields) {
    const { id } = fields;
    delete fields.id;

    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');

    try {
        const {rows: [updatedRoutine]} = await client.query(`
        UPDATE routines
        SET ${ setString }
        WHERE id=${id}
        RETURNING *;
        `, Object.values(fields));

        return updatedRoutine;
    } catch (error) {
        throw error
    }
}

async function destroyRoutine(id) {
    try {
        const routineId = getRoutineById(id);

        if(!routineId) {
            throw {message: "Error this routine doesnt exist"}
        };
        await client.query(`
        DELETE FROM routine_activities
        WHERE "routineId"=$1;
        `, [id]);
        const {rows: [routine]} = await client.query(`
        DELETE FROM routines
        WHERE id=$1
        RETURNING *;
        `, [id]) 

       return routine 
    } catch {
        throw error
    }
}

module.exports = {
    client,
    createRoutine,
    getRoutinesWithoutActivities,
    getRoutineById,
    getAllRoutines,
    getAllPublicRoutines,
    getAllRoutinesByUser,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    updateRoutine,
    destroyRoutine
}