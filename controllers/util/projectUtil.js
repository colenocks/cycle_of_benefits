const { getDatabase } = require("../../persistence/connection");
const mongodb = require("mongodb");

exports.updateProjectOpen = (db) => {
  const filter = {
    $expr: { $lt: ["$current_workers", "$max_workers"] },
  };
  const updateData = { $set: { status: "Open" } };
  db.collection("active_projects")
    .updateMany(filter, updateData)
    .then(({ result }) => {
      const { nModified } = result;
      if (nModified > 0) {
        this.updateWorklistOpen(db).then(() => {
          console.log(`Open: ${nModified} status(es) updated`);
        });
      }
    })
    .catch((err) => {
      console.log(`Unable to update project status to Open- ${err}`);
    });
};

exports.updateWorklistOpen = async (db) => {
  const filter = { $expr: { $lt: ["$current_workers", "$max_workers"] } };
  const updateData = { $set: { status: "Open" } };
  db.collection("worklist")
    .updateMany(filter, updateData)
    .then(({ result }) => {
      const { nModified } = result;
      if (nModified > 0) {
        console.log(nModified + " worklist document(s) updated status to Open");
      }
    })
    .catch((err) => {
      console.log(`unable to update worklist status to Open: ${err}`);
    });
};

exports.updateWorklistAssigned = (db) => {
  const filter = {
    status: { $ne: "Completed" },
    $expr: { $eq: ["$current_workers", "$max_workers"] },
  };
  const updateData = { $set: { status: "Assigned" } };
  db.collection("worklist")
    .updateMany(filter, updateData)
    .then(({ result }) => {
      const { nModified } = result;
      if (nModified > 0) {
        console.log(
          `${nModified} worklist document(s) updated status to Assigned`
        );
      }
    })
    .catch((err) => {
      console.log(`unable to update worklist status to Assigned: ${err}`);
    });
};

exports.updateProjectAssigned = (db) => {
  const filter = {
    status: { $ne: "Completed" },
    $expr: { $eq: ["$current_workers", "$max_workers"] },
  };
  const updateData = { $set: { status: "Assigned" } };
  db.collection("active_projects")
    .updateMany(filter, updateData)
    .then(({ result }) => {
      let { nModified } = result;
      if (nModified > 0) {
        this.updateWorklistAssigned(db);
        console.log(`${nModified} document(s) updated status to Assigned`);
      }
    })
    .catch((err) => {
      console.log(`unable to update project status to Assigned: ${err}`);
    });
};

exports.updateProjectComplete = (projid, callback) => {
  const db = getDatabase();
  const filter = { _id: projid };
  const updateData = { $set: { status: "Completed", reward_points: 0 } };
  db.collection("active_projects")
    .updateOne(filter, updateData)
    .then(({ result }) => {
      const { nModified } = result;
      if (nModified > 0) {
        console.log(
          `${nModified}
                  " Project(s) have been flagged as Completed`
        );
        this.deleteWorklistProject(projid, db, (deleted) => {
          if (deleted) callback(nModified);
        });
      } else {
        console.log(
          "error updating " + projid + " status to completed, update manually"
        );
        callback(null);
      }
    })
    .catch((err) => console.log(err));
};

exports.incrementCurrentWorker = (projid, callback) => {
  const db = getDatabase();
  db.collection("active_projects")
    .updateOne(
      {
        _id: projid,
        status: { $eq: "Open" },
        $expr: { $lt: ["$current_workers", "$max_workers"] },
      },
      { $inc: { current_workers: 1 } }
    )
    .then((data) => {
      if (data.result.nModified > 0) {
        callback(true);
        return;
      }
      //Project Already Assigned
      callback(null);
    })
    .catch((err) => {
      console.log("increment query error" + err);
    });
};

exports.decrementCurrentWorker = (projid, callback) => {
  const db = getDatabase();
  db.collection("active_projects")
    .updateOne(
      {
        _id: projid,
        $and: [
          { current_workers: { $gt: 0 } },
          { status: { $ne: "Completed" } },
        ],
      },
      { $inc: { current_workers: -1 } }
    )
    .then((data) => {
      if (data.result.nModified > 0) {
        console.log("decremented");
        callback(true);
        return;
      } else {
        callback(null);
      }
    })
    .catch((err) => {
      console.log("decrement query error" + err);
    });
};

exports.checkWorklistForDuplicates = (projid, userid, callback) => {
  this.findApprovedProject(projid, (id) => {
    if (id) {
      const db = getDatabase();
      db.collection("worklist")
        .findOne({ projectId: id, userId: userid })
        .then((data) => {
          // if duplicate is found
          if (data) {
            callback(data);
            return;
          }
          callback(null);
        })
        .catch((err) => {
          console.log("checkDuplicate- Error running query: " + err);
        });
    }
  });
};

exports.distributePoints = async (callback) => {
  const db = getDatabase();
  //get all workers from assigned projects
  db.collection("worklist")
    .find({ status: "Assigned" })
    .toArray()
    .then((assignedProjects) => {
      if (assignedProjects) {
        const numOfWorkers = assignedProjects.length;
        //Distribute points to associated users
        assignedProjects.forEach((project, index) => {
          const points = project.reward_points;
          const usersEarnedPoints = Math.floor(points / numOfWorkers);

          const user = project.userId;
          db.collection("profiles").updateOne(
            { username: user },
            { $inc: { points: usersEarnedPoints } }
          );

          if (index + 1 === numOfWorkers) {
            console.log(
              `${usersEarnedPoints} points distributed to ${numOfWorkers} workers`
            );
            //Set Project status completed after reward is distributed
            this.updateProjectComplete(project.projectId, (completed) => {
              if (completed) {
                callback(true);
              }
            });
          }
        });
      } else {
        console.log("distrubuteModel: No projects have been assigned");
        callback(null);
      }
    })
    .catch((err) => {
      console.log("Distribute points error:", err);
    });
};

exports.deleteWorklistProject = (id, db, callback) => {
  db.collection("worklist")
    .deleteOne({ projectId: id })
    .then((data) => {
      if (data.result.ok == 1) {
        console.log(data.result.n + " project has been deleted from worklist");
        callback(data.result);
        return;
      }
      callback(null);
    })
    .catch((err) => {
      console.log(`unable to delete worklist document: ${err}`);
    });
};
