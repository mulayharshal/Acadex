package com.acadex.project;

import com.acadex.model.ProjectLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectLikeRepository extends JpaRepository<ProjectLike,Long> {

    boolean existsByProjectIdAndUserId(Long projectId,Long userId);
    void deleteByProjectIdAndUserId(Long projectId,Long userId);
}
