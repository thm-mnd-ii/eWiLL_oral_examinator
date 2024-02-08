import Question from "@/model/oral_examinator/Question";
import axios, { AxiosResponse } from "axios";
import authHeader from "./auth-header";


class QuestionService {
  updateQuestion(question: Question): Promise<AxiosResponse<Question>> {
    return axios.post("http://localhost:8080/api/question/update/" + question.id, question, {
      headers: authHeader(),
    });
  }

  getQuestion(): Promise<AxiosResponse<Question[]>> {
    return axios.post("http://localhost:8080/api/question/get", { headers: authHeader() });
  }

  createQuestion(question: Question): Promise<AxiosResponse<Question>> {
    return axios.post("http://localhost:8080/api/question/create", question, {
      headers: authHeader(),
    });
  }



  deleteQuestion(questionId: number) {
    return axios.delete( "http://localhost:8080/api/question/delete/" + questionId, { headers: authHeader() }); 
  }
}

export default new QuestionService();
