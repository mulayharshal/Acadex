package com.acadex.notes;

import com.acadex.model.Note;
import com.acadex.model.NoteSave;
import com.acadex.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoteSaveRepository extends CrudRepository<NoteSave, Long> {

    boolean existsByNoteAndUser (Note note, User user);
    void deleteByNoteAndUser (Note note, User user);
    void deleteByIdAndUser (Long id, User user);
    void deleteAllByNote(Note note);

}
