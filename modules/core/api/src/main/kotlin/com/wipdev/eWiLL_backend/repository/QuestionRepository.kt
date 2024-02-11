package com.wipdev.eWiLL_backend.repository;

import com.wipdev.eWiLL_backend.database.tables.oralexaminator.Question
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
@Repository
interface QuestionRepository : JpaRepository<Question, Long>
