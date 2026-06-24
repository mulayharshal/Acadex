package com.acadex.project;

import com.acadex.model.Project;
import com.acadex.model.ProjectComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectCommentRepository extends JpaRepository<ProjectComment,Long> {

    List<ProjectComment> getAllByProject(Project project);
}
