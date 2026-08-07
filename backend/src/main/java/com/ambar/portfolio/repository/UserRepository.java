package com.ambar.portfolio.repository;

import com.ambar.portfolio.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {


    User findByEmail(String email);
    User findFirstByName(String name);

}