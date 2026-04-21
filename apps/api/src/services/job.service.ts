import { dataStore } from "../repositories/data-store";
import { Student } from "../types";

function scoreJobForStudent(job: typeof dataStore.jobs[number], student: Student) {
  const skillMatches = job.skillsRequired.filter((skill) =>
    student.skills.some((studentSkill) => studentSkill.toLowerCase() === skill.toLowerCase()),
  ).length;

  return (job.verified ? 8 : 2) + skillMatches * 3;
}

export function listJobs(student?: Student) {
  const jobs = [...dataStore.jobs].sort((left, right) => {
    if (!student) {
      return Number(right.verified) - Number(left.verified);
    }

    return scoreJobForStudent(right, student) - scoreJobForStudent(left, student);
  });

  return jobs;
}
