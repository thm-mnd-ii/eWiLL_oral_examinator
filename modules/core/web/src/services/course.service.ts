import axios, { AxiosResponse } from "axios";
import CoursePL from "../model/course/CoursePL";
import CourseAndParticipationPL from "../model/course/CourseAndParticipationPL";
import Member from "../model/course/Member";
import CourseRoles from "@/enums/CourseRoles";

class CourseService {
  getCourse(id: number): Promise<AxiosResponse<CoursePL>> {
    return axios.get("/api/course/" + id);
  }

 getAllCourses(userId: number): Promise<CourseAndParticipationPL[]> {
  return new Promise<CourseAndParticipationPL[]>((resolve, reject) => {
    axios
      .get(`/api/course/all/${userId}`) // Annahme: Die API unterstützt die Filterung nach dem Ersteller
      .then((response) => {
        const courses: CourseAndParticipationPL[] = response.data;
        resolve(courses);
        console.log(courses);
      })
      .catch((error) => {
        console.log(error);
        reject();
      });
  });
}


  postCourse(course: CoursePL) {
    course.id = 0;
    return axios.post("/api/course", course);
  }

  putCourse(course: CoursePL) {
    return axios.put("/api/course/" + course.id, course);
  }

  joinCourse(courseId: number, key: string, userId: number) {
    return axios.post("/api/course/" + courseId + "/join", {
      keyPass: key,
      userId: userId,
    });
  }

  leaveCourse(courseId: number, userId?: number) {
    return axios.post("/api/course/" + courseId + "/leave?userId=" + userId);
  }

  getUserRoleInCourse(userId: number, courseId: number): Promise<CourseRoles> {
    return new Promise<CourseRoles>((resolve, reject) => {
      axios
        .get("/api/course/" + courseId + "/user/" + userId + "/role")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
  }

  changeUserRole(
    courseId: number,
    userId: number,
    role: string,
    executorUserId: number
  ) {
    return axios.post(
      "/api/course/" +
        courseId +
        "/changeUserRole/" +
        userId +
        "/" +
        role +
        "/" +
        executorUserId
    );
  }

  deleteCourse(courseId: number) {
    return axios.delete("/api/course/" + courseId);
  }

  getCourseMembers(courseId: number) {
    return axios.get("/api/course/" + courseId + "/students");
  }

  getCourseMembersAsMap(courseId: number): Promise<Map<number, Member>> {
    const map: Map<number, Member> = new Map();
    return new Promise<Map<number, Member>>((resolve, reject) => {
      this.getCourseMembers(courseId)
        .then((response) => {
          response.data.forEach((element: Member) => {
            map.set(element.user.id, element);
          });
          resolve(map);
        })
        .catch(() => {
          reject();
        });
    });
  }
}

export default new CourseService();
