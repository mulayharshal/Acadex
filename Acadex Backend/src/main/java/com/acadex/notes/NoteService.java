package com.acadex.notes;

import com.acadex.auth.AuthRepository;
import com.acadex.common.ApiResponse;
import com.acadex.config.FileStorageService;
import com.acadex.model.*;
import com.acadex.dto.noteDto;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {
    @Autowired
    AuthRepository authRepository;
    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private NoteLikeRepository noteLikeRepository;

    @Autowired
    private NoteSaveRepository noteSaveRepository;

    @Autowired
    private NoteCommentRepository noteCommentRepository;


//    adding new notes
    public ResponseEntity<ApiResponse<Note>> uploadNote(noteDto noteDto, String email) {
        try {
            User user = authRepository.findByEmail(email).get();
            String filePath = fileStorageService.saveFile(noteDto.getFile(),"notes");

            Note note = new Note();
            note.setTitle(noteDto.getTitle());
            note.setDescription(noteDto.getDescription());
            note.setCategory(noteDto.getCategory());
            note.setTags(noteDto.getTags());
            note.setFile(filePath);
            note.setUploadedBy(user);

            noteRepository.save(note);
            return ResponseEntity.ok(ApiResponse.success("Note uploaded successfully", note));

        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Failed: " + e.getMessage()));
        }
    }

//    get the all notes
    public ResponseEntity<ApiResponse<List<Note>>> getAllNotes(){
        List<Note> notes=noteRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Notes found", notes));
    }

//    get one notes
    public ResponseEntity<ApiResponse<Note>> getNoteById(Long id){
        Note note=noteRepository.findById(id).orElse(null);
        if(note==null){
            return ResponseEntity.ok(ApiResponse.error("Note not found"));
        }else {
            return ResponseEntity.ok(ApiResponse.success("Note found", note));
        }
    }

//    delete the note
    @Transactional
    public ResponseEntity<ApiResponse<String>> deleteNoteById(Long id){
        Note note=noteRepository.findById(id).orElse(null);

        if(note==null){
            return ResponseEntity.ok(ApiResponse.error("Note not found"));
        }
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if(!note.getUploadedBy().getEmail().equals(email)) {
            return ResponseEntity.ok(ApiResponse.error("You can only delete your own notes"));
        }

        noteLikeRepository.deleteAllByNoteId(note.getId());
        noteSaveRepository.deleteAllByNote(note);
        noteRepository.delete(note);
        return ResponseEntity.ok(ApiResponse.success("Notes deleted","notes deleted"));
    }

//    like the notes
    @Transactional
    public ResponseEntity<ApiResponse<String>> likeNote(Long id,String email){
        User user=authRepository.findByEmail(email).orElse(null);
        Note note=noteRepository.findById(id).orElse(null);
        if (note==null || user==null){
            return ResponseEntity.ok(ApiResponse.error("Note not found"));
        }

        if(noteLikeRepository.existsByNoteAndUser(note,user)){
           noteLikeRepository.deleteByNoteAndUser(note,user);
           note.setLikeCount(note.getLikeCount()-1);
           noteRepository.save(note);
           return ResponseEntity.ok(ApiResponse.success("like removed","like deleted successfully"));
        }else {
            NoteLike noteLike=new NoteLike();
            noteLike.setNote(note);
            noteLike.setUser(user);
            noteLikeRepository.save(noteLike);
            note.setLikeCount(note.getLikeCount()+1);
            noteRepository.save(note);
            return ResponseEntity.ok(ApiResponse.success("like added","like added successfully"));
        }
    }


//  save the Note
    @Transactional
    public ResponseEntity<ApiResponse<String>> saveNote(Long id ,String email){
        User user =authRepository.findByEmail(email).orElse(null);
        Note note=noteRepository.findById(id).orElse(null);
        if (note==null || user==null){
            return ResponseEntity.ok(ApiResponse.error("Note not found"));
        }
        if(noteSaveRepository.existsByNoteAndUser(note,user)){
            noteSaveRepository.deleteByNoteAndUser(note,user);
            note.setSaveCount(note.getSaveCount()-1);
            noteRepository.save(note);
            return  ResponseEntity.ok(ApiResponse.success("note unsaved","note unsaved successfully"));
        }else {
            NoteSave noteSave=new NoteSave();
            noteSave.setNote(note);
            noteSave.setUser(user);
            noteSaveRepository.save(noteSave);
            note.setSaveCount(note.getSaveCount()+1);
            noteRepository.save(note);
            return ResponseEntity.ok(ApiResponse.success("note saved","note saved successfully"));
        }
    }


//    comments on note
    public ResponseEntity<ApiResponse<NoteComment>> commentOnNote(Long id, String comment){
        Note note=noteRepository.findById(id).orElse(null);
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user=authRepository.findByEmail(email).orElse(null);
        if(note==null || user==null){
            return ResponseEntity.ok(ApiResponse.error("Note not found"));
        }
        NoteComment newComment=new NoteComment();
        newComment.setNote(note);
        newComment.setUser(user);
        newComment.setComment(comment);
        noteCommentRepository.save(newComment);
        return ResponseEntity.ok(ApiResponse.success("Commented Successfully",newComment));
    }

//    delete the comment
    public ResponseEntity<ApiResponse<String>> deleteComment(Long id,Long commentId){
        String email=SecurityContextHolder.getContext().getAuthentication().getName();

        NoteComment noteComment=noteCommentRepository.findById(commentId).orElse(null);
        if(noteComment==null){
            return ResponseEntity.ok(ApiResponse.error("Note comment not found"));
        }

        String commentOnwerEmail=noteComment.getUser().getEmail();
        String noteOnwerEmail=noteComment.getNote().getUploadedBy().getEmail();
        if(commentOnwerEmail.equals(email) || noteOnwerEmail.equals(email)){
            noteCommentRepository.deleteById(commentId);
            return ResponseEntity.ok(ApiResponse.success("comment deleted","comment deleted successfully"));
        }else  {
            return ResponseEntity.ok(ApiResponse.error("You can only delete your own comments or your notes comment"));
        }

    }

//    get all comment on note
    public ResponseEntity<ApiResponse<List<NoteComment>>> getComments(Long id){
        Note note=noteRepository.findById(id).orElse(null);
        if(note==null){
            return ResponseEntity.ok(ApiResponse.error("Note not found"));
        }
        List<NoteComment> allComments=noteCommentRepository.getAllByNote(note);
        return ResponseEntity.ok(ApiResponse.success("All comments",allComments));
    }

//    search notes
    @Transactional
    public ResponseEntity<ApiResponse<List<Note>>> searchNotes(String keyword){
        if(keyword==null || keyword.isEmpty()){
            return ResponseEntity.ok(ApiResponse.error("Keyword not be empty"));
        }
        List<Note> notes=noteRepository.searchNotes(keyword);
        return ResponseEntity.ok(ApiResponse.success("Notes found",notes));
    }


}
