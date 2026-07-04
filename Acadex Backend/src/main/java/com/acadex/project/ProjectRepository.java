package com.acadex.project;

import com.acadex.model.Project;
import com.acadex.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project,Long> {


    @Query("SELECT n FROM Project n WHERE " +
            "LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "n.description LIKE CONCAT('%', :keyword, '%') OR " +
            "LOWER(n.techStack) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(n.tags) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Project> searchProjects(@Param("keyword") String keyword);

    List<Project> findAllByUploadedBy(User uploadedBy);
    List<Project> findAllByOrderByUploadedDateDesc();

    List<Project> findAllByUploadedByOrderByUploadedDateDesc(User user);
}
