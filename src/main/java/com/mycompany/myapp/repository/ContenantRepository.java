package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Contenant;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Contenant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ContenantRepository extends JpaRepository<Contenant, Long> {
    //    @Param("SELECT c FROM Contenant c WHERE c.nom = :nom")
    //    Optional<Contenant> findByNom(String nom);

}
