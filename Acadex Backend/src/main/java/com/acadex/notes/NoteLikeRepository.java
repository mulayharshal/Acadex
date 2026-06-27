package com.acadex.notes;

import com.acadex.model.Note;
import com.acadex.model.NoteLike;
import com.acadex.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoteLikeRepository extends CrudRepository<NoteLike, Long> {
    boolean existsByNoteAndUser(Note note, User user);

    void deleteByNoteAndUser(Note note, User user);

    void deleteAllByNoteId(Long noteId);

}
