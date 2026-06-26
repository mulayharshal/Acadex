package com.acadex.project;

import com.acadex.model.Project;
import com.acadex.model.ProjectSave;
import com.acadex.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectSaveRepository extends JpaRepository<ProjectSave,Integer> {

    boolean existsByUserAndProject(User user, Project project);
    void deleteByUserAndProject(User user, Project project);

    void deleteAllByProject(Project project);
}
