package com.acadex.project;

import com.acadex.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project,Long> {


    @Query("SELECT n FROM Project n WHERE " +
            "LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(n.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(n.techStack) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(n.tags) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Project> searchProjects(@Param("keyword") String keyword);

}
