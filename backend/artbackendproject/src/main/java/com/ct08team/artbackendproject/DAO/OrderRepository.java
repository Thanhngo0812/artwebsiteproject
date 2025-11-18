package com.ct08team.artbackendproject.DAO;

import com.ct08team.artbackendproject.Entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // (Spring Data JPA tự động cung cấp save(), findById(), v.v.)
}