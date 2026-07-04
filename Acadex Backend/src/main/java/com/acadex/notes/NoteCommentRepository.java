package com.acadex.notes;

import com.acadex.model.Note;
import com.acadex.model.NoteComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteCommentRepository extends JpaRepository<NoteComment, Long> {

    List<NoteComment> getAllByNote(Note note);

    void deleteAllByNote(Note note);
}
