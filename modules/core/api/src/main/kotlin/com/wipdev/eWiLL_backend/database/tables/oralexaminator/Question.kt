package com.wipdev.eWiLL_backend.database.tables.oralexaminator

import javax.persistence.*

@Entity
@Table(name = "Question")
data class Question(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    var id: Long? = null,

    @Column(name = "text", nullable = true)
    var text: String? = null,

    @Column(name = "link", nullable = true)
    var link: String? = null,


    @Column(name = "course_id", nullable = true)
    var course_id: Long? = null,

    @Column(name = "solution", nullable = false)
    var solution: CharArray? = null,


    
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || javaClass != other.javaClass) return false

        other as Question

        return id == other.id
    }

    override fun hashCode(): Int {
        return id?.hashCode() ?: 0
    }

    override fun toString(): String {
        return "Question(id=$id, text=$text, link=$link, course_id=$course_id, solution=$solution)"
    }
}