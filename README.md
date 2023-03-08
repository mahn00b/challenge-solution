# Coding Challenge for Braven

## Description
This is a node.js application designed to group students into diverse and equitable cohorts based on their major and seniority. The goal is to create cohorts that are as diverse as possible in terms of seniority and major distribution.

## Setup

### Pre-requisites
This application requires Node.js v18, the latest LTS version at the time of writing. Make sure that Node.js v18 is installed on your system before running the application.

### Run Instructions
No third-party dependencies are required for this application.

To run the application, execute the following command:
```BASH
$ node index.js
```

Alternatively, you can use your favorite package manager to run the start script:
```BASH
# npm
$ npm run start

# yarn
$ yarn start
```

## Solution

In order to allocate students to a specific cohort, we first needed to determine what an equitable division of cohorts actually looks like. We pre-processed the dataset to determine the average age of the students and the distribution of majors. Here's what we found:

- The average level of seniority is 1.9 years away from graduating.
- The majors were distributed fairly evenly with no more than a difference of 1 student between all unique majors. (4-5 students per)
- There were 13 unique majors

Given these findings, we determined that:

- Cohorts should prioritize adding students who don't have their major represented among their existing cohort members.
- In order to get evenly distributed ages, the cohort should prefer students who bring the cohort seniorityAverage closer to the average seniority among all students.
Using these assumptions based on the pre-processed data, we derived an algorithm for allocating cohorts.

## Algorithm

1. Read the students from the file and create ORM JSON objects that we can leverage in our logic.
2. Determine the average age of all the students.
3. Initialize 9 cohorts.
4. For each student:
  a. Iterate through each cohort to find the first one that meets the following criteria:
    - The cohort doesn't already include a student that has the student's major.
    - The student's seniority improves the average level of seniority among the students. (Improving means bringing the average closer to the total average.)
  b. If no such cohort exists, we default to the first one.
  c. Sort the cohorts after each student addition based on the following criteria:
    - Cohorts with the least number of students are prioritized.
    - Among Cohorts with the same number of students, the priority is given to cohorts whose average seniority is further away from the total average.
5. Once every student has been assigned to a cohort, we print the result to the console.

You can checkout the results in the [results section](#results)

## Improvements

In hindsight, there are several improvements we would make to this solution:

1. When determining whether the seniority level of a student will positively impact the cohort's average, we should use more specific distance calculations for more precise allocations.

2. We could improve the sorting algorithm so that it does not perform an `O(nlogn)` operation for each student. For this case, it was not impactful due to the low number of cohorts. However, when scaling to hundreds or thousands of students and/or cohorts, this can quickly become expensive and time-consuming. Perhaps utilizing more efficient data structures such as a k-MinHeap could improve the performance of this sorting operation.

3. Use a different data structure for storing students and cohorts. The current algorithm uses an array to store students and an array of arrays to store cohorts. However, you could use a different data structure such as a linked list, hash table, or binary search tree to store the students and cohorts. This could improve the efficiency of the algorithm, especially if you are working with a large number of students and cohorts.

4. Add a feedback loop for improvement. After the initial cohort assignments have been made, you could add a feedback loop to the algorithm to see how well the cohort assignments are working in practice. For example, you could ask students to rate their satisfaction with their cohort or monitor the academic performance of each cohort. This feedback could be used to make further improvements to the algorithm over time.


## Results
Overall, the distribution was fairly even among the cohorts in terms of average seniority being between `1.9 and 2.0`. However, some of the cohorts tended to be leaning more towards the senior or junior side. Perhaps the improvements suggested in the section above would

Below you'll find the results:

Cohort 1
----------
Jazmeen Wu Biology 1
Chiang Dupont Italian 3
Michelle Gonzales Comparative Literature 3
Elena Braut Gender Studies 3
John Dupont Physics 3
Xiao Liu Italian 1.5

Cohort 2
----------
Hilda Wong English 1.5
Jose Kim History 1
Natasha Kim Physics 2
Abdul Wong Applied Math 2
Elena Liu General Education 2

Cohort 3
----------
Makinde Braut Comparative Literature 3
Abdul Davidson Comparative Literature 1
Yancy Gonzales Biology 3.5
Lana Wong General Education 3
David Sukhani History 0.5

Cohort 4
----------
Michelle Lang History 2
Hilda Ramirez Computer Science 1
Lana Gauss Gender Studies 0.5
Hans Bonaparte Italian 1.5
David Mohader Russian 2
Hans Tanna Math 2

Cohort 5
----------
Pierre Sukhani Physics 2
Wing Wilkinson General Education 1
Hans Johnson Russian 0.5
Chiang Herbst History 1.5
Xiao Gonzales Italian 1.5
Natasha Gauss Biology 1.5

Cohort 6
----------
Bodu Wilkinson General Education 2
Jose Herbst English 3
Wing Sukhani Math 1
Xiao Smith Biology 0.5
Bodu Jones Computer Science 3.5

Cohort 7
----------
Jazmeen Bonaparte Computer Science 3.5
Elena Ramirez Biology 1
Herman Wu English 2.5
Bodu Jones Math 2.5
Wing Tanna Gender Studies 3
Makinde Dupont Russian 3

Cohort 8
----------
David Herbst Math 0.5
Jamie Lang Gender Studies 3
Abdul Wu Physics 0.5
Herman Mohader Computer Science 3
Jamie Liu Applied Math 2

Cohort 9
----------
John Gauss Applied Math 3.5
Yancy Johnson Russian 1.5
Chiang Smith Applied Math 0.5
Pierre Ramirez English 1
Makinde Davidson Comparative Literature 2
