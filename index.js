const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript",
  };
  

  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50,
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150,
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500,
      },
    ],
  };
  
  
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47,
      },
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150,
      },
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400,
      },
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39,
      },
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140,
      },
    },
  ];



  //=================================Step 1=================================================
function validateData(course, group) {
    // Validate AssignmentGroup-course relationship
    if (group.course_id !== course.id) {
      throw new Error(`Invalid data: AssignmentGroup ${group.id} does not belong to Course ${course.id}`);
    }
    
    // Validate Assignments within the group
    group.assignments.forEach(assignment => {
      if (assignment.points_possible === 0) {
        throw new Error(`Invalid data: Assignment ${assignment.id} has zero possible points.`);
      }
    });
}

//=====================================Step 2================================================= filter the assignment that is due
function filterValidAssignments(assignments) {
  const now = new Date();
  console.log(now);
  console.log(assignments)
  //the new Date helps to compare the asignment
  return assignments.filter(assignment => new Date(assignment.due_at) < now)
}

//==================================Step 3================================================= processes each learner submission 
function caculateAssignmentScores (submissions, assignments) {
  let scores = {};
  assignments.forEach(assignment => {
    let submission = submissions.find(sub => sub.assignment_id === assignment.id) 
    if (submission) {
      let score =submission.submission.score
      console.log(score)
      if (new Date(submission.submission.submitted_at) > new Date (assignment.due_at)){
        score -= assignment.points_possible * 0.1
      }
      scores[assignment.id] = (score/assignment.points_possible) * 100 
    } 
    console.log(submission)
    
  })
  return scores
}




//==========================================Step 4================================================= processes each learner submission 

function calculateWeightedAverage(scores, assignments) {
  let totalPoints = 0;
  let weightedScore = 0;
  
  assignments.forEach(assignment => {
    if (scores[assignment.id] !== undefined) {
      totalPoints += assignment.points_possible;
      weightedScore += (scores[assignment.id] / 100) *  assignment.points_possible;
    }
  });
  
  return (weightedScore / totalPoints) * 100;
}




//=============================================Main function=======================
function getLearnerData (course, ag, submissions) {
  try {
    validateData(course, ag)

    const validAssignment = filterValidAssignments(ag.assignments)
    // console.log(validAssignment)
    const learner = {}
  submissions.forEach(submission => {
    //we want to group each learner individually
    if (!learner[submission.learner_id]) {
      learner[submission.learner_id] = {
        id: submission.learner_id,
        score: {
  
        }
      }
    }
    learner[submission.learner_id].score = caculateAssignmentScores(submissions.filter(sub => sub.learner_id === submission.learner_id), validAssignment)
  })

    const results = Object.values(learner).map(learner => {
    const learnerScores = learner.scores;
    const average = calculateWeightedAverage(learnerScores, validAssignments);

    return {
      id: learner.id,
      avg: average,
      ...learnerScores
    };
  });
    return results 
  } catch (error) {
    console.error(`Error processing data: ${error.message}`);
    return [];
  }
 
}

getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions)