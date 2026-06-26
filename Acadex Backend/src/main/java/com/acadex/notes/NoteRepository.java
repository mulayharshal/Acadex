package com.acadex.notes;

import com.acadex.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note,Long> {

    @Query("SELECT n FROM Note n WHERE " +
            "LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(n.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(n.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(n.tags) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Note> searchNotes(@Param("keyword") String keyword);
}
