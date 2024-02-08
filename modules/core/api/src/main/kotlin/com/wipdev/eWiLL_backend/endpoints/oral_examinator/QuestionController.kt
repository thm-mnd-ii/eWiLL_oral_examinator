package com.wipdev.eWiLL_backend.endpoints

import com.wipdev.eWiLL_backend.database.tables.oralexaminator.Question
import com.wipdev.eWiLL_backend.services.oral_examinator.QuestionService
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@RestController
@RequestMapping("/api/question")
@Tag(name = "Question", description = "Question API used for managing questions")
class QuestionController {

    @Autowired
    lateinit var questionService: QuestionService

    @PostMapping("/create")
    fun createQuestion(@RequestBody questionRequest: QuestionRequest) {
        val question = Question()
        question.text = questionRequest.text
        question.link = questionRequest.link
        question.course_id = questionRequest.courseId
        question.solution = questionRequest.solution
        questionService.save(question)
    }

    @GetMapping("/get")
    fun getQuestions(): List<Question> {
        return questionService.findAll()
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    fun deleteQuestion(@PathVariable id: Long) {
        questionService.delete(id)
    }

    @PostMapping("/update/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    fun updateQuestion(@PathVariable id: Long, @RequestBody questionRequest: QuestionRequest) {
        questionService.update(id, questionRequest)
    }
}

data class QuestionRequest(
    val text: String,
    val link: String?,
    val courseId: Long?,
    val solution: CharArray?
)
