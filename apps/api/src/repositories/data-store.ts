import { seedJobs, seedNotifications, seedResources, seedStudents } from "../data/seed";
import { Job, NotificationItem, ScamReport, Student } from "../types";
import { createId } from "../utils/id";

class DataStore {
  students = [...seedStudents];
  resources = [...seedResources];
  jobs = [...seedJobs];
  notifications = [...seedNotifications];
  scamReports: ScamReport[] = [];

  findStudentByEmail(email: string) {
    return this.students.find((student) => student.email.toLowerCase() === email.toLowerCase());
  }

  findStudentById(id: string) {
    return this.students.find((student) => student.id === id);
  }

  findStudentBySlug(slug: string) {
    return this.students.find((student) => student.profileSlug === slug);
  }

  addStudent(student: Omit<Student, "id" | "createdAt">) {
    const nextStudent: Student = {
      ...student,
      id: createId("student"),
      createdAt: new Date().toISOString(),
    };
    this.students.unshift(nextStudent);
    return nextStudent;
  }

  updateStudent(studentId: string, partial: Partial<Student>) {
    const index = this.students.findIndex((student) => student.id === studentId);
    if (index === -1) {
      return undefined;
    }

    this.students[index] = {
      ...this.students[index],
      ...partial,
    };

    return this.students[index];
  }

  addNotification(notification: NotificationItem) {
    this.notifications.unshift(notification);
    return notification;
  }

  addScamReport(report: ScamReport) {
    this.scamReports.unshift(report);
    return report;
  }
}

export const dataStore = new DataStore();
