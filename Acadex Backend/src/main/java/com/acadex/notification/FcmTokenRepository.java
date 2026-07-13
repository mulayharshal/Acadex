package com.acadex.notification;

import com.acadex.model.FcmToken;
import com.acadex.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FcmTokenRepository extends JpaRepository<FcmToken, Long> {

    Optional<FcmToken> findByToken(String token);

    List<FcmToken> findByUser(User user);

    void deleteByToken(String token);

    void deleteByUser(User user);

    boolean existsByToken(String token);

    List<FcmToken> findAllByUser(User noteOwner);
}