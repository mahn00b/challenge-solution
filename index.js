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

function divideCohorts() {

}

function main() {
  const students = readStudents();

  const calcs = students.data.reduce((acc, e)=> {
    const { seniority, tallies } = acc;

    const s = seniority + parseFloat(e[3])
    tallies[e[4]] = tallies[e[4]] ? tallies[e[4]] + 1 : 1


    return {
      seniority: s,
      tallies
    }
  }, {
    seniority: 0,
    tallies: {}
  })

// Get the avg level of seniority for all students
const avgYear = (calcs.seniority / 50).toFixed(1);
const majorTallies = calcs.tallies

  const cohorts = new Array(9).fill(null).map(() => ({
    avgSeniority: 0,
    majorsRepresented: {},
    studentIds: []
  }))

  for(let i = 0; i < students.data.length; i++) {
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

      let closerToAverage = false;

      if (seniority > avgSeniority && avgSeniority < avgYear ||
        seniority > avgSeniority && avgSeniority < avgYear) {
        closerToAverage = true;
      }

      if (!majorsRepresented[major] && closerToAverage) {
        cohorts[k].avgSeniority = (( (avgSeniority * studentIds.length) + seniority ) / (studentIds.length + 1)).toFixed(1)
        studentIds.push(i + 1)
        majorsRepresented[major] = true;
        break;
      }

      if (k === cohorts.length - 1) {
        // if none of the cohorts match the criteria, we automatically pick the first cohort because it's the one with the least students and the greater distance from the average.
        // we know this because it's sorted later
        cohorts[0].avgSeniority = (( (avgSeniority * studentIds.length) + seniority ) / (studentIds.length + 1)).toFixed(1)
        cohorts[0].studentIds.push(i + 1)
        majorsRepresented[major] = true;
      }
    }

    cohorts.sort((a, b) => {
      const { studentIds: aIds, avgSeniority: avgA } = a
      const { studentIds: bIds, avgSeniority: avgB } = b

      const diffInStudents = aIds.length - bIds.length;

      if (diffInStudents === 0) {
        const distanceA = Math.abs(avgYear - avgA);
        const distanceB = Math.abs(avgYear - avgB);

        return distanceB - distanceA
      }

      return diffInStudents
    })
  }
  console.log(cohorts)
}

main();
