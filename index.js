const fs = require('fs');
const path = require('path');

const STUDENTS_DATA_PATH = path.join(__dirname, './data/students.csv')
const COHORT_MAX_STUDENTS = 8;
const COHORT_MIN_STUDENTS = 4;

function readStudents() {
  const buffer = fs.readFileSync(STUDENTS_DATA_PATH)

  const [headers, ...data] = buffer.toString().split(/[\r]?\n/gi)

  return {
    headers: headers.split(','),
    data: data.map((s) => s.split(','))
  }
}

// Factory function that generates a sorting function based on the avgYear
function generateComparer(avgYear){
  return (a, b) => {
    const { studentIds: aIds, avgSeniority: avgA } = a
    const { studentIds: bIds, avgSeniority: avgB } = b
    // returns the one with the least Ids
    const diffInStudents = aIds.length - bIds.length;

    // if they have the same number of students
    if (diffInStudents === 0) {
      const distanceA = Math.abs(avgYear - avgA);
      const distanceB = Math.abs(avgYear - avgB);
      // return the one with the distance furthest from the avg
      return distanceB - distanceA
    }

    return diffInStudents
  }
}

function doesImproveAverage(seniority, avgSeniority, avgYear) {
  // If the student's level of seniority improves the distance from the avg
  if (
    seniority > avgSeniority && avgSeniority < avgYear ||
    seniority > avgSeniority && avgSeniority > avgYear
  ) {
    return true;
  }

  return false;
}

function addNewValueToAverage(currentAvg, currentQuantity, newAverage) {
  const previousTotal = currentAvg * currentQuantity;
  return ((previousTotal + newAverage) / (currentQuantity + 1)).toFixed(1);
}

function addStudentToCohort(cohort, student) {
  const id = student[0]
  const seniority = parseFloat(student[3])
  const major = student[4]

  const numStudents = cohort.studentIds.length;

  cohort.avgSeniority = addNewValueToAverage(cohort.avgSeniority, numStudents, seniority)
  cohort.studentIds.push(id)
  cohort.majorsRepresented[major] = true;
}

function main() {
  const students = readStudents();

  const sumOfSeniorityLevel = students.data.reduce((acc, e) => (acc + parseFloat(e[3])), 0)

  const avgYear = (sumOfSeniorityLevel / 50).toFixed(1);

  const cohorts = new Array(9).fill(null).map(() => ({
    avgSeniority: 0,
    majorsRepresented: {},
    studentIds: []
  }))

  const compareCohorts = generateComparer(avgYear);

  for (let i = 0; i < students.data.length; i++) {
    const student = students.data[i]
    const seniority = parseFloat(student[3])
    const major = student[4];

    for (let k = 0; k < cohorts.length; k++) {
      const {
        majorsRepresented,
        avgSeniority,
        studentIds
      } = cohorts[k]

      if (studentIds.length === COHORT_MAX_STUDENTS) continue;

      if (!majorsRepresented[major] && doesImproveAverage(seniority, avgSeniority, avgYear)) {
        addStudentToCohort(cohorts[k], student)
        break;
      }

      if (k === cohorts.length - 1) {
        // if none of the cohorts match the criteria, we automatically pick the first cohort because it's the one with the least students and the greater distance from the average.
        // we know this because it's sorted later
        addStudentToCohort(cohorts[0], student)
      }
    }

    // Sort cohorts after every student insert.
    cohorts.sort(compareCohorts);
  }

  console.log(cohorts);
  return cohorts;
}

main();
