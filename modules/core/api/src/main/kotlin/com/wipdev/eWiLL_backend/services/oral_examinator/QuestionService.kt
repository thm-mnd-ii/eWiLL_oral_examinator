package com.wipdev.eWiLL_backend.services

import com.wipdev.eWiLL_backend.database.tables.oralexaminator.Question
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

    fun update(id: Long, updatedQuestion: Question) {
        val question = findById(id)
        question?.let {
            it.text = updatedQuestion.text
            it.link = updatedQuestion.link
            it.course_id = updatedQuestion.course_id
            it.solution = updatedQuestion.solution
            questionRepository.save(it)
        }
    }
}