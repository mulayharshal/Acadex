package com.acadex.notes;

import com.acadex.common.ApiResponse;
import com.acadex.config.JwtUtil;
import com.acadex.dto.UpdateNoteDto;
import com.acadex.model.Note;
import com.acadex.model.NoteComment;
import com.acadex.dto.commentDto;
import com.acadex.dto.noteDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notes")
public class NoteController {

    @Autowired
    NoteService noteService;

    @Autowired
    JwtUtil jwtUtil;

//    new notes add
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Note>> createNote(
            @ModelAttribute noteDto noteDto,
            @RequestHeader("Authorization") String token) {

        String email = jwtUtil.extractEmail(token.substring(7));
        return noteService.uploadNote(noteDto, email);
    }

//    get all notes
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Note>>> getAllNotes(){
        return noteService.getAllNotes();
    }

//    get one notes
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Note>> getNoteById(@PathVariable Long id){
        return  noteService.getNoteById(id);
    }

//    delete one note
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteNoteById(@PathVariable Long id){
        return noteService.deleteNoteById(id);
    }

//    get my notes only
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Note>>> getMyNotes(){
        return noteService.getMyNotes();
    }

//    like unlike the note
    @PostMapping("/{id}/like")
    public ResponseEntity<ApiResponse<?>> likeNote(@PathVariable Long id,  @RequestHeader("Authorization") String token){
        String email = jwtUtil.extractEmail(token.substring(7));
        return noteService.likeNote(id, email);
    }

//    save unsave the notes
    @PostMapping("/{id}/save")
    public ResponseEntity<ApiResponse<?>> saveNote(@PathVariable Long id, @RequestHeader("Authorization") String token){
        String email = jwtUtil.extractEmail(token.substring(7));
        return noteService.saveNote(id ,email);
    }

//    comment on note
    @PostMapping("/{id}/comment")
    public ResponseEntity<ApiResponse<NoteComment>> commentOnNote(@PathVariable Long id, @RequestBody commentDto request){
        return noteService.commentOnNote(id, request.getComment());
    }

//    delete the comment
    @DeleteMapping("/{id}/comment/{commentId}")
    public ResponseEntity<ApiResponse<String>> deleteComment(@PathVariable Long id, @PathVariable Long commentId){
        return noteService.deleteComment(id, commentId);
    }

//    get all comments
    @GetMapping("/{id}/comment")
    public ResponseEntity<ApiResponse<List<NoteComment>>> getAllComments(@PathVariable Long id){
        return noteService.getComments(id);
    }

//    search notes
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Note>>> searchNotes(@RequestParam String keyword){
        return  noteService.searchNotes(keyword);
    }

//    update the notes
    @PatchMapping("/{noteId}")
    public ResponseEntity<ApiResponse<Note>> updateNote(@PathVariable Long noteId, @RequestBody UpdateNoteDto updateNoteDto){
        return noteService.updateNote(noteId,updateNoteDto);
    }

//    get saved my notes
    @GetMapping("/saved")
    public ResponseEntity<ApiResponse<List<Note>>> getMySavedNotes(){
        return noteService.getMySavedNotes();
    }
}
