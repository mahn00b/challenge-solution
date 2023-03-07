const fs = require('fs');
const path = require('path');

const STUDENTS_DATA_PATH = path.join(__dirname, './data/students.csv')
const COHORT_MAX_STUDENTS = 8;

function readStudents() {
  const buffer = fs.readFileSync(STUDENTS_DATA_PATH)

  const [headers, ...data] = buffer.toString().split(/[\r]?\n/gi)

  return data.map((raw) => {
    const student = raw.split(',')

    return headers.toLowerCase().replace('years until graduation', 'seniority').split(',').reduce((acc, e, index) => {
      console.log(acc, e, index)
      acc[e] = student[index];
      return acc;
    }, {})
  });
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
  const seniority = parseFloat(student.seniority)

  const numStudents = cohort.studentIds.length;

  cohort.avgSeniority = addNewValueToAverage(cohort.avgSeniority, numStudents, seniority)
  cohort.studentIds.push(student.id)
  cohort.majorsRepresented[student.major] = true;
}

function main() {
  const students = readStudents();

  const sumOfSeniorityLevel = students.reduce((acc, e) => (acc + parseFloat(e.seniority)), 0)

  const avgYear = (sumOfSeniorityLevel / students.length).toFixed(1);

  const cohorts = new Array(9).fill(null).map((_, index) => ({
    // Not a functional requirement but realistically each one would have a unique identifier
    id: index,
    avgSeniority: 0,
    majorsRepresented: {},
    studentIds: []
  }))

  const compareCohorts = generateComparer(avgYear);

  for (let i = 0; i < students.length; i++) {
    const student = students[i]
    const seniority = parseFloat(student.seniority)
    const major = student.major;

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
