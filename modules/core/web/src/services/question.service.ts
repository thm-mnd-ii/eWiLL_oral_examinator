import Question from "@/model/oral_examinator/Question";
import axios, { AxiosResponse } from "axios";
import authHeader from "./auth-header";


class QuestionService {
  updateQuestion(question: Question): Promise<AxiosResponse<Question>> {
    return axios.post("/api/question/update/" + question.id, question, {
      headers: authHeader(),
    });
  }

  getQuestion(): Promise<AxiosResponse<Question[]>> {
    return axios.post("/api/question/get", { headers: authHeader() });
  }

  createQuestion(question: Question): Promise<AxiosResponse<Question>> {
    return axios.post("/api/question/create", question, {
      headers: authHeader(),
    });
  }



  deleteQuestion(questionId: number) {
    return axios.delete("/api/question/delete/" + questionId, { headers: authHeader() }); 
  }
}

export default new QuestionService();
