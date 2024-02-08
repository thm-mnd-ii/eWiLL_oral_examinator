package com.wipdev.eWiLL_backend.services.oral_examinator

import com.wipdev.eWiLL_backend.database.tables.oralexaminator.Question
import com.wipdev.eWiLL_backend.endpoints.payload.requests.QuestionPL
import com.wipdev.eWiLL_backend.repository.QuestionRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class QuestionService {

    @Autowired
    lateinit var questionRepository: QuestionRepository

    fun findAll(): List<Question> {
        return questionRepository.findAll()
    }

    fun save(question: Question) {
        questionRepository.save(question)
    }

    fun delete(id: Long) {
        questionRepository.deleteById(id)
    }

    fun findById(id: Long): Question? {
        return questionRepository.findById(id).orElse(null)
    }

    fun update(id: Long, questionPL: QuestionPL) {
        val question = findById(id)
        question?.let {
            it.text = questionPL.text
            it.link = questionPL.link
            it.course_id = questionPL.course_id
            it.solution = questionPL.solution
            questionRepository.save(it)
        }
    }
}