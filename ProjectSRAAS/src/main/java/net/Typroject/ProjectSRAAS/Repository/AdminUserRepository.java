package net.Typroject.ProjectSRAAS.Repository;

import net.Typroject.ProjectSRAAS.Entity.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminUserRepository extends JpaRepository<AdminUser, String> {
    AdminUser findByUsername(String username);
}
